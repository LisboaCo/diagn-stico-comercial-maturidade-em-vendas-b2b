-- =====================================================================
-- Diagnóstico Comercial · Maturidade em Vendas B2B
-- Tabela e RPC próprias, isoladas das respostas do TVSIM.
--
-- Rode no MESMO banco do PostgREST usado pelo TVSIM (secret
-- BANCO_CLIENT_HEALTH), com o mesmo usuário que criou dashboard_tvsim.respostas.
-- É idempotente: pode rodar mais de uma vez sem duplicar nada.
--
-- Não altera nem apaga nada do TVSIM. As permissões são COPIADAS das que já
-- existem em dashboard_tvsim.respostas / salvar_resposta, então a exposição
-- no PostgREST fica igual à do TVSIM, qualquer que seja a configuração atual:
--   * se o TVSIM usa fachada em client_health (view + função), cria a mesma
--     fachada para o comercial;
--   * se o PostgREST expõe dashboard_tvsim direto, os grants copiados bastam.
-- =====================================================================

begin;

create extension if not exists pgcrypto;
create schema if not exists dashboard_tvsim;

-- 1. Tabela ------------------------------------------------------------
create table if not exists dashboard_tvsim.respostas_comercial (
  id                uuid primary key default gen_random_uuid(),
  criado_em         timestamptz not null default now(),
  respostas         jsonb not null,
  pontos_fundacao   smallint not null,
  pontos_gestao     smallint not null,
  pontos_escala     smallint not null,
  nivel             text not null,
  nome              text not null,
  whatsapp          text not null,
  email             text not null,
  segmento          text not null default '',
  faixa_faturamento text not null,
  consentimento     boolean not null,
  constraint respostas_comercial_respostas_objeto check (jsonb_typeof(respostas) = 'object'),
  constraint respostas_comercial_fundacao_valida check (pontos_fundacao between 0 and 10),
  constraint respostas_comercial_gestao_valida   check (pontos_gestao   between 0 and 10),
  constraint respostas_comercial_escala_valida   check (pontos_escala   between 0 and 10),
  constraint respostas_comercial_nivel_valido    check (nivel in ('V0', 'V1', 'V2', 'V3'))
);

create index if not exists respostas_comercial_criado_em_idx
  on dashboard_tvsim.respostas_comercial (criado_em desc);

-- 2. RPC de gravação ---------------------------------------------------
create or replace function dashboard_tvsim.salvar_resposta_comercial(
  p_respostas         jsonb,
  p_pontos_fundacao   smallint,
  p_pontos_gestao     smallint,
  p_pontos_escala     smallint,
  p_nivel             text,
  p_nome              text,
  p_whatsapp          text,
  p_email             text,
  p_segmento          text,
  p_faixa_faturamento text,
  p_consentimento     boolean
)
returns jsonb
language plpgsql
security definer
set search_path = dashboard_tvsim, public
as $$
declare
  v_id uuid;
begin
  if coalesce(p_consentimento, false) is not true then
    raise exception 'Consentimento obrigatório' using errcode = '22023';
  end if;

  insert into dashboard_tvsim.respostas_comercial (
    respostas, pontos_fundacao, pontos_gestao, pontos_escala, nivel,
    nome, whatsapp, email, segmento, faixa_faturamento, consentimento
  ) values (
    p_respostas, p_pontos_fundacao, p_pontos_gestao, p_pontos_escala, p_nivel,
    left(btrim(p_nome), 120),
    left(btrim(p_whatsapp), 20),
    left(btrim(p_email), 160),
    left(btrim(coalesce(p_segmento, '')), 120),
    left(btrim(p_faixa_faturamento), 60),
    p_consentimento
  )
  returning id into v_id;

  return jsonb_build_object('id', v_id);
end;
$$;

