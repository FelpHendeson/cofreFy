# 03 — Módulo de Categorias

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento especifica o módulo de categorias do CofreFy.

O módulo de categorias será responsável por organizar as movimentações financeiras do usuário, permitindo classificar entradas e saídas de dinheiro.

As categorias serão utilizadas posteriormente pelo módulo de movimentações, dashboard mensal, balancete e relatórios.

---

## Objetivo do módulo

Permitir que o sistema possua categorias financeiras para classificar movimentações de entrada e saída.

O módulo deve permitir:

- Criar categorias.
- Listar categorias.
- Editar categorias.
- Inativar categorias.
- Reativar categorias.
- Separar categorias por tipo.
- Usar categorias padrão iniciais.
- Impedir exclusão insegura de categorias já utilizadas.

---

## Conceito de categoria

Uma categoria representa um agrupamento financeiro.

Exemplos de categorias de entrada:

- Salário.
- Freelance.
- Reembolso.
- Venda.
- Rendimento.
- Presente.
- Outros.

Exemplos de categorias de saída:

- Moradia.
- Alimentação.
- Transporte.
- Saúde.
- Educação.
- Lazer.
- Dívidas.
- Assinaturas.
- Compras pessoais.
- Investimentos.
- Emergência.
- Outros.

---

## Tipos de categoria

Cada categoria deverá possuir um tipo.

Tipos permitidos:

```ts
type CategoryType = "INCOME" | "EXPENSE" | "BOTH";
```

### INCOME

Categoria usada apenas para entradas financeiras.

Exemplos:

- Salário.
- Freelance.
- Reembolso.

### EXPENSE

Categoria usada apenas para saídas financeiras.

Exemplos:

- Moradia.
- Alimentação.
- Transporte.

### BOTH

Categoria que pode ser usada tanto para entrada quanto para saída.

Exemplo:

- Outros.

No MVP, o uso de `BOTH` deve ser permitido, mas usado com cautela.

---

## Categorias padrão

O sistema deve possuir categorias padrão iniciais.

Essas categorias podem ser criadas via seed do Prisma.

### Categorias padrão de entrada

| Nome | Tipo |
|---|---|
| Salário | INCOME |
| Freelance | INCOME |
| Reembolso | INCOME |
| Venda | INCOME |
| Rendimento | INCOME |
| Presente | INCOME |
| Outros | BOTH |

### Categorias padrão de saída

| Nome | Tipo |
|---|---|
| Moradia | EXPENSE |
| Alimentação | EXPENSE |
| Transporte | EXPENSE |
| Saúde | EXPENSE |
| Educação | EXPENSE |
| Lazer | EXPENSE |
| Dívidas | EXPENSE |
| Assinaturas | EXPENSE |
| Compras pessoais | EXPENSE |
| Investimentos | EXPENSE |
| Emergência | EXPENSE |
| Outros | BOTH |

---

## Entidade Category

A entidade principal do módulo será `Category`.

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| id | string | Sim | Identificador único |
| name | string | Sim | Nome da categoria |
| type | enum | Sim | Tipo da categoria |
| color | string | Não | Cor opcional para interface |
| icon | string | Não | Ícone opcional para interface |
| isDefault | boolean | Sim | Indica se é uma categoria padrão |
| isActive | boolean | Sim | Indica se a categoria está ativa |
| createdAt | DateTime | Sim | Data de criação |
| updatedAt | DateTime | Sim | Data de atualização |

---

## Modelo Prisma sugerido

```prisma
enum CategoryType {
  INCOME
  EXPENSE
  BOTH
}

model Category {
  id        String       @id @default(cuid())
  name      String
  type      CategoryType
  color     String?
  icon      String?
  isDefault Boolean      @default(false)
  isActive  Boolean      @default(true)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@unique([name, type])
  @@map("categories")
}
```

---

## Regras de negócio

### RN001 — Nome obrigatório

Toda categoria deve possuir nome.

O nome não pode ser vazio.

---

### RN002 — Tipo obrigatório

Toda categoria deve possuir um tipo válido:

- INCOME
- EXPENSE
- BOTH

---

### RN003 — Nome único por tipo

Não deve existir mais de uma categoria ativa ou inativa com o mesmo nome e o mesmo tipo.

Exemplo inválido:

```txt
Nome: Alimentação
Tipo: EXPENSE

Nome: Alimentação
Tipo: EXPENSE
```

Exemplo válido:

```txt
Nome: Outros
Tipo: INCOME

Nome: Outros
Tipo: EXPENSE
```

Observação: caso o sistema use `BOTH`, avaliar com cuidado para evitar duplicidade confusa.

---

### RN004 — Categoria padrão

Categorias criadas pelo seed inicial devem ser marcadas como `isDefault = true`.

Categorias criadas manualmente pelo usuário devem ser `isDefault = false`.

---

### RN005 — Categoria ativa

Somente categorias ativas devem aparecer como opção ao cadastrar movimentações.

Categorias inativas não devem ser sugeridas para novas movimentações.

---

### RN006 — Inativação em vez de exclusão insegura

Uma categoria já utilizada por movimentações não deve ser excluída fisicamente.

Nesse caso, o sistema deve permitir apenas inativação.

Essa regra evita quebrar histórico financeiro.

---

### RN007 — Exclusão física apenas quando seguro

Uma categoria só poderá ser excluída fisicamente se nunca tiver sido usada em nenhuma movimentação.

Como o módulo de movimentações ainda não existe neste momento, a implementação inicial pode preparar o comportamento, mas a verificação real será concluída quando o relacionamento com movimentações existir.

---

### RN008 — Categoria padrão não deve ser excluída no MVP

No MVP, categorias padrão não devem ser excluídas.

Elas podem ser inativadas apenas se isso for explicitamente permitido pela interface.

Por padrão, manter categorias padrão protegidas.

---

## Funcionalidades do módulo

### RF001 — Listar categorias

O sistema deve permitir listar categorias cadastradas.

A listagem deve exibir:

- Nome.
- Tipo.
- Status.
- Indicação se é padrão.
- Cor, se existir.
- Ícone, se existir.

---

### RF002 — Filtrar categorias por tipo

O sistema deve permitir filtrar categorias por:

- INCOME.
- EXPENSE.
- BOTH.
- Todas.

---

### RF003 — Criar categoria

O sistema deve permitir criar uma nova categoria.

Campos mínimos:

- Nome.
- Tipo.

Campos opcionais:

- Cor.
- Ícone.

---

### RF004 — Editar categoria

O sistema deve permitir editar uma categoria existente.

Campos editáveis:

- Nome.
- Tipo.
- Cor.
- Ícone.
- Status ativo/inativo.

A edição não deve violar a regra de nome único por tipo.

---

### RF005 — Inativar categoria

O sistema deve permitir inativar uma categoria.

Uma categoria inativa:

- Continua existindo no banco.
- Não aparece como opção para novas movimentações.
- Pode continuar aparecendo em histórico, quando houver movimentações antigas.

---

### RF006 — Reativar categoria

O sistema deve permitir reativar uma categoria inativa.

Ao reativar, a categoria volta a aparecer como opção para novas movimentações.

---

### RF007 — Criar categorias padrão via seed

O sistema deve possuir um seed inicial para criar as categorias padrão.

O seed deve ser seguro para execução repetida.

Rodar o seed mais de uma vez não deve duplicar categorias.

---

## Fora do escopo deste módulo

Este módulo não deve implementar:

- Cadastro de movimentações.
- Dashboard financeiro.
- Balancete mensal.
- Relatórios.
- Login.
- Autenticação.
- Permissões por usuário.
- Importação de extratos.
- Exportação de dados.
- Gráficos.
- Controle de cartão de crédito.

---

## Interface esperada

O módulo pode possuir uma tela simples de categorias.

Sugestão de rota:

```txt
/categories
```

A tela deve conter:

- Título.
- Botão para criar categoria.
- Filtro por tipo.
- Lista ou tabela de categorias.
- Ações de editar, inativar e reativar.

---

## Componentes sugeridos

