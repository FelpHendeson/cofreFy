# 00 — Infraestrutura e Arquitetura

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento define a base técnica inicial do projeto CofreFy, incluindo arquitetura, stack, estrutura de repositório, infraestrutura local, banco de dados, padrões gerais e decisões técnicas.

Este documento deve ser usado como referência antes de qualquer implementação.

Nenhuma funcionalidade de negócio deve ser criada sem especificação prévia.

---

## Tipo de projeto

O CofreFy será uma aplicação web para gerenciamento de finanças pessoais.

O projeto será desenvolvido usando **Specification Driven Development**, ou seja, a implementação deve ser guiada por documentos de especificação antes da criação de código.

---

## Arquitetura inicial

O CofreFy será construído como um **monolito modular** dentro de um **monorepo**.

### Decisão

- O projeto terá uma aplicação principal em Next.js.
- O backend inicial ficará dentro do próprio Next.js.
- Não haverá backend separado no MVP.
- O banco de dados será MySQL.
- O banco local será executado via Docker.
- O deploy da aplicação será planejado para Vercel.
- O banco em produção será definido posteriormente.

---

## Justificativa da arquitetura

A escolha por monolito modular no MVP busca reduzir complexidade inicial e acelerar o desenvolvimento, sem abrir mão de organização.

O sistema começa com um domínio relativamente claro:

- Entradas financeiras.
- Saídas financeiras.
- Categorias.
- Balancete mensal.
- Dashboard.
- Relatórios simples.

Separar frontend e backend desde o início adicionaria mais complexidade operacional sem necessidade imediata.

O monorepo permite que o projeto cresça no futuro, podendo receber novas aplicações ou pacotes compartilhados sem reestruturação pesada.

---

## Stack principal

| Área | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| Framework | Next.js |
| UI | React |
| Estilização | Tailwind CSS |
| Banco de dados | MySQL |
| Banco local | MySQL via Docker |
| ORM | Prisma |
| Validação | Zod |
| Formulários | React Hook Form |
| Gerenciador de pacotes | pnpm |
| Containerização | Docker e Docker Compose |
| Deploy da aplicação | Vercel |
| Deploy do banco | A definir |

---

## Estrutura inicial do repositório

