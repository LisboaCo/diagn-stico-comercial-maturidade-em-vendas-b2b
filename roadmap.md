# Roadmap — Diagnóstico de Maturidade Comercial (Vendas B2B)

## Bloqueado pelo usuário
- [ ] **Atualizar secret BANCO_CLIENT_HEALTH** — usuário deve atualizar em Project Settings → Secrets (ferramenta de edição não disponível neste ambiente).
- [ ] **Atualizar secret POSTGREST_DASHBOARD_TVSIM** — usuário deve atualizar em Project Settings → Secrets.

## Banco de dados (não misturar com TVSIM)
- [ ] Confirmar acesso via `psql` (BANCO_CLIENT_HEALTH) e PostgREST (POSTGREST_DASHBOARD_TVSIM).
- [ ] Criar tabela `dashboard_tvsim.respostas_comercial` (pontos fundacao/gestao/escala; nivel check V0–V3; respostas jsonb).
- [ ] Criar RPC `salvar_resposta_comercial` equivalente, grants/exposição PostgREST idênticos ao TVSIM.
- [ ] Reload schema PostgREST (`notify pgrst, 'reload schema'`).

## Código do app
- [ ] Substituir conteúdo de `src/lib/diagnostico.ts`.
- [ ] Renomear pilares em todo o código (tipos, funções, colunas, componentes, store).
- [ ] Atualizar `src/lib/respostas.functions.ts` → `/rpc/salvar_resposta_comercial` e `/respostas_comercial`.
- [ ] Atualizar `src/lib/respostas-store.ts` (novos campos).
- [ ] Textos de interface → vendas/comercial; sem menção a IA.
- [ ] Pirâmide: ajustar fonte do degrau topo ("Máquina de Vendas").
- [ ] Painel `/painel`: micro-label, H1, cards (p6 CRM, p7 meta), subtítulo pirâmide, largura YAxis.
- [ ] Meta tags de todas as rotas → "Diagnóstico Comercial · Maturidade em Vendas B2B".

## Validação
- [ ] Insert de teste pela RPC; confirmar na listagem; apagar registro de teste.
- [ ] Build OK; checar /tmp/observability/build-errors.log.
- [ ] Relatar: secrets disponíveis, SQL executado, teste de gravação/leitura.
