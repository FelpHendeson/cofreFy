# 07 — Plano de Testes

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento define a estratégia inicial de testes do CofreFy.

O objetivo é garantir que as principais regras financeiras, fluxos de uso e cálculos do sistema sejam validados de forma consistente durante a evolução do projeto.

---

## Contexto atual

O CofreFy já possui os seguintes módulos principais:

- Infraestrutura e arquitetura.
- Categorias.
- Movimentações.
- Dashboard mensal.
- Balancete mensal.

Com esses módulos implementados, o projeto já possui regras financeiras suficientes para exigir testes mínimos antes de novas funcionalidades.

---

## Objetivos dos testes

Os testes devem garantir que:

- O sistema mantém o comportamento esperado ao evoluir.
- Cálculos financeiros não sejam quebrados por novas alterações.
- Filtros mensais funcionem corretamente.
- Categorias sejam respeitadas.
- Movimentações sejam validadas corretamente.
- Dashboard e balancete reflitam os dados reais.
- Regressões sejam identificadas cedo.

---

## Tipos de teste

### Testes manuais

Devem ser usados para validar experiência visual, fluxo de navegação e comportamento geral no navegador.

### Testes unitários

Devem validar funções isoladas de cálculo, formatação e regras de negócio.

### Testes de integração

Devem validar a comunicação entre services, repositories e banco, quando fizer sentido.

### Testes end-to-end

Devem validar fluxos completos do usuário no navegador.

---

## Ferramentas sugeridas

| Tipo | Ferramenta |
|---|---|
| Teste unitário | Vitest |
| Teste de componentes | Testing Library |
| Teste end-to-end | Playwright |
| Validação estática | ESLint |
| Build | Next.js build |

---

## Comandos esperados

O projeto deve buscar ter comandos como:

```bash
pnpm lint
pnpm build
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm db:validate
```

Caso algum comando ainda não exista, ele deve ser criado de forma incremental.

---

## Prioridade inicial

A prioridade inicial não é atingir alta cobertura.

A prioridade é proteger as regras financeiras principais.

Ordem recomendada:

1. Testes unitários de cálculos financeiros.
2. Testes unitários de filtros por período.
3. Testes de validação de schemas.
4. Testes end-to-end dos fluxos principais.
5. Testes visuais ou de componentes, se necessário.

---

## Áreas críticas

### Categorias

Regras críticas:

- Nome obrigatório.
- Tipo obrigatório.
- Nome único por tipo.
- Categoria ativa/inativa.
- Categoria padrão.
- Categoria compatível com movimentação.

---

### Movimentações

Regras críticas:

- Tipo obrigatório.
- Descrição obrigatória.
- Valor maior que zero.
- Data obrigatória.
- Categoria obrigatória.
- Categoria compatível com o tipo.
- INCOME não deve manter qualificação.
- EXPENSE pode ter qualificação.
- Exclusão deve solicitar confirmação.
- Filtro mensal deve considerar data da movimentação.

---

### Dashboard mensal

Regras críticas:

- Total de entradas.
- Total de saídas.
- Saldo final.
- Situação do mês.
- Percentual de renda comprometida.
- Percentual economizado.
- Agrupamento por categoria.
- Agrupamento por qualificação.
- Maior gasto do mês.
- Categoria com maior gasto.
- Últimas movimentações.

---

### Balancete mensal

Regras críticas:

- Total de créditos.
- Total de débitos.
- Saldo final.
- Quantidade de créditos.
- Quantidade de débitos.
- Total de movimentações.
- Listagem separada de créditos.
- Listagem separada de débitos.
- Agrupamento por categoria.
- Agrupamento por forma de pagamento.
- Agrupamento por qualificação.

---

## Testes unitários prioritários

### TU001 — Calcular saldo positivo

Dado total de entradas maior que total de saídas, o saldo deve ser positivo.

### TU002 — Calcular saldo negativo

Dado total de saídas maior que total de entradas, o saldo deve ser negativo.

### TU003 — Calcular saldo neutro

Dado total de entradas igual ao total de saídas, o saldo deve ser zero.

### TU004 — Evitar divisão por zero

Dado total de entradas igual a zero, os percentuais não devem quebrar.

### TU005 — Agrupar saídas por categoria

Dado um conjunto de saídas, o sistema deve agrupar corretamente por categoria.

### TU006 — Agrupar saídas por qualificação

