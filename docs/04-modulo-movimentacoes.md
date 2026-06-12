# 04 — Módulo de Movimentações

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento especifica o módulo de movimentações financeiras do CofreFy.

O módulo de movimentações é responsável por registrar entradas e saídas de dinheiro, permitindo que o usuário acompanhe seus créditos, débitos e histórico financeiro mensal.

Este módulo depende do módulo de categorias.

---

## Objetivo do módulo

Permitir que o usuário registre, visualize, edite, exclua e filtre movimentações financeiras pessoais.

As movimentações serão a base para:

- Dashboard mensal.
- Balancete mensal.
- Relatórios.
- Análise de gastos por categoria.
- Análise qualitativa dos gastos.

---

## Conceito de movimentação

Uma movimentação representa qualquer entrada ou saída financeira registrada pelo usuário.

Exemplos de entrada:

- Salário.
- Freelance.
- Reembolso.
- Venda de item.
- Rendimento.

Exemplos de saída:

- Aluguel.
- Conta de energia.
- Mercado.
- Transporte.
- Lazer.
- Assinatura.
- Dívida.

---

## Tipos de movimentação

Cada movimentação deve possuir um tipo.

Tipos permitidos:

```ts
type TransactionType = "INCOME" | "EXPENSE";
```

### INCOME

Representa entrada de dinheiro.

### EXPENSE

Representa saída de dinheiro.

---

## Qualificação de gasto

Movimentações do tipo `EXPENSE` podem possuir uma qualificação.

Tipos sugeridos:

```ts
type ExpenseQualification =
  | "ESSENTIAL"
  | "IMPORTANT"
  | "SUPERFLUOUS"
  | "INVESTMENT"
  | "DEBT"
  | "EMERGENCY";
```

### ESSENTIAL

Gasto essencial para vida cotidiana.

### IMPORTANT

Gasto importante, mas não necessariamente vital.

### SUPERFLUOUS

Gasto que poderia ser evitado.

### INVESTMENT

Gasto que busca retorno futuro.

### DEBT

Pagamento relacionado a dívida.

### EMERGENCY

Gasto inesperado.

---

## Formas de pagamento

Movimentações podem possuir forma de pagamento.

Tipos sugeridos:

```ts
type PaymentMethod =
  | "PIX"
  | "CASH"
  | "DEBIT_CARD"
  | "CREDIT_CARD"
  | "BANK_SLIP"
  | "BANK_TRANSFER"
  | "OTHER";
```

No MVP, forma de pagamento é opcional.

---

## Entidade Transaction

A entidade principal do módulo será `Transaction`.

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| id | string | Sim | Identificador único |
| type | enum | Sim | Tipo da movimentação |
| description | string | Sim | Descrição da movimentação |
| amount | decimal | Sim | Valor financeiro |
| date | DateTime | Sim | Data da movimentação |
| categoryId | string | Sim | Categoria vinculada |
| qualification | enum | Não | Qualificação do gasto |
| paymentMethod | enum | Não | Forma de pagamento |
| notes | string | Não | Observações livres |
| isRecurring | boolean | Sim | Indica se é recorrente |
| createdAt | DateTime | Sim | Data de criação |
| updatedAt | DateTime | Sim | Data de atualização |

---

## Modelos Prisma sugeridos

```prisma
enum TransactionType {
  INCOME
  EXPENSE
}

enum ExpenseQualification {
  ESSENTIAL
  IMPORTANT
  SUPERFLUOUS
  INVESTMENT
  DEBT
  EMERGENCY
}

enum PaymentMethod {
  PIX
  CASH
  DEBIT_CARD
  CREDIT_CARD
  BANK_SLIP
  BANK_TRANSFER
  OTHER
}

model Transaction {
  id            String                @id @default(cuid())
  type          TransactionType
  description   String
  amount        Decimal               @db.Decimal(10, 2)
  date          DateTime
  categoryId    String
  qualification ExpenseQualification?
  paymentMethod PaymentMethod?
  notes         String?
  isRecurring   Boolean               @default(false)
  createdAt     DateTime              @default(now())
  updatedAt     DateTime              @updatedAt

  category      Category              @relation(fields: [categoryId], references: [id])

  @@index([date])
  @@index([type])
  @@index([categoryId])
  @@map("transactions")
}
```

O model `Category` deverá receber o relacionamento:

```prisma
model Category {
  // campos já existentes

  transactions Transaction[]
}
```

---

## Regras de negócio

### RN001 — Tipo obrigatório

Toda movimentação deve possuir tipo válido:

- INCOME.
- EXPENSE.

### RN002 — Descrição obrigatória