```txt
cofrefy/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       ├── server/
│       ├── prisma/
│       └── package.json
├── packages/
│   ├── config/
│   ├── database/
│   ├── eslint-config/
│   ├── types/
│   └── ui/
├── docker/
├── docs/
│   ├── 00-infraestrutura-e-arquitetura.md
│   ├── 01-visao-geral-do-produto.md
│   ├── 02-guia-de-sdd.md
│   ├── 03-modulo-movimentacoes.md
│   ├── 04-modulo-categorias.md
│   ├── 05-modulo-dashboard-mensal.md
│   ├── 06-modulo-balancete.md
│   ├── 07-plano-de-testes.md
│   └── 08-prompts-para-agente.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

---

## Aplicação principal

A aplicação principal ficará em:

```txt
apps/web
```

Ela será responsável por:

- Interface do usuário.
- Rotas da aplicação.
- Server Actions ou API Routes.
- Integração com banco de dados.
- Regras de aplicação.
- Validações.
- Dashboard.
- CRUDs do MVP.
- Renderização das telas principais.

---

## Organização por domínio

Sempre que possível, o código deve ser organizado por domínio ou funcionalidade.

Exemplo:

```txt
apps/web/features/
├── transactions/
├── categories/
├── dashboard/
├── monthly-balance/
└── reports/
```

Cada módulo pode conter:

```txt
components/
schemas/
services/
repositories/
actions/
types/
utils/
```

Exemplo:

```txt
apps/web/features/transactions/
├── components/
├── schemas/
├── services/
├── repositories/
├── actions/
├── types/
└── utils/
```

---

## Banco de dados local

O banco local será MySQL executado por Docker Compose.

O serviço deverá possuir:

- Nome de container relacionado ao projeto.
- Porta exposta para desenvolvimento local.
- Volume persistente.
- Database inicial.
- Usuário e senha definidos por variáveis de ambiente.

Exemplo de variáveis:

```env
MYSQL_DATABASE=cofrefy
MYSQL_USER=cofrefy_user
MYSQL_PASSWORD=cofrefy_password
MYSQL_ROOT_PASSWORD=root_password
DATABASE_URL=mysql://cofrefy_user:cofrefy_password@localhost:3306/cofrefy
```

---

## Docker

O projeto deverá usar Docker para padronizar o ambiente de desenvolvimento.

O banco de dados deve obrigatoriamente rodar via Docker.

A aplicação Next.js poderá rodar localmente via pnpm durante o desenvolvimento, mas o projeto deve prever possibilidade de execução containerizada.

Comandos esperados:

```bash
pnpm install
docker compose up -d
pnpm dev
```

---

## Deploy

### Aplicação

A aplicação web será preparada para deploy na Vercel.

### Banco de dados

A Vercel não hospedará o banco MySQL diretamente dentro da aplicação.

O banco de produção deverá ser hospedado em um serviço externo compatível com MySQL.

Possíveis opções futuras:

- Railway
- PlanetScale
- Aiven
- Render
- DigitalOcean Managed Databases
- Servidor próprio

A escolha definitiva do banco de produção não faz parte da infraestrutura inicial.

---

## Decisão sobre backend separado

O projeto não terá backend separado no MVP.

As regras de aplicação, consultas ao banco e operações de escrita serão feitas dentro do próprio Next.js, utilizando recursos server-side.

Caso o projeto cresça e precise de uma API independente, o monorepo poderá receber futuramente:

```txt
apps/api
```

Essa separação não deve ser feita antes de existir necessidade real.

---

## Padrões gerais de desenvolvimento

O projeto deve seguir os seguintes padrões:

- Usar TypeScript.
- Usar Prisma para acesso ao banco.
- Usar Zod para validações de entrada.
- Evitar lógica financeira dentro de componentes visuais.
- Organizar regras de domínio em serviços, actions ou funções específicas.
- Evitar duplicação de regras de negócio.
- Separar código por módulos.
- Evitar arquivos gigantes e genéricos.
- Criar código legível antes de tentar otimizar.
- Não implementar funcionalidades fora da especificação.
- Toda funcionalidade relevante deve ter documento antes da implementação.

---

## Princípios técnicos

### Simplicidade

A infraestrutura deve resolver o necessário para o MVP sem excesso de complexidade.

### Modularidade

Mesmo sendo monolito, o código deve ser separado por módulos claros.

### Evolução incremental

A arquitetura deve permitir evolução futura sem exigir reescrita completa.

### Especificação primeiro

Nenhum módulo importante deve ser implementado sem documentação prévia.

### Controle do escopo

O agente de IA não deve criar recursos extras sem solicitação.

---

## Escopo técnico inicial

O setup inicial deve contemplar:

- Monorepo.
- Aplicação Next.js em `apps/web`.
- TypeScript.
- Tailwind CSS.
- Prisma.
- MySQL via Docker Compose.
- `.env.example`.
- Estrutura `docs/`.
- Estrutura `packages/`.
- README inicial.
- Scripts básicos de desenvolvimento.

---

## Fora do escopo técnico inicial

Não fazem parte do setup inicial:

- Backend separado.
- Autenticação.
- Login.
- Controle de múltiplos usuários.
- Microsserviços.
- Kubernetes.
- Filas.
- Cache distribuído.
- Observabilidade avançada.
- CI/CD completo.
- Integração bancária.
- Aplicativo mobile.
- Exportação PDF.
- Importação de extrato.
- Deploy completo com banco de produção.

---

## Critérios de sucesso da infraestrutura

A infraestrutura inicial será considerada válida quando:

- O repositório estiver organizado como monorepo.
- A aplicação Next.js existir em `apps/web`.
- O banco MySQL subir via Docker Compose.
- O Prisma estiver configurado.
- A aplicação conseguir se conectar ao banco.
- O projeto tiver `.env.example`.
- O projeto tiver documentação inicial em `docs/`.
- O projeto puder rodar localmente com comandos claros.
- O agente conseguir seguir a arquitetura sem criar recursos fora do escopo.
