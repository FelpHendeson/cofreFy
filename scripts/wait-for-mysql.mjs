import { execSync } from "node:child_process";

const containerName = "cofrefy-mysql";
const maxAttempts = 60;
const intervalMs = 2000;

function getHealthStatus() {
  return execSync(`docker inspect --format="{{.State.Health.Status}}" ${containerName}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

console.log(`Aguardando ${containerName} ficar healthy...`);

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    const status = getHealthStatus();

    if (status === "healthy") {
      console.log("MySQL pronto.");
      process.exit(0);
    }

    console.log(`Tentativa ${attempt}/${maxAttempts} — status: ${status}`);
  } catch {
    console.log(`Tentativa ${attempt}/${maxAttempts} — container ainda não disponível`);
  }

  await new Promise((resolve) => {
    setTimeout(resolve, intervalMs);
  });
}

console.error(
  `Timeout: ${containerName} não ficou healthy em ${(maxAttempts * intervalMs) / 1000}s.`,
);
console.error("Verifique se o Docker está rodando e execute: pnpm db:up");
process.exit(1);
