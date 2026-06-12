# 05 — Módulo de Dashboard Mensal

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento especifica o módulo de Dashboard Mensal do CofreFy.

O Dashboard Mensal será responsável por apresentar uma visão resumida das movimentações financeiras de um determinado mês, permitindo que o usuário compreenda rapidamente sua situação financeira.

Este módulo depende dos módulos:

- Categorias.
- Movimentações.

---

## Objetivo do módulo

Permitir que o usuário visualize, em uma tela inicial/resumo, os principais indicadores financeiros do mês selecionado.

O dashboard deve responder perguntas como:

- Quanto entrou no mês?
- Quanto saiu no mês?
- Qual é o saldo final?
- O mês está positivo, neutro ou negativo?
- Qual categoria teve maior gasto?
- Qual foi a maior saída?
- Quanto foi gasto por categoria?
- Quanto foi gasto por qualificação?

---

## Conceito de dashboard mensal

O dashboard mensal é uma visão calculada com base nas movimentações registradas.

Ele não deve criar novas movimentações.

Ele não deve alterar dados financeiros.

Ele apenas consulta, calcula e apresenta informações.

---

## Escopo do módulo

O módulo deve conter:

- Tela de dashboard mensal.
- Filtro por mês e ano.
- Cards com indicadores principais.
- Resumo de entradas.
- Resumo de saídas.
- Saldo final.
- Situação do mês.
- Distribuição de gastos por categoria.
- Distribuição de gastos por qualificação.
- Maior gasto do mês.
- Categoria com maior gasto.
- Lista curta das movimentações recentes do mês.

---

## Fora do escopo deste módulo

Este módulo não deve implementar:

- Cadastro de movimentações.
- Edição de movimentações.
- Exclusão de movimentações.
- Cadastro de categorias.
- Edição de categorias.
- Relatórios avançados.
- Exportação PDF.
- Exportação Excel.
- Gráficos complexos.
- Login.
- Autenticação.
- Múltiplos usuários.
- Integração bancária.
- Metas financeiras.
- Orçamentos por categoria.
- Controle avançado de cartão de crédito.
- Parcelamentos.
- Recorrência automática.

---

## Rota sugerida

A rota principal sugerida é:

```txt
/dashboard
```

Opcionalmente, a home `/` pode redirecionar para `/dashboard` ou renderizar o próprio dashboard.

Essa decisão pode seguir a estrutura atual do projeto, mas o dashboard deve ficar acessível claramente.

---

## Filtro mensal

O dashboard deve sempre operar sobre um mês e ano.

Por padrão, deve carregar o mês e ano atuais.

O usuário deve conseguir alterar:

- Mês.
- Ano.

Quando o mês ou ano for alterado, todos os indicadores devem ser recalculados para o período selecionado.

---

## Período de cálculo

O período mensal deve considerar a data da movimentação.

Exemplo:

- Mês: Junho.
- Ano: 2026.
- Início: 2026-06-01 00:00:00.
- Fim: 2026-06-30 23:59:59.

A implementação pode usar intervalo semiaberto para evitar problemas de horário:

```txt
date >= início do mês
date < início do próximo mês
```

---

## Indicadores principais

### Total de entradas

Soma dos valores de movimentações do tipo `INCOME` no mês selecionado.

```txt
totalIncome = soma(amount) onde type = INCOME
```

---

### Total de saídas

Soma dos valores de movimentações do tipo `EXPENSE` no mês selecionado.

```txt
totalExpense = soma(amount) onde type = EXPENSE
```

---

### Saldo final

Diferença entre entradas e saídas.

```txt
balance = totalIncome - totalExpense
```

---

### Percentual da renda comprometida

Percentual de saídas em relação às entradas.

```txt
expensePercentage = (totalExpense / totalIncome) * 100
```

Se `totalIncome` for zero, o percentual deve ser tratado como zero ou não aplicável, evitando divisão por zero.

---

### Percentual economizado

Percentual do saldo positivo em relação às entradas.

```txt
savingsPercentage = (balance / totalIncome) * 100
```

