import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./lib/utils.mjs";

const examplePath = resolve(root, ".env.example");
const targets = [resolve(root, ".env"), resolve(root, "apps/web/.env")];

let created = false;

for (const target of targets) {
  if (existsSync(target)) {
    console.log(`Já existe: ${target}`);
    continue;
  }

  copyFileSync(examplePath, target);
  console.log(`Criado: ${target}`);
  created = true;
}

if (created) {
  console.log("Revise os arquivos .env se precisar ajustar credenciais ou porta.");
}
