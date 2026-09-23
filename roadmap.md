# Roadmap — Diagnóstico de Maturidade Comercial (Vendas B2B)

## Bloqueado pelo usuário
- [ ] **Atualizar secret BANCO_CLIENT_HEALTH** — valor atual é placeholder ("PLACEHOLDER_VALUE_TO_BE_REPLACED"); usuário deve atualizar em Project Settings → Secrets (não há ferramenta de edição neste ambiente).
- [ ] **Atualizar secret POSTGREST_DASHBOARD_TVSIM** — idem, valor placeholder.

## Código do app — CONCLUÍDO
- [x] `src/lib/diagnostico.ts` reescrito (pilares fundacao/gestao/escala, 15 perguntas, níveis V0–V3, calcularNivel).
- [x] Pilares renomeados em todo o código (index, painel, store, functions).
- [x] `src/lib/respostas.functions.ts` → `/rpc/salvar_resposta_comercial` e `/respostas_comercial`, novos campos.
- [x] `src/lib/respostas-store.ts` (interface via re-export, novos campos).
- [x] Textos de interface → vendas/comercial; sem menção a IA.
- [x] Pirâmide: fonte do degrau topo reduzida ("Máquina de Vendas" sem quebrar).
- [x] Painel: micro-label, H1 "Maturidade Comercial", cards p6 (CRM) e p7 (meta), subtítulo pirâmide, YAxis mais largo.
- [x] Meta tags de todas as rotas → "Diagnóstico Comercial · Maturidade em Vendas B2B".
- [x] Typecheck limpo; build OK.

## Banco de dados (bloqueado pelas secrets)
- [ ] Introspectar `dashboard_tvsim.respostas` + `salvar_resposta` (DDL/grants/roles) para espelhar exatamente.
- [ ] Criar tabela `dashboard_tvsim.respostas_comercial` (pontos fundacao/gestao/escala; nivel check V0–V3; respostas jsonb).
- [ ] Criar RPC `salvar_resposta_comercial` equivalente, grants/exposição PostgREST idênticos.
- [ ] Reload schema PostgREST (`notify pgrst, 'reload schema'`).

## Validação
- [ ] Insert de teste pela RPC; confirmar na listagem; apagar registro de teste.
- [ ] Relatar: secrets disponíveis, SQL executado, teste de gravação/leitura.
