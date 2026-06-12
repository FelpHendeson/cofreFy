import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function step(number, title) {
  console.log(`\n[${number}/10] ${title}`);
}

export function loadEnvFile(filePath) {
  const env = {};

  if (!existsSync(filePath)) {
    return env;
  }

  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    env[key] = value;
  }

  return env;
}

export function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