-- 3. Fachada em client_health, somente se o TVSIM usa esse padrão ------
do $$
begin
  if to_regclass('client_health.respostas') is not null
     or exists (
       select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'client_health' and p.proname = 'salvar_resposta'
     )
  then
    execute $v$
      create or replace view client_health.respostas_comercial as
      select * from dashboard_tvsim.respostas_comercial
    $v$;

    execute $f$
      create or replace function client_health.salvar_resposta_comercial(
        p_respostas jsonb, p_pontos_fundacao smallint, p_pontos_gestao smallint,
        p_pontos_escala smallint, p_nivel text, p_nome text, p_whatsapp text,
        p_email text, p_segmento text, p_faixa_faturamento text, p_consentimento boolean
      )
      returns jsonb
      language sql
      security definer
      set search_path = pg_catalog, client_health, dashboard_tvsim
      as 'select dashboard_tvsim.salvar_resposta_comercial(
            p_respostas, p_pontos_fundacao, p_pontos_gestao, p_pontos_escala, p_nivel,
            p_nome, p_whatsapp, p_email, p_segmento, p_faixa_faturamento, p_consentimento)'
    $f$;
    raise notice 'Fachada criada em client_health (mesmo padrão do TVSIM).';
  else
    raise notice 'TVSIM não usa fachada em client_health; objetos ficam só em dashboard_tvsim.';
  end if;
end;
$$;

-- 4. Copiar permissões do TVSIM para os objetos novos ------------------
do $$
declare
  r record;
  pares text[][] := array[
    array['dashboard_tvsim.respostas', 'dashboard_tvsim.respostas_comercial'],
    array['client_health.respostas',   'client_health.respostas_comercial']
  ];
  i int;
  v_origem regclass;
  v_destino regclass;
begin
  -- Tabelas / views
  for i in 1 .. array_length(pares, 1) loop
    v_origem  := to_regclass(pares[i][1]);
    v_destino := to_regclass(pares[i][2]);
    continue when v_origem is null or v_destino is null;

    execute format('revoke all on %s from public', v_destino);
    for r in
      select case when a.grantee = 0 then 'public'
                  else quote_ident(pg_get_userbyid(a.grantee)) end as quem,
             a.privilege_type
      from pg_class c, aclexplode(c.relacl) a
      where c.oid = v_origem and a.grantee <> c.relowner
    loop
      execute format('grant %s on %s to %s', r.privilege_type, v_destino, r.quem);
      raise notice 'grant % on % to %', r.privilege_type, v_destino, r.quem;
    end loop;
  end loop;

  -- Funções: copia EXECUTE de <schema>.salvar_resposta para <schema>.salvar_resposta_comercial
  for r in
    select n.nspname as esquema, p.proacl, p.proowner
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 'salvar_resposta'
      and n.nspname in ('dashboard_tvsim', 'client_health')
  loop
    if not exists (
      select 1 from pg_proc p2 join pg_namespace n2 on n2.oid = p2.pronamespace
      where n2.nspname = r.esquema and p2.proname = 'salvar_resposta_comercial'
    ) then
      continue;
    end if;

    -- proacl nulo = padrão do Postgres (EXECUTE para public): mantém o padrão.
    if r.proacl is not null then
      execute format('revoke all on function %I.salvar_resposta_comercial from public', r.esquema);
      declare g record;
      begin
        for g in
          select case when a.grantee = 0 then 'public'
                      else quote_ident(pg_get_userbyid(a.grantee)) end as quem
          from aclexplode(r.proacl) a
          where a.privilege_type = 'EXECUTE' and a.grantee <> r.proowner
        loop
          execute format('grant execute on function %I.salvar_resposta_comercial to %s',
                         r.esquema, g.quem);
          raise notice 'grant execute on %.salvar_resposta_comercial to %', r.esquema, g.quem;
        end loop;
      end;
    end if;
  end loop;
end;
$$;

-- 5. Teste de ponta a ponta no banco (grava, lê e apaga o registro) ----
do $$
declare
  v_ret jsonb;
  v_id uuid;
begin
  v_ret := dashboard_tvsim.salvar_resposta_comercial(
    '{"p1":2}'::jsonb, 6::smallint, 6::smallint, 6::smallint, 'V3',
    'Teste migração', '(11) 90000-0000', 'teste@exemplo.com', 'teste',
    'Até R$ 50 mil', true
  );
  v_id := (v_ret ->> 'id')::uuid;
  if not exists (select 1 from dashboard_tvsim.respostas_comercial where id = v_id) then
    raise exception 'Teste falhou: registro não encontrado';
  end if;
  delete from dashboard_tvsim.respostas_comercial where id = v_id;
  raise notice 'Teste de gravação/leitura OK (registro de teste apagado).';
end;
$$;

commit;

-- 6. PostgREST relê o schema e passa a enxergar os objetos novos -------
notify pgrst, 'reload schema';
