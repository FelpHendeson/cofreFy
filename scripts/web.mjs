import { runWeb } from "./lib/run-web.mjs";

const task = process.argv[2];

const tasks = {
  lint: () => runWeb("npx", ["eslint"]),
  dev: () => runWeb("node", ["--env-file=.env", "scripts/dev.mjs"]),
  build: () => runWeb("npx", ["next", "build"]),
  start: () => runWeb("node", ["--env-file=.env", "scripts/start.mjs"]),
  "db:generate": () => runWeb("npx", ["prisma", "generate"]),
  "db:push": () => runWeb("npx", ["prisma", "db", "push"]),
  "db:studio": () => runWeb("npx", ["prisma", "studio"]),
  "db:validate": () => runWeb("node", ["--env-file=.env", "scripts/validate-db.mjs"]),
  "db:migrate": () => runWeb("npx", ["prisma", "migrate", "dev"]),
  "db:migrate:deploy": () => runWeb("npx", ["prisma", "migrate", "deploy"]),
  "db:seed": () => runWeb("node", ["--env-file=.env", "prisma/seed.mjs"]),
  "db:reset": () => runWeb("npx", ["prisma", "migrate", "reset", "--force"]),
};

if (!task || !tasks[task]) {
  console.error(
    `Tarefa desconhecida: ${task ?? "(vazia)"}. Use: ${Object.keys(tasks).join(", ")}`,
  );
  process.exit(1);
}

tasks[task]();
