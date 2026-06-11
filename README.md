# CofreFy

Gerenciador de finanças pessoais desenvolvido com **Specification Driven Development (SDD)**.

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose

## Estrutura do projeto

```txt
cofrefy/
├── apps/web/          # Aplicação Next.js
├── packages/          # Pacotes compartilhados
├── docker/            # Arquivos Docker auxiliares
├── docs/              # Especificações do projeto
└── docker-compose.yml # MySQL local
```

## Configuração local

### 1. Instalar dependências

```bash
pnpm install
```

Se o pnpm solicitar aprovação de build scripts (Prisma, Sharp), execute:

```bash
pnpm approve-builds --all
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
pnpm setup:env
```

Ou manualmente:

```bash
cp .env.example .env
cp .env.example apps/web/.env
```

O `.env` na raiz é usado pelo Docker Compose. O `.env` em `apps/web/` é usado pelo Prisma.

| Variável | Descrição |
|---|---|
| `MYSQL_DATABASE` | Nome do banco (`cofrefy`) |
| `MYSQL_USER` | Usuário do banco (`cofrefy_user`) |
| `MYSQL_PASSWORD` | Senha do usuário |
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL |
| `DATABASE_URL` | URL de conexão do Prisma |
| `SHADOW_DATABASE_URL` | URL root para migrations locais (`prisma migrate dev`) |
| `PORT` | Porta do servidor Next.js (padrão: `3000`) |

### 3. Subir o banco MySQL

```bash
pnpm db:up
```

Aguarde o container ficar `healthy` antes de rodar migrations (na primeira subida pode levar alguns minutos).

### 4. Aplicar schema e seed

**Fluxo completo pós-clone:**

```bash
pnpm install
pnpm setup:env
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

### 5. Validar conexão com o banco

```bash
pnpm db:validate
```

### 6. Iniciar a aplicação

```bash
pnpm dev
```

A porta é definida por `PORT` em `apps/web/.env` (padrão: **3000**). Se 3000 estiver ocupada, use por exemplo `PORT=3001`.

- App: `http://localhost:<PORT>`
- Categorias: `http://localhost:<PORT>/categories`

## Banco de dados e módulos

| Comando | Quando usar |
|---|---|
| `pnpm db:push` | Desenvolvimento rápido — sincroniza schema sem histórico |
| `pnpm db:migrate` | Desenvolvimento com histórico de migrations |
| `pnpm db:migrate:deploy` | Produção/CI — aplica migrations pendentes |
| `pnpm db:seed` | Insere categorias padrão (idempotente) |
| `pnpm db:generate` | Regenera o Prisma Client após mudanças no schema |

O seed de categorias pode ser executado várias vezes sem duplicar registros.

Se `pnpm db:migrate` falhar com banco shadow inexistente (`P1003`), crie-o uma vez:

```bash
docker exec cofrefy-mysql mysql -uroot -proot_password -e "CREATE DATABASE IF NOT EXISTS cofrefy_shadow;"
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm setup:env` | Copia `.env.example` para raiz e `apps/web/` |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Executa o linter |
| `pnpm db:up` | Sobe o MySQL via Docker Compose |
| `pnpm db:down` | Para o MySQL |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:push` | Sincroniza schema com o banco |
| `pnpm db:migrate` | Cria/aplica migrations em desenvolvimento |
| `pnpm db:migrate:deploy` | Aplica migrations em produção |
| `pnpm db:seed` | Executa seed de categorias padrão |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm db:validate` | Testa conexão Prisma + MySQL |

## Documentação

Consulte os documentos em `docs/` **antes** de implementar qualquer funcionalidade:

- `docs/00-infraestrutura-e-arquitetura.md`
- `docs/01-visao-geral-do-produto.md`
- `docs/02-guia-de-sdd.md`
- `docs/03-modulo-categorias.md` — módulo implementado

Documentos SDD pendentes (criar antes de cada módulo):

- `docs/04-modulo-movimentacoes.md`
- `docs/05-modulo-dashboard-mensal.md`
- `docs/06-modulo-balancete.md`
- `docs/07-plano-de-testes.md`
- `docs/08-prompts-para-agente.md`

## Stack

- TypeScript
- Next.js
- React
- Tailwind CSS
- Prisma
- MySQL (Docker)
- pnpm (monorepo)