Toda movimentação deve possuir descrição.

A descrição não pode ser vazia.

### RN003 — Valor obrigatório

Toda movimentação deve possuir valor maior que zero.

Não devem ser aceitos valores zerados ou negativos.

O tipo da movimentação define se ela é entrada ou saída. O valor deve ser sempre positivo.

### RN004 — Data obrigatória

Toda movimentação deve possuir uma data.

A data define em qual mês financeiro a movimentação será considerada.

### RN005 — Categoria obrigatória

Toda movimentação deve possuir categoria vinculada.

A categoria deve existir no banco e estar ativa no momento do cadastro.

### RN006 — Compatibilidade entre tipo da movimentação e categoria

A categoria selecionada deve ser compatível com o tipo da movimentação.

Regras:

- Movimentação INCOME pode usar categoria INCOME ou BOTH.
- Movimentação EXPENSE pode usar categoria EXPENSE ou BOTH.
- Movimentação INCOME não pode usar categoria EXPENSE.
- Movimentação EXPENSE não pode usar categoria INCOME.

### RN007 — Qualificação apenas para saída

A qualificação de gasto deve ser usada apenas em movimentações do tipo EXPENSE.

Movimentações do tipo INCOME não devem exigir qualificação.

Se uma movimentação INCOME for salva, o campo `qualification` deve ficar vazio.

### RN008 — Forma de pagamento opcional

Forma de pagamento é opcional no MVP.

Se informada, deve ser um dos valores permitidos.

### RN009 — Recorrência simples

O campo `isRecurring` deve existir, mas no MVP não deve gerar movimentações futuras automaticamente.

Ele serve apenas como marcação visual ou informativa.

Automação de recorrência fica fora do escopo inicial.

### RN010 — Exclusão de movimentação

O sistema deve permitir excluir uma movimentação.

No MVP, a exclusão pode ser física.

Soft delete poderá ser avaliado futuramente.

### RN011 — Edição de movimentação

O sistema deve permitir editar uma movimentação existente.

Ao editar, as mesmas validações de criação devem ser aplicadas.

### RN012 — Filtro mensal

O sistema deve permitir filtrar movimentações por mês e ano.

Esse filtro será essencial para o balancete mensal.

---

## Funcionalidades do módulo

### RF001 — Listar movimentações

O sistema deve listar movimentações cadastradas.

A listagem deve exibir:

- Data.
- Descrição.
- Tipo.
- Categoria.
- Valor.
- Qualificação, quando aplicável.
- Forma de pagamento, quando informada.
- Indicação de recorrência.
- Ações de editar e excluir.

### RF002 — Criar movimentação

O sistema deve permitir criar uma nova movimentação.

Campos mínimos:

- Tipo.
- Descrição.
- Valor.
- Data.
- Categoria.

Campos opcionais:

- Qualificação.
- Forma de pagamento.
- Observações.
- Recorrência.

### RF003 — Editar movimentação

O sistema deve permitir editar uma movimentação existente.

A edição deve abrir em modal/dialog ou drawer.

O formulário deve vir preenchido com os dados atuais.

### RF004 — Excluir movimentação

O sistema deve permitir excluir uma movimentação.

A exclusão deve solicitar confirmação antes de executar.

### RF005 — Filtrar por mês e ano

O sistema deve permitir filtrar movimentações por mês e ano.

Por padrão, a tela deve iniciar no mês e ano atuais.

### RF006 — Filtrar por tipo

O sistema deve permitir filtrar por:

- Todas.
- Entradas.
- Saídas.

### RF007 — Filtrar por categoria

O sistema deve permitir filtrar movimentações por categoria.

### RF008 — Filtrar por qualificação

O sistema deve permitir filtrar saídas por qualificação.

---

## Fora do escopo deste módulo

Este módulo não deve implementar:

- Dashboard mensal completo.
- Balancete mensal completo.
- Gráficos financeiros.
- Relatórios.
- Exportação PDF.
- Exportação Excel.
- Importação de extratos.
- Login.
- Autenticação.
- Múltiplos usuários.
- Cartão de crédito avançado.
- Parcelamentos.
- Geração automática de recorrências.
- Integração bancária.

---

## Interface esperada

Sugestão de rota:

```txt
/transactions
```

A tela deve conter:

- Título.
- Botão "Nova movimentação".
- Filtro de mês e ano.
- Filtro por tipo.
- Filtro por categoria.
- Filtro por qualificação.
- Tabela ou lista de movimentações.
- Ações de editar e excluir.

---

## Padrão UX para formulário

O formulário de criação e edição não deve aparecer solto no final da página.

Deve ser usado:

