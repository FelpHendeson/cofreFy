# 06 — Módulo de Balancete Mensal

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento especifica o módulo de Balancete Mensal do CofreFy.

O Balancete Mensal será responsável por apresentar uma visão consolidada, objetiva e conferível dos créditos e débitos de um mês selecionado.

Este módulo depende dos módulos:

- Categorias.
- Movimentações.
- Dashboard Mensal.

---

## Objetivo do módulo

Permitir que o usuário visualize um resumo mensal estruturado das suas finanças, separando entradas, saídas, totais, saldo e agrupamentos.

O balancete deve responder perguntas como:

- Quais foram todos os créditos do mês?
- Quais foram todos os débitos do mês?
- Qual foi o total de créditos?
- Qual foi o total de débitos?
- Qual foi o saldo final?
- Quais categorias concentraram mais entradas e saídas?
- Como ficou o fechamento financeiro do mês?

---

## Diferença entre Dashboard e Balancete

### Dashboard Mensal

O dashboard é uma tela de visão rápida.

Ele apresenta indicadores, cards e resumos visuais para leitura imediata.

### Balancete Mensal

O balancete é uma tela de conferência.

Ele deve apresentar dados mais estruturados, com foco em:

- Entradas do mês.
- Saídas do mês.
- Totais.
- Saldo final.
- Agrupamentos.
- Lista detalhada.
- Conferência mensal.

O dashboard responde rápido.

O balancete permite conferir.

---

## Escopo do módulo

O módulo deve conter:

- Tela de balancete mensal.
- Filtro por mês e ano.
- Resumo de créditos.
- Resumo de débitos.
- Saldo final.
- Situação do mês.
- Listagem separada de entradas e saídas.
- Agrupamento por categoria.
- Agrupamento por forma de pagamento.
- Agrupamento por qualificação de gasto.
- Totais consolidados.
- Estado vazio.

---

## Fora do escopo deste módulo

Este módulo não deve implementar:

- Cadastro de movimentações.
- Edição de movimentações.
- Exclusão de movimentações.
- Cadastro de categorias.
- Edição de categorias.
- Dashboard.
- Relatórios avançados.
- Exportação PDF.
- Exportação Excel.
- Login.
- Autenticação.
- Múltiplos usuários.
- Integração bancária.
- Metas financeiras.
- Orçamento por categoria.
- Cartão de crédito avançado.
- Parcelamentos.
- Recorrência automática.

Exportação para PDF ou Excel pode ser considerada futuramente, mas não faz parte deste módulo.

---

## Rota sugerida

A rota principal sugerida é:

```txt
/balance
```

Alternativas aceitáveis:

```txt
/monthly-balance
/balancete
```

Preferência do projeto:

```txt
/balance
```

---

## Filtro mensal

O balancete deve operar sobre um mês e ano.

Por padrão, deve carregar mês e ano atuais.

O usuário deve conseguir alterar:

- Mês.
- Ano.

Ao alterar o período, todos os dados devem ser recalculados.

---

## Período de cálculo

O período mensal deve considerar a data da movimentação.

A implementação deve usar intervalo semiaberto:

```txt
date >= início do mês
date < início do próximo mês
```

Esse padrão evita problemas com horário, timezone e fim do dia.

---

## Dados principais

O balancete deve exibir:

### Total de créditos

Soma das movimentações do tipo `INCOME` no mês selecionado.

```txt
totalCredits = soma(amount) onde type = INCOME
```

---

### Total de débitos

Soma das movimentações do tipo `EXPENSE` no mês selecionado.

```txt
totalDebits = soma(amount) onde type = EXPENSE
```

---

### Saldo final

Diferença entre créditos e débitos.

```txt
finalBalance = totalCredits - totalDebits
```

---

### Quantidade de créditos

Quantidade de movimentações do tipo `INCOME` no mês.

---

### Quantidade de débitos

Quantidade de movimentações do tipo `EXPENSE` no mês.

---

### Quantidade total de movimentações

Soma da quantidade de créditos e débitos.

---

## Situação do mês

A situação do mês deve ser calculada pelo saldo final.

### POSITIVE

Quando:

```txt
finalBalance > 0
```

Texto sugerido:

```txt
Fechamento positivo
```

