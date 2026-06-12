# Relatório de Implementação

Registro do que foi pedido e entregue no CofreFy, confrontado com as specs em `docs/00` a `docs/06`. Atualizado em junho de 2026.

---

## Panorama

| Área | Status |
|---|---|
| Infraestrutura local | Entregue |
| Categorias | Entregue |
| Movimentações | Entregue |
| Dashboard mensal | Entregue |
| Balancete mensal | Entregue |
| Login, relatórios, exportação | Fora do MVP |

Rotas ativas: `/dashboard`, `/balance`, `/categories`, `/transactions` (home redireciona para `/dashboard`).

---

## Por spec

### Infraestrutura (`docs/00`)

- Monorepo pnpm, Next.js, TypeScript, Tailwind, Prisma e MySQL via Docker — conforme spec.
- `.env.example`, migrations e comandos `pnpm dev` / `pnpm db:*` — conforme spec.
- **Fora da spec:** `pnpm dev:setup`, scripts em `scripts/` para Windows, `MYSQL_HOST_PORT` configurável, seed de cenário anual (`pnpm db:seed:scenario`).
- **Pendente:** CI/CD; `packages/ui` ainda vazio (UI em `apps/web/components/ui/`).

### Categorias (`docs/03`)

- CRUD em modal, filtro por tipo, inativar/reativar, seed de 18 categorias, bloqueio de duplicidade — conforme spec.
- Guard que impede excluir categoria com movimentação — entregue após o módulo 04.
- **Lacuna:** exclusão física existe no server, mas a UI só inativa.

### Movimentações (`docs/04`)

- Model `Transaction`, enums, CRUD em modal, filtros, validações de negócio — conforme spec.
- **Correções pós-entrega:** serialização de `Decimal`; limite de descrição no banco (120 chars); `useWatch` no formulário.

### Dashboard mensal (`docs/05`)

- Indicadores do mês, filtro mês/ano, distribuições, destaques e últimas movimentações — conforme spec.
- Filtro mensal com intervalo semiaberto (`gte` início do mês, `lt` início do próximo).
- **Nota:** visão geral (`docs/01`) menciona gráficos simples; spec 05 prevê tabelas/cards.

### Balancete mensal (`docs/06`)

- Rota `/balance`, link na navegação, filtro mês/ano, consulta com intervalo semiaberto — conforme spec.
- Totais, saldo, situação do mês, quantidades, listagens separadas de créditos e débitos — conforme spec.
- Agrupamentos por categoria (entradas e saídas), forma de pagamento e qualificação de débitos — conforme spec.
- Cálculos em `monthly-balance-calculations.ts`; UI usa `ReportSection` / `ReportTable` compartilhados.
- Sem tabela de balancete ou resumo mensal no banco — conforme spec.
- **Fora da spec (melhoria DX):** refatoração de componentes duplicados em `apps/web/components/report/`.

### Visão geral do MVP (`docs/01`)

- Entradas/saídas, totais, saldo, situação do mês, categorias, qualificação, filtros, edição e balancete mensal — cobertos.
- Relatórios avançados, exportação, login e metas — fora do escopo.

---

## Solicitações fora das specs

| Pedido | O que foi feito |
|---|---|
| Setup local padronizado | `pnpm dev:setup` e scripts de orquestração |
| Revisão técnica de movimentações e dashboard | Pendências corrigidas |
| Seed com um ano de dados | `pnpm db:seed:scenario` |
| Melhorar selects e formulários | Componentes UI Tailwind + `AppNav` |
| Componentizar tabelas do balancete | `ReportSection`, `ReportTable`, `MonthPeriodFilter` |

---

## Pendências abertas

- Plano de testes (`docs/07`) e testes automatizados.
- `pnpm build` falha por erro de tipo em `transaction.service.ts` (qualification `""` vs enum) — pré-existente, fora do balancete.
- Módulo de movimentações ainda usa `lte` no fim do mês (dashboard já usa semiaberto; balancete também).
- Gráficos no dashboard (opcional; alinhar spec 01 com 05).
- `db:reset` não roda o seed de cenário automaticamente.
- Avisos de ambiente: porta MySQL 3306, `EPERM` no `db:generate` com servidor rodando.

---

## Próximo passo sugerido

Criar `docs/07-plano-de-testes.md` e cobrir cálculos dos módulos 05 e 06, seguindo o fluxo SDD (`docs/02`).