Se `totalIncome` for zero ou o saldo for negativo, o percentual deve ser tratado com cuidado.

No MVP, pode ser exibido como zero quando não houver entrada.

---

## Situação do mês

A situação do mês deve ser definida com base no saldo.

### POSITIVE

Quando:

```txt
balance > 0
```

Texto sugerido:

```txt
Mês positivo
```

---

### NEUTRAL

Quando:

```txt
balance = 0
```

Texto sugerido:

```txt
Mês neutro
```

---

### NEGATIVE

Quando:

```txt
balance < 0
```

Texto sugerido:

```txt
Mês negativo
```

---

## Distribuição por categoria

O dashboard deve agrupar saídas por categoria.

Cada item deve conter:

- Categoria.
- Valor total.
- Percentual em relação ao total de saídas.

Exemplo:

| Categoria | Total | Percentual |
|---|---:|---:|
| Alimentação | R$ 450,00 | 30% |
| Moradia | R$ 700,00 | 46% |
| Transporte | R$ 120,00 | 8% |

No MVP, o agrupamento por categoria deve considerar apenas saídas.

---

## Distribuição por qualificação

O dashboard deve agrupar saídas por qualificação.

Cada item deve conter:

- Qualificação.
- Valor total.
- Percentual em relação ao total de saídas.

Exemplo:

| Qualificação | Total | Percentual |
|---|---:|---:|
| Essencial | R$ 900,00 | 60% |
| Supérfluo | R$ 200,00 | 13% |
| Dívida | R$ 300,00 | 20% |

Movimentações de saída sem qualificação podem ser agrupadas como:

```txt
Não qualificado
```

---

## Maior gasto do mês

O dashboard deve identificar a maior movimentação do tipo `EXPENSE` no mês.

Exibir:

- Descrição.
- Valor.
- Categoria.
- Data.

Se não houver saída no mês, exibir estado vazio.

---

## Categoria com maior gasto

O dashboard deve identificar a categoria com maior soma de saídas no mês.

Exibir:

- Nome da categoria.
- Valor total.
- Percentual do total de saídas.

Se não houver saída no mês, exibir estado vazio.

---

## Movimentações recentes

O dashboard deve exibir uma lista curta de movimentações recentes do mês selecionado.

Sugestão:

- Últimas 5 movimentações do mês.
- Ordenadas por data descrescente.
- Exibir data, descrição, tipo, categoria e valor.

Essa lista serve apenas para contexto rápido.

A edição/criação/exclusão deve continuar sendo responsabilidade da tela de movimentações.

---

## Interface esperada

A tela deve conter:

- Cabeçalho com título "Dashboard Mensal".
- Seletor de mês e ano.
- Cards principais:
  - Total de entradas.
  - Total de saídas.
  - Saldo final.
  - Situação do mês.
- Área de distribuição por categoria.
- Área de distribuição por qualificação.
- Card de maior gasto.
- Card de categoria com maior gasto.
- Lista de movimentações recentes.

---

## Direção visual

A interface deve ser limpa, objetiva e responsiva.

Sugestões:

- Cards para indicadores principais.
- Valores monetários bem destacados.
- Cores visuais para diferenciar entrada, saída e saldo.
- Estados vazios claros.
- Layout funcional em desktop e mobile.

---

## Estados vazios

Se não houver movimentações no mês selecionado, o dashboard deve mostrar uma mensagem clara.

Exemplo:

```txt
Nenhuma movimentação encontrada para este mês.
```

Nesse caso:

- Total de entradas deve ser R$ 0,00.
- Total de saídas deve ser R$ 0,00.
- Saldo deve ser R$ 0,00.
- Situação deve ser neutra.
- Áreas de distribuição devem exibir estado vazio.

---

## Organização sugerida

