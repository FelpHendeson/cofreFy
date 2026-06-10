# Prompt — Implementação do Módulo de Categorias

Você está trabalhando no projeto CofreFy, um gerenciador de finanças pessoais desenvolvido via SDD — Specification Driven Development.

A infraestrutura inicial já foi criada e validada.

Agora implemente somente o módulo de categorias, seguindo estritamente os documentos:

- docs/00-infraestrutura-e-arquitetura.md
- docs/01-visao-geral-do-produto.md
- docs/02-guia-de-sdd.md
- docs/03-modulo-categorias.md

## Objetivo

Implementar o módulo de categorias financeiras.

O módulo deve permitir:

- Criar categorias.
- Listar categorias.
- Editar categorias.
- Inativar categorias.
- Reativar categorias.
- Filtrar categorias por tipo.
- Criar categorias padrão via seed.

## Regras obrigatórias

- Não implemente movimentações financeiras.
- Não implemente dashboard.
- Não implemente balancete.
- Não implemente relatórios.
- Não implemente login.
- Não implemente autenticação.
- Não crie backend separado.
- Não altere a stack definida.
- Não remova documentos existentes.
- Não crie funcionalidades fora da especificação.

## Banco de dados

Crie no Prisma:

- Enum `CategoryType`.
- Model `Category`.

O modelo deve seguir a especificação do documento `docs/03-modulo-categorias.md`.

Use a tabela mapeada como:

```prisma
@@map("categories")
```

Crie também uma restrição única para evitar duplicidade de nome e tipo:

```prisma
@@unique([name, type])
```

## Seed

Crie ou ajuste o seed do Prisma para inserir categorias padrão.

O seed deve ser idempotente.

Rodar o seed várias vezes não deve duplicar categorias.

Categorias padrão de entrada:

- Salário
- Freelance
- Reembolso
- Venda
- Rendimento
- Presente
- Outros

Categorias padrão de saída:

- Moradia
- Alimentação
- Transporte
- Saúde
- Educação
- Lazer
- Dívidas
- Assinaturas
- Compras pessoais
- Investimentos
- Emergência
- Outros

## Interface

Crie uma tela simples para gerenciamento de categorias.

Sugestão de rota:

```txt
/categories
```

A tela deve conter:

- Título.
- Filtro por tipo.
- Lista de categorias.
- Formulário para criar categoria.
- Ação para editar categoria.
- Ação para inativar categoria.
- Ação para reativar categoria.

A interface pode ser simples neste momento, mas deve ser funcional e organizada.

## Organização esperada

Organize o código em:

```txt
apps/web/features/categories/
├── components/
├── schemas/
├── services/
├── repositories/
├── actions/
├── types/
└── utils/
```

## Validações

Use Zod para validar:

- Nome obrigatório.
- Nome com mínimo de 2 caracteres.
- Nome com máximo de 80 caracteres.
- Tipo obrigatório.
- Tipo limitado a INCOME, EXPENSE ou BOTH.
- Cor opcional.
- Ícone opcional.

## Critérios de aceite

A implementação será aceita se:

1. O modelo `Category` existir no Prisma.
2. O enum `CategoryType` existir.
3. O seed criar categorias padrão.
4. O seed for idempotente.
5. A tela `/categories` listar categorias.
6. A tela permitir criar categoria.
7. A tela permitir editar categoria.
8. A tela permitir inativar categoria.
9. A tela permitir reativar categoria.
10. O sistema impedir duplicidade de nome por tipo.
11. Nenhuma funcionalidade fora do módulo de categorias for criada.

## Ao finalizar

Entregue um resumo contendo:

1. Arquivos criados.
2. Arquivos alterados.
3. Dependências adicionadas, se houver.
4. Comandos executados.
5. Como rodar migrations.
6. Como rodar seed.
7. Como testar a tela de categorias.
8. Pendências técnicas.
