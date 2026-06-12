import { resolve } from "node:path";
import { run, step, root } from "./lib/utils.mjs";

const webDir = resolve(root, "apps/web");

console.log("CofreFy — setup completo de desenvolvimento local\n");

step(1, "Variáveis de ambiente");
run("node", ["scripts/ensure-env.mjs"]);

step(2, "Dependências (pnpm install)");
run("pnpm", ["install"]);

step(3, "MySQL via Docker Compose");
run("docker", ["compose", "up", "-d"]);

step(4, "Aguardando MySQL ficar healthy");
run("node", ["scripts/wait-for-mysql.mjs"]);

step(5, "Banco shadow para migrations locais");
run("node", ["scripts/ensure-shadow-db.mjs"]);

step(6, "Prisma Client (generate)");
run("npx", ["prisma", "generate"], { cwd: webDir });

step(7, "Migrations pendentes (deploy)");
run("npx", ["prisma", "migrate", "deploy"], { cwd: webDir });

step(8, "Seed de categorias padrão");
run("node", ["--env-file=.env", "prisma/seed.mjs"], { cwd: webDir });

step(9, "Validação da conexão Prisma + MySQL");
run("node", ["--env-file=.env", "scripts/validate-db.mjs"], { cwd: webDir });

step(10, "Servidor Next.js em modo desenvolvimento");
console.log("\nAmbiente pronto. Pressione Ctrl+C para encerrar o servidor.\n");
run("node", ["--env-file=.env", "scripts/dev.mjs"], { cwd: webDir });