Dado um conjunto de saídas, o sistema deve agrupar corretamente por qualificação.

### TU007 — Agrupar movimentações por forma de pagamento

Dado um conjunto de movimentações, o sistema deve agrupar corretamente por forma de pagamento.

### TU008 — Calcular período mensal

Dado mês e ano, o sistema deve retornar início do mês e início do próximo mês.

---

## Testes de schema prioritários

### TS001 — Categoria sem nome

Deve bloquear categoria sem nome.

### TS002 — Categoria sem tipo

Deve bloquear categoria sem tipo.

### TS003 — Movimentação sem descrição

Deve bloquear movimentação sem descrição.

### TS004 — Movimentação com valor zero

Deve bloquear valor zero.

### TS005 — Movimentação com valor negativo

Deve bloquear valor negativo.

### TS006 — Movimentação sem categoria

Deve bloquear movimentação sem categoria.

### TS007 — Observação muito longa

Deve bloquear observação acima do limite definido.

---

## Testes end-to-end prioritários

### E2E001 — Criar categoria

Fluxo:

1. Acessar `/categories`.
2. Clicar em criar categoria.
3. Preencher dados válidos.
4. Salvar.
5. Ver categoria na listagem.

---

### E2E002 — Editar categoria

Fluxo:

1. Acessar `/categories`.
2. Clicar em editar.
3. Alterar nome ou cor.
4. Salvar.
5. Ver alteração na listagem.

---

### E2E003 — Criar entrada

Fluxo:

1. Acessar `/transactions`.
2. Clicar em nova movimentação.
3. Selecionar tipo entrada.
4. Preencher descrição, valor, data e categoria compatível.
5. Salvar.
6. Ver movimentação na listagem.

---

### E2E004 — Criar saída

Fluxo:

1. Acessar `/transactions`.
2. Clicar em nova movimentação.
3. Selecionar tipo saída.
4. Preencher descrição, valor, data, categoria e qualificação.
5. Salvar.
6. Ver movimentação na listagem.

---

### E2E005 — Bloquear categoria incompatível

Fluxo:

1. Tentar criar saída usando categoria exclusiva de entrada.
2. Sistema deve bloquear ou não disponibilizar categoria incompatível.

---

### E2E006 — Validar dashboard

Fluxo:

1. Criar entrada e saída no mês atual.
2. Acessar `/dashboard`.
3. Conferir total de entradas.
4. Conferir total de saídas.
5. Conferir saldo.

---

### E2E007 — Validar balancete

Fluxo:

1. Criar entrada e saída no mês atual.
2. Acessar `/balance`.
3. Conferir créditos.
4. Conferir débitos.
5. Conferir saldo.
6. Conferir agrupamentos.

---

## Massa de dados mínima para teste manual

Criar as seguintes movimentações no mês atual:

### Entradas

| Descrição | Valor | Categoria |
|---|---:|---|
| Salário | 2500.00 | Salário |
| Freelance | 500.00 | Freelance |

### Saídas

| Descrição | Valor | Categoria | Qualificação | Forma |
|---|---:|---|---|---|
| Aluguel | 700.00 | Moradia | Essencial | Pix |
| Mercado | 350.00 | Alimentação | Essencial | Débito |
| Internet | 100.00 | Assinaturas | Importante | Pix |
| Lanche | 45.00 | Lazer | Supérfluo | Crédito |
| Remédio | 80.00 | Saúde | Emergência | Pix |

### Totais esperados

```txt
Total de entradas: 3000.00
Total de saídas: 1275.00
Saldo: 1725.00
Situação: positiva
```

---

## Checklist manual por release

Antes de considerar uma etapa pronta, validar:

- `pnpm lint`
- `pnpm build`
- Banco sobe corretamente.
- Prisma conecta corretamente.
- Seed roda sem duplicar categorias.
- `/categories` funciona.
- `/transactions` funciona.
- `/dashboard` funciona.
- `/balance` funciona.
- Filtros mensais funcionam.
- Estados vazios funcionam.
- Navegação principal funciona.

---

## Critérios de aceite do plano de testes

Este plano será considerado aplicado quando:

- Existirem comandos básicos de teste.
- Existirem testes unitários para cálculos principais.
- Existirem testes de schema para validações principais.
- Existir ao menos um fluxo end-to-end cobrindo criação de movimentação.
- O README indicar como executar os testes.
- Pendências de teste forem registradas.