```txt
apps/web/features/categories/
├── components/
│   ├── CategoryForm.tsx
│   ├── CategoryList.tsx
│   ├── CategoryFilters.tsx
│   └── CategoryStatusBadge.tsx
├── schemas/
│   └── category.schema.ts
├── services/
│   └── category.service.ts
├── repositories/
│   └── category.repository.ts
├── actions/
│   └── category.actions.ts
├── types/
│   └── category.types.ts
└── utils/
```

---

## Validações

### Nome

- Obrigatório.
- Deve ter no mínimo 2 caracteres.
- Deve ter no máximo 80 caracteres.
- Deve remover espaços extras no início e fim.

### Tipo

- Obrigatório.
- Deve ser um dos valores permitidos.

### Cor

- Opcional.
- Se informada, deve ser uma string válida.
- Validação rígida de hexadecimal pode ficar para melhoria futura.

### Ícone

- Opcional.
- Deve ser string.
- Pode representar nome de ícone, emoji ou identificador visual.

---

## Critérios de aceite

O módulo será considerado pronto quando:

- Existir modelo `Category` no Prisma.
- Existir enum `CategoryType`.
- O banco puder receber categorias.
- O seed criar categorias padrão.
- O seed puder rodar mais de uma vez sem duplicar dados.
- A aplicação listar categorias.
- A aplicação permitir criar categoria.
- A aplicação permitir editar categoria.
- A aplicação permitir inativar categoria.
- A aplicação permitir reativar categoria.
- A aplicação impedir duplicidade de nome por tipo.
- Categorias padrão forem identificadas.
- Nenhuma funcionalidade financeira fora de categorias for criada.

---

## Casos de teste

### CT001 — Criar categoria válida

Dado que o usuário informa nome e tipo válidos, quando salvar, então a categoria deve ser criada.

---

### CT002 — Bloquear categoria sem nome

Dado que o usuário tenta salvar uma categoria sem nome, quando enviar o formulário, então o sistema deve exibir erro de validação.

---

### CT003 — Bloquear tipo inválido

Dado que o usuário informa um tipo inválido, quando salvar, então o sistema deve rejeitar a criação.

---

### CT004 — Bloquear duplicidade

Dado que já existe uma categoria Alimentação do tipo EXPENSE, quando tentar criar outra Alimentação do tipo EXPENSE, então o sistema deve impedir.

---

### CT005 — Permitir mesmo nome em tipo diferente

Dado que existe uma categoria Outros do tipo INCOME, quando criar uma categoria Outros do tipo EXPENSE, então o sistema pode permitir, desde que não conflite com a estratégia de BOTH.

---

### CT006 — Inativar categoria

Dado que uma categoria está ativa, quando o usuário inativar, então ela deve ficar com `isActive = false`.

---

### CT007 — Reativar categoria

Dado que uma categoria está inativa, quando o usuário reativar, então ela deve ficar com `isActive = true`.

---

### CT008 — Rodar seed repetidamente

Dado que o seed já foi executado uma vez, quando executar novamente, então categorias padrão não devem ser duplicadas.

---

## Observações para implementação

Neste momento, o módulo de categorias pode ser implementado sem relacionamento com movimentações.

Quando o módulo de movimentações for criado, será necessário revisar este documento para adicionar o relacionamento entre `Category` e `Transaction`.

A implementação deve preparar o projeto para esse relacionamento futuro, mas sem criar movimentações agora.

---

## Checklist de integração com movimentações

Quando `docs/04-modulo-movimentacoes.md` for especificado e implementado, revisar:

- [ ] Adicionar relação `Category` ↔ `Transaction` no Prisma.
- [ ] Implementar verificação real em `canDeleteCategory` (`category-usage.guard.ts`).
- [ ] Bloquear exclusão física de categorias com movimentações vinculadas (RN007).
- [ ] Garantir que apenas categorias ativas apareçam ao cadastrar movimentações (RN005).
- [ ] Atualizar seed, validações e testes deste módulo.
- [ ] Revisar filtros e listagens que exibem categorias inativas no histórico.