- Modal/Dialog centralizado; ou
- Drawer/Sheet lateral.

Direção preferencial para este módulo:

- Desktop: drawer lateral ou modal amplo.
- Mobile: modal responsivo ou bottom sheet.

A experiência deve deixar claro se o usuário está criando ou editando.

---

## Componentes sugeridos

```txt
apps/web/features/transactions/
├── components/
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── TransactionFilters.tsx
│   ├── TransactionAmount.tsx
│   ├── TransactionTypeBadge.tsx
│   ├── TransactionQualificationBadge.tsx
│   └── TransactionDeleteDialog.tsx
├── schemas/
│   └── transaction.schema.ts
├── services/
│   └── transaction.service.ts
├── repositories/
│   └── transaction.repository.ts
├── actions/
│   └── transaction.actions.ts
├── types/
│   └── transaction.types.ts
└── utils/
    └── transaction-formatters.ts
```

---

## Validações

### Tipo

- Obrigatório.
- Deve ser INCOME ou EXPENSE.

### Descrição

- Obrigatória.
- Mínimo de 2 caracteres.
- Máximo de 120 caracteres.
- Deve remover espaços extras no início e fim.

### Valor

- Obrigatório.
- Deve ser maior que zero.
- Deve aceitar valores monetários com até duas casas decimais.

### Data

- Obrigatória.
- Deve ser uma data válida.

### Categoria

- Obrigatória.
- Deve existir.
- Deve estar ativa.
- Deve ser compatível com o tipo da movimentação.

### Qualificação

- Opcional para EXPENSE.
- Não aplicável para INCOME.
- Se informada, deve ser valor permitido.

### Forma de pagamento

- Opcional.
- Se informada, deve ser valor permitido.

### Observações

- Opcional.
- Máximo de 500 caracteres.

---

## Critérios de aceite

O módulo será considerado pronto quando:

- Existir model `Transaction` no Prisma.
- Existirem enums `TransactionType`, `ExpenseQualification` e `PaymentMethod`.
- Existir relacionamento entre `Transaction` e `Category`.
- A aplicação permitir listar movimentações.
- A aplicação permitir criar movimentação.
- A aplicação permitir editar movimentação.
- A aplicação permitir excluir movimentação com confirmação.
- A aplicação permitir filtrar por mês e ano.
- A aplicação permitir filtrar por tipo.
- A aplicação permitir filtrar por categoria.
- A aplicação validar categoria compatível com o tipo da movimentação.
- A aplicação não permitir valor menor ou igual a zero.
- A aplicação não permitir descrição vazia.
- O formulário abrir em modal/dialog ou drawer.
- Nenhuma funcionalidade fora do módulo de movimentações for criada.

---

## Casos de teste

### CT001 — Criar entrada válida

Dado que o usuário informa tipo INCOME, descrição, valor, data e categoria compatível, quando salvar, então a entrada deve ser criada.

### CT002 — Criar saída válida

Dado que o usuário informa tipo EXPENSE, descrição, valor, data e categoria compatível, quando salvar, então a saída deve ser criada.

### CT003 — Bloquear valor zero

Dado que o usuário informa valor 0, quando salvar, então o sistema deve bloquear a criação.

### CT004 — Bloquear valor negativo

Dado que o usuário informa valor negativo, quando salvar, então o sistema deve bloquear a criação.

### CT005 — Bloquear descrição vazia

Dado que o usuário não informa descrição, quando salvar, então o sistema deve exibir erro de validação.

### CT006 — Bloquear categoria incompatível

Dado que o usuário cria uma saída com categoria de entrada, quando salvar, então o sistema deve bloquear.

### CT007 — Limpar qualificação em entrada

Dado que o usuário cria ou edita uma movimentação como INCOME, então o campo qualification deve ficar vazio.

### CT008 — Editar movimentação

Dado que uma movimentação existe, quando o usuário editar e salvar dados válidos, então a movimentação deve ser atualizada.

### CT009 — Excluir movimentação

Dado que uma movimentação existe, quando o usuário confirmar exclusão, então ela deve ser removida.

### CT010 — Filtrar por mês e ano

Dado que existem movimentações em meses diferentes, quando o usuário selecionar mês e ano, então apenas movimentações do período selecionado devem aparecer.

---

## Observações para implementação

Este módulo não deve calcular dashboard ou balancete completo.

Pode exibir totais simples na própria tela apenas se isso for útil para validação visual, mas os cálculos oficiais de dashboard e balancete serão especificados em documentos próprios.

Evite antecipar funcionalidades avançadas.

O foco deste módulo é CRUD e filtros de movimentações.