---

### NEUTRAL

Quando:

```txt
finalBalance = 0
```

Texto sugerido:

```txt
Fechamento neutro
```

---

### NEGATIVE

Quando:

```txt
finalBalance < 0
```

Texto sugerido:

```txt
Fechamento negativo
```

---

## Listagem de créditos

O balancete deve possuir uma seção específica para entradas.

Cada crédito deve exibir:

- Data.
- Descrição.
- Categoria.
- Valor.
- Forma de pagamento, se houver.
- Observações, se houver.

A listagem deve ser ordenada por data.

Preferência:

```txt
Data mais antiga primeiro
```

Isso facilita a leitura como conferência mensal.

---

## Listagem de débitos

O balancete deve possuir uma seção específica para saídas.

Cada débito deve exibir:

- Data.
- Descrição.
- Categoria.
- Valor.
- Qualificação, se houver.
- Forma de pagamento, se houver.
- Observações, se houver.

A listagem deve ser ordenada por data.

Preferência:

```txt
Data mais antiga primeiro
```

---

## Agrupamento por categoria

O balancete deve agrupar movimentações por categoria.

Diferente do dashboard, o balancete pode mostrar agrupamentos separados:

- Entradas por categoria.
- Saídas por categoria.

Cada agrupamento deve conter:

- Categoria.
- Tipo.
- Quantidade.
- Total.
- Percentual em relação ao total do respectivo tipo.

Exemplo de entradas por categoria:

| Categoria | Quantidade | Total | Percentual |
|---|---:|---:|---:|
| Salário | 1 | R$ 2.500,00 | 100% |

Exemplo de saídas por categoria:

| Categoria | Quantidade | Total | Percentual |
|---|---:|---:|---:|
| Alimentação | 8 | R$ 600,00 | 40% |
| Moradia | 2 | R$ 700,00 | 46% |

---

## Agrupamento por forma de pagamento

O balancete deve agrupar movimentações por forma de pagamento, quando houver.

Cada agrupamento deve conter:

- Forma de pagamento.
- Quantidade.
- Total.

Movimentações sem forma de pagamento devem ser agrupadas como:

```txt
Não informado
```

---

## Agrupamento por qualificação

O balancete deve agrupar saídas por qualificação.

Cada agrupamento deve conter:

- Qualificação.
- Quantidade.
- Total.
- Percentual em relação ao total de débitos.

Saídas sem qualificação devem ser agrupadas como:

```txt
Não qualificado
```

---

## Tabela consolidada

O balancete deve possuir uma tabela ou seção consolidada com:

| Item | Valor |
|---|---:|
| Total de créditos | R$ 0,00 |
| Total de débitos | R$ 0,00 |
| Saldo final | R$ 0,00 |
| Quantidade de créditos | 0 |
| Quantidade de débitos | 0 |
| Total de movimentações | 0 |

---

## Interface esperada

A tela deve conter:

- Título "Balancete Mensal".
- Filtro de mês e ano.
- Cards ou tabela de resumo consolidado.
- Seção "Créditos".
- Seção "Débitos".
- Seção "Entradas por categoria".
- Seção "Saídas por categoria".
- Seção "Por forma de pagamento".
- Seção "Débitos por qualificação".
- Estado vazio quando não houver movimentações.

---

## Direção visual

A interface deve ser mais estruturada e conferível que o dashboard.

Sugestões:

- Usar tabelas para créditos e débitos.
- Usar cards para totais principais.
- Separar visualmente créditos e débitos.
- Usar valores positivos para créditos e valores destacados para débitos.
- Manter responsividade.
- Evitar poluição visual.

---

## Estados vazios

Se não houver movimentações no mês selecionado, o balancete deve exibir mensagem clara.

Exemplo:

```txt
Nenhuma movimentação encontrada para este mês.
```

Nesse caso:

- Total de créditos deve ser R$ 0,00.
- Total de débitos deve ser R$ 0,00.
- Saldo final deve ser R$ 0,00.
- Situação deve ser neutra.
- Quantidades devem ser zero.
- Listagens e agrupamentos devem mostrar estado vazio.

---

## Organização sugerida