```txt
apps/web/features/dashboard/
├── components/
│   ├── DashboardSummaryCards.tsx
│   ├── DashboardMonthFilter.tsx
│   ├── CategoryExpenseSummary.tsx
│   ├── QualificationExpenseSummary.tsx
│   ├── BiggestExpenseCard.tsx
│   ├── TopExpenseCategoryCard.tsx
│   └── RecentTransactionsList.tsx
├── services/
│   └── dashboard.service.ts
├── repositories/
│   └── dashboard.repository.ts
├── types/
│   └── dashboard.types.ts
└── utils/
    ├── dashboard-calculations.ts
    └── dashboard-formatters.ts
```

---

## Regras técnicas

### RT001 — Não duplicar regra financeira em componente

Cálculos financeiros devem ficar em services, utils ou camada equivalente.

Componentes visuais devem apenas renderizar os dados recebidos.

---

### RT002 — Usar dados reais

O dashboard deve usar dados reais do banco.

Não usar mock fixo como resultado final.

Mocks temporários só são aceitáveis durante desenvolvimento, mas devem ser removidos antes da entrega.

---

### RT003 — Evitar criação de nova tabela desnecessária

No MVP, o dashboard é calculado dinamicamente a partir das movimentações.

Não criar tabela específica de dashboard.

Não criar tabela de resumo mensal neste módulo.

---

### RT004 — Tratar Decimal corretamente

Valores financeiros vindos do Prisma podem usar Decimal.

A implementação deve converter e formatar valores com cuidado.

Evitar cálculos quebrados por string, undefined ou conversões inconsistentes.

---

## Critérios de aceite

O módulo será considerado pronto quando:

- A rota `/dashboard` existir ou a home renderizar o dashboard.
- O dashboard carregar o mês atual por padrão.
- O usuário conseguir alterar mês e ano.
- Total de entradas for calculado corretamente.
- Total de saídas for calculado corretamente.
- Saldo final for calculado corretamente.
- Situação do mês for exibida corretamente.
- Percentual da renda comprometida for calculado sem erro de divisão por zero.
- Distribuição por categoria for exibida.
- Distribuição por qualificação for exibida.
- Maior gasto do mês for exibido.
- Categoria com maior gasto for exibida.
- Movimentações recentes forem exibidas.
- Estados vazios forem tratados.
- Nenhuma funcionalidade fora do módulo de dashboard for criada.

---

## Casos de teste

### CT001 — Dashboard sem movimentações

Dado que não existem movimentações no mês selecionado, quando acessar o dashboard, então os totais devem ser zero e a situação deve ser neutra.

---

### CT002 — Dashboard com entradas e saídas

Dado que existem entradas e saídas no mês, quando acessar o dashboard, então os totais devem refletir corretamente as movimentações.

---

### CT003 — Saldo positivo

Dado que o total de entradas é maior que o total de saídas, quando visualizar o dashboard, então a situação deve ser positiva.

---

### CT004 — Saldo negativo

Dado que o total de saídas é maior que o total de entradas, quando visualizar o dashboard, então a situação deve ser negativa.

---

### CT005 — Saldo neutro

Dado que total de entradas e saídas são iguais, quando visualizar o dashboard, então a situação deve ser neutra.

---

### CT006 — Filtro mensal

Dado que existem movimentações em meses diferentes, quando alterar mês e ano, então o dashboard deve recalcular apenas com dados do período selecionado.

---

### CT007 — Agrupamento por categoria

Dado que existem saídas em categorias diferentes, quando visualizar o dashboard, então os totais por categoria devem estar corretos.

---

### CT008 — Agrupamento por qualificação

Dado que existem saídas com qualificações diferentes, quando visualizar o dashboard, então os totais por qualificação devem estar corretos.

---

### CT009 — Maior gasto

Dado que existem várias saídas no mês, quando visualizar o dashboard, então o maior gasto deve ser a saída de maior valor.

---

### CT010 — Divisão por zero

Dado que não existe entrada no mês, quando visualizar o dashboard, então o sistema não deve quebrar ao calcular percentuais.

---

## Observações finais

Este módulo deve priorizar clareza visual e confiabilidade dos cálculos.

Não deve tentar substituir o módulo de relatórios.

Não deve criar funcionalidades de cadastro.

O objetivo é entregar uma visão mensal rápida e útil para tomada de decisão.
