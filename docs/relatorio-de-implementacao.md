# Relatório de Implementação

Registro do que foi pedido e entregue no CofreFy, confrontado com as specs em `docs/00` a `docs/05`. Atualizado em junho de 2026.

---

## Panorama

| Área | Status |
|---|---|
| Infraestrutura local | Entregue |
| Categorias | Entregue |
| Movimentações | Entregue |
| Dashboard mensal | Entregue |
| Balancete | Não iniciado (spec 06 pendente) |
| Login, relatórios, exportação | Fora do MVP |

Rotas ativas: `/dashboard`, `/categories`, `/transactions` (home redireciona para o dashboard).

---

## Por spec

### Infraestrutura (`docs/00`)

- Monorepo pnpm, Next.js, TypeScript, Tailwind, Prisma e MySQL via Docker — conforme spec.
- `.env.example`, migrations e comandos `pnpm dev` / `pnpm db:*` — conforme spec.
- **Fora da spec:** `pnpm dev:setup` (setup completo pós-clone), scripts em `scripts/` para Windows, `MYSQL_HOST_PORT` configurável, seed de cenário anual (`pnpm db:seed:scenario`).
- **Pendente:** CI/CD; `packages/ui` ainda vazio (UI em `apps/web/components/ui/`).

### Categorias (`docs/03`)

- CRUD em modal, filtro por tipo, inativar/reativar, seed de 18 categorias, bloqueio de duplicidade — conforme spec.
- Guard que impede excluir categoria com movimentação — entregue após o módulo 04.
- **Lacuna:** exclusão física existe no server, mas a UI só inativa.

### Movimentações (`docs/04`)

- Model `Transaction`, enums, CRUD em modal, filtros (mês, tipo, categoria, qualificação), validações de negócio — conforme spec.
- **Correções pós-entrega:** serialização de `Decimal` para Client Components; limite de descrição no banco (120 chars); `useWatch` no formulário.

### Dashboard mensal (`docs/05`)

- Indicadores do mês, filtro mês/ano, distribuições, destaques e últimas movimentações — conforme spec.
- **Nota:** a visão geral (`docs/01`) menciona gráficos simples; a spec 05 prevê tabelas/cards — implementado assim.

### Visão geral do MVP (`docs/01`)

- Entradas/saídas, totais, saldo, situação do mês, categorias, qualificação, filtros e edição — cobertos.
- Balancete mensal completo — ainda não.

---

## Solicitações fora das specs

| Pedido | O que foi feito |
|---|---|
| Setup local padronizado | `pnpm dev:setup` e scripts de orquestração |
| Subir app localmente | Documentado e validado |
| Módulo de movimentações | Implementado conforme `docs/04` |
| Revisão técnica de movimentações | Pendências corrigidas |
| Remover prompt obsoleto de categorias | Arquivo removido |
| Corrigir erro ao inserir salário | Fix de serialização `Decimal` |
| Módulo de dashboard | Implementado conforme `docs/05` |
| Seed com um ano de dados | `pnpm db:seed:scenario` |
| Melhorar selects e formulários | Componentes UI Tailwind + `AppNav` |

---

## Pendências abertas

- Spec e implementação do balancete (`docs/06`).
- Plano de testes (`docs/07`) e testes automatizados.
- Gráficos no dashboard (opcional; alinhar spec 01 com 05).
- `db:reset` não roda o seed de cenário automaticamente.
- Avisos de ambiente: porta MySQL 3306, `EPERM` no `db:generate` com servidor rodando.

---

## Próximo passo sugerido

Criar `docs/06-modulo-balancete.md` e implementar o módulo, seguindo o fluxo SDD (`docs/02`).
