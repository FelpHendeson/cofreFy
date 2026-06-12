import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnvFile, root } from "./lib/utils.mjs";

const rootEnv = loadEnvFile(resolve(root, ".env"));
const webEnv = loadEnvFile(resolve(root, "apps/web/.env"));

const rootPassword = rootEnv.MYSQL_ROOT_PASSWORD ?? "root_password";
const shadowDatabaseUrl = webEnv.SHADOW_DATABASE_URL ?? "";

const shadowDatabaseName =
  shadowDatabaseUrl.match(/\/([^/?]+)(?:\?|$)/)?.[1] ?? "cofrefy_shadow";

const command = [
  "docker",
  "exec",
  "cofrefy-mysql",
  "mysql",
  `-uroot`,
  `-p${rootPassword}`,
  "-e",
  `"CREATE DATABASE IF NOT EXISTS ${shadowDatabaseName};"`,
].join(" ");

try {
  execSync(command, { stdio: "inherit", shell: true });
  console.log(`Banco shadow garantido: ${shadowDatabaseName}`);
} catch (error) {
  console.error("Falha ao criar banco shadow:", error.message);
  process.exit(1);
}
