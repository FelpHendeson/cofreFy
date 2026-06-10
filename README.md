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

Copie o arquivo de exemplo para a raiz do projeto e para a aplicação web:

```bash
cp .env.example .env
cp .env.example apps/web/.env
```

O `.env` na raiz é usado pelo Docker Compose. O `.env` em `apps/web/` é usado pelo Prisma.

As variáveis necessárias:

| Variável | Descrição |
|---|---|
| `MYSQL_DATABASE` | Nome do banco (`cofrefy`) |
| `MYSQL_USER` | Usuário do banco (`cofrefy_user`) |
| `MYSQL_PASSWORD` | Senha do usuário |
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL |
| `DATABASE_URL` | URL de conexão do Prisma |

### 3. Subir o banco MySQL

```bash
pnpm db:up
```

Ou diretamente:

```bash
docker compose up -d
```

### 4. Gerar o client do Prisma

```bash
pnpm db:generate
```

### 5. Validar conexão com o banco

```bash
pnpm db:validate
```

### 6. Iniciar a aplicação

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Executa o linter |
| `pnpm db:up` | Sobe o MySQL via Docker Compose |
| `pnpm db:down` | Para o MySQL |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:push` | Sincroniza schema com o banco |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm db:validate` | Testa conexão Prisma + MySQL |

## Documentação

Consulte os documentos em `docs/` antes de implementar qualquer funcionalidade:

- `docs/00-infraestrutura-e-arquitetura.md`
- `docs/01-visao-geral-do-produto.md`
- `docs/02-guia-de-sdd.md`

## Stack

- TypeScript
- Next.js
- React
- Tailwind CSS
- Prisma
- MySQL (Docker)
- pnpm (monorepo)
