import {
  runEslint,
  runNextBuild,
  runNodeEnvScript,
  runPrisma,
  runVitest,
} from "./lib/run-web.mjs";

const task = process.argv[2];

const tasks = {
  lint: () => runEslint(),
  test: () => runVitest(),
  dev: () => runNodeEnvScript("scripts/dev.mjs"),
  build: () => runNextBuild(),
  start: () => runNodeEnvScript("scripts/start.mjs"),
  "db:generate": () => runPrisma(["generate"]),
  "db:push": () => runPrisma(["db", "push"]),
  "db:studio": () => runPrisma(["studio"]),
  "db:validate": () => runNodeEnvScript("scripts/validate-db.mjs"),
  "db:migrate": () => runPrisma(["migrate", "dev"]),
  "db:migrate:deploy": () => runPrisma(["migrate", "deploy"]),
  "db:seed": () => runNodeEnvScript("prisma/seed.mjs"),
  "db:seed:scenario": () => runNodeEnvScript("prisma/seed-scenario.mjs"),
  "db:reset": () => runPrisma(["migrate", "reset", "--force"]),
};

if (!task || !tasks[task]) {
  console.error(
    `Tarefa desconhecida: ${task ?? "(vazia)"}. Use: ${Object.keys(tasks).join(", ")}`,
  );
  process.exit(1);
}

tasks[task]();
