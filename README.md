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
├── scripts/           # Orquestração do ambiente local
├── docker/            # Arquivos Docker auxiliares
├── docs/              # Especificações do projeto
└── docker-compose.yml # MySQL local
```

## Início rápido (recomendado)

Com Docker em execução, na raiz do monorepo:

```bash
pnpm dev:setup
```

Esse comando único:

1. Cria `.env` e `apps/web/.env` a partir de `.env.example` (se ainda não existirem)
2. Instala dependências (`pnpm install`)
3. Sobe o MySQL via Docker Compose
4. Aguarda o container ficar healthy
5. Garante o banco shadow para migrations
6. Gera o Prisma Client
7. Aplica migrations pendentes
8. Executa o seed de categorias
9. Valida a conexão Prisma + MySQL
10. Inicia o Next.js em modo desenvolvimento

Alias equivalente: `pnpm dev:up`

Após o setup, use `pnpm dev` nos dias seguintes (com o banco já rodando).

## Configuração manual (passo a passo)

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

O `.env` na raiz é usado pelo Docker Compose. O `.env` em `apps/web/` é usado pelo Prisma e Next.js.

| Variável | Descrição |
|---|---|
| `MYSQL_DATABASE` | Nome do banco (`cofrefy`) |
| `MYSQL_USER` | Usuário do banco (`cofrefy_user`) |
| `MYSQL_PASSWORD` | Senha do usuário |
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL |
| `MYSQL_HOST_PORT` | Porta do MySQL no host (padrão: `3306`) |
| `DATABASE_URL` | URL de conexão do Prisma |
| `SHADOW_DATABASE_URL` | URL root para migrations locais (`prisma migrate dev`) |
| `PORT` | Porta do servidor Next.js (padrão: `3000`) |

### 3. Subir o banco MySQL

```bash
pnpm db:up
pnpm db:wait
```

Aguarde o container ficar `healthy` antes de rodar migrations (na primeira subida pode levar alguns minutos).

### 4. Aplicar schema e seed

**Fluxo completo pós-clone (manual):**

```bash
pnpm install
pnpm setup:env
pnpm db:up
pnpm db:wait
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

Para criar novas migrations durante o desenvolvimento, use `pnpm db:migrate` (modo interativo).

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
- Movimentações: `http://localhost:<PORT>/transactions`

## Módulos implementados

| Rota | Descrição |
|---|---|
| `/categories` | CRUD de categorias financeiras |
| `/transactions` | CRUD de movimentações (entradas e saídas) com filtros |

Após alterar o schema Prisma, aplique as migrations:

```bash
pnpm db:migrate:deploy
pnpm db:generate
```

## Banco de dados e módulos

| Comando | Quando usar |
|---|---|
| `pnpm db:push` | Desenvolvimento rápido — sincroniza schema sem histórico |
| `pnpm db:migrate` | Desenvolvimento com histórico — cria/aplica migrations (interativo) |
| `pnpm db:migrate:deploy` | Setup/CI — aplica migrations pendentes sem prompt |
| `pnpm db:seed` | Insere categorias padrão (idempotente) |
| `pnpm db:reset` | Reseta banco local, reaplica migrations e executa seed |
| `pnpm db:generate` | Regenera o Prisma Client após mudanças no schema |

O seed de categorias pode ser executado várias vezes sem duplicar registros.

O banco shadow (`cofrefy_shadow`) é criado automaticamente pelo `pnpm dev:setup`. Se `pnpm db:migrate` falhar com banco shadow inexistente (`P1003`), execute:

```bash
node scripts/ensure-shadow-db.mjs
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev:setup` | Setup completo + inicia Next.js (comando principal) |
| `pnpm dev:up` | Alias de `dev:setup` |
| `pnpm setup:env` | Copia `.env.example` para raiz e `apps/web/` |
| `pnpm dev` | Inicia o servidor de desenvolvimento |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Inicia servidor de produção |
| `pnpm lint` | Executa o linter |
| `pnpm db:up` | Sobe o MySQL via Docker Compose |
| `pnpm db:down` | Para o MySQL |
| `pnpm db:wait` | Aguarda o MySQL ficar healthy |
| `pnpm db:generate` | Gera o Prisma Client |
| `pnpm db:push` | Sincroniza schema com o banco |
| `pnpm db:migrate` | Cria/aplica migrations em desenvolvimento |
| `pnpm db:migrate:deploy` | Aplica migrations pendentes (não interativo) |
| `pnpm db:seed` | Executa seed de categorias padrão |
| `pnpm db:reset` | Reseta banco local (migrations + seed) |
| `pnpm db:studio` | Abre o Prisma Studio |
| `pnpm db:validate` | Testa conexão Prisma + MySQL |

## Como validar o ambiente

### Banco MySQL rodando

```bash
docker ps --filter name=cofrefy-mysql
docker inspect --format='{{.State.Health.Status}}' cofrefy-mysql
```

Esperado: container `Up` e status `healthy`.

### Prisma conectado

```bash
pnpm db:validate
```

Esperado: `Conexão com MySQL estabelecida com sucesso.`

### Aplicação funcionando

Com `pnpm dev` ou após `pnpm dev:setup`:

- Abra `http://localhost:3000` (ou a porta definida em `PORT`)
- Acesse `http://localhost:3000/categories` para categorias
- Acesse `http://localhost:3000/transactions` para movimentações

## Solução de problemas

### Porta 3306 já em uso

Se houver MySQL local na porta 3306, configure no `.env` da raiz:

```env
MYSQL_HOST_PORT=3307
```

E ajuste em `apps/web/.env`:

```env
DATABASE_URL=mysql://cofrefy_user:cofrefy_password@localhost:3307/cofrefy
SHADOW_DATABASE_URL=mysql://root:root_password@localhost:3307/cofrefy_shadow
```

### `pnpm db:generate` falha com EPERM (Windows)

O Prisma não consegue regenerar o client enquanto o servidor Next.js está rodando. Encerre o dev server (`Ctrl+C`) e execute:

```bash
pnpm db:generate
```

Depois reinicie com `pnpm dev`.

Os scripts `lint`, `dev`, `build` e `db:*` (exceto `db:up`/`db:down`/`db:wait`) rodam via `node scripts/web.mjs` para evitar falhas de `pnpm` aninhado no Windows.

## Documentação

Consulte os documentos em `docs/` **antes** de implementar qualquer funcionalidade:

- `docs/00-infraestrutura-e-arquitetura.md`
- `docs/01-visao-geral-do-produto.md`
- `docs/02-guia-de-sdd.md`
- `docs/03-modulo-categorias.md` — módulo implementado
- `docs/04-modulo-movimentacoes.md` — módulo implementado

Documentos SDD pendentes (criar antes de cada módulo):

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