```txt
apps/web/features/monthly-balance/
├── components/
│   ├── MonthlyBalanceSummary.tsx
│   ├── MonthlyBalanceFilter.tsx
│   ├── CreditsTable.tsx
│   ├── DebitsTable.tsx
│   ├── CategoryBalanceSummary.tsx
│   ├── PaymentMethodSummary.tsx
│   └── QualificationBalanceSummary.tsx
├── services/
│   └── monthly-balance.service.ts
├── repositories/
│   └── monthly-balance.repository.ts
├── types/
│   └── monthly-balance.types.ts
└── utils/
    ├── monthly-balance-calculations.ts
    └── monthly-balance-formatters.ts
```

---

## Regras técnicas

### RT001 — Não duplicar regra financeira em componente

Cálculos financeiros devem ficar em services, utils ou camada equivalente.

Componentes visuais devem renderizar dados já calculados.

---

### RT002 — Usar dados reais

O balancete deve usar movimentações reais do banco.

Não usar mocks fixos como resultado final.

---

### RT003 — Não criar tabela de balancete

No MVP, o balancete deve ser calculado dinamicamente a partir das movimentações.

Não criar tabela específica de balancete.

---

### RT004 — Não modificar dados

O balancete é uma tela de leitura.

Não deve criar, editar ou excluir movimentações.

---

### RT005 — Tratar Decimal corretamente

Valores financeiros vindos do Prisma podem usar Decimal.

A implementação deve converter e formatar valores com cuidado.

---

## Critérios de aceite

O módulo será considerado pronto quando:

- A rota `/balance` existir.
- O balancete carregar o mês atual por padrão.
- O usuário conseguir alterar mês e ano.
- Total de créditos for calculado corretamente.
- Total de débitos for calculado corretamente.
- Saldo final for calculado corretamente.
- Situação do mês for exibida corretamente.
- Quantidade de créditos for calculada corretamente.
- Quantidade de débitos for calculada corretamente.
- Total de movimentações for calculado corretamente.
- Créditos forem listados separadamente.
- Débitos forem listados separadamente.
- Entradas forem agrupadas por categoria.
- Saídas forem agrupadas por categoria.
- Movimentações forem agrupadas por forma de pagamento.
- Débitos forem agrupados por qualificação.
- Estados vazios forem tratados.
- Nenhuma funcionalidade fora do módulo de balancete for criada.

---

## Casos de teste

### CT001 — Balancete sem movimentações

Dado que não existem movimentações no mês selecionado, quando acessar o balancete, então os totais devem ser zero e a situação deve ser neutra.

---

### CT002 — Balancete com créditos e débitos

Dado que existem entradas e saídas no mês, quando acessar o balancete, então os totais devem refletir corretamente as movimentações.

---

### CT003 — Saldo positivo

Dado que o total de créditos é maior que o total de débitos, quando visualizar o balancete, então a situação deve ser positiva.

---

### CT004 — Saldo negativo

Dado que o total de débitos é maior que o total de créditos, quando visualizar o balancete, então a situação deve ser negativa.

---

### CT005 — Saldo neutro

Dado que total de créditos e débitos são iguais, quando visualizar o balancete, então a situação deve ser neutra.

---

### CT006 — Filtro mensal

Dado que existem movimentações em meses diferentes, quando alterar mês e ano, então o balancete deve recalcular apenas com dados do período selecionado.

---

### CT007 — Listagem separada

Dado que existem créditos e débitos no mês, quando visualizar o balancete, então entradas e saídas devem aparecer em seções separadas.

---

### CT008 — Agrupamento por categoria

Dado que existem movimentações em categorias diferentes, quando visualizar o balancete, então os totais por categoria devem estar corretos.

---

### CT009 — Agrupamento por forma de pagamento

Dado que existem movimentações com formas de pagamento diferentes, quando visualizar o balancete, então os totais por forma de pagamento devem estar corretos.

---

### CT010 — Agrupamento por qualificação

Dado que existem saídas com qualificações diferentes, quando visualizar o balancete, então os totais por qualificação devem estar corretos.

---

## Observações finais

O Balancete Mensal deve ser uma tela de conferência.

Ele não substitui o Dashboard Mensal.

Ele complementa o Dashboard com uma visão mais detalhada e organizada das movimentações do período.
