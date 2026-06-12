import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./utils.mjs";

export const webDir = resolve(root, "apps/web");

function resolveBin(...segments) {
  const binPath = resolve(webDir, "node_modules", ...segments);

  if (!existsSync(binPath)) {
    throw new Error(`Binário não encontrado: ${binPath}`);
  }

  return binPath;
}

function runNode(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit",
    shell: false,
    cwd: webDir,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export function runEslint() {
  runNode(resolveBin("eslint", "bin", "eslint.js"), ["."]);
}

export function runNextBuild() {
  runNode(resolveBin("next", "dist", "bin", "next"), ["build"]);
}

export function runPrisma(args) {
  runNode(resolveBin("prisma", "build", "index.js"), args);
}

export function runNodeScript(scriptRelativePath, args = []) {
  runNode(resolve(webDir, scriptRelativePath), args);
}

export function runNodeEnvScript(scriptRelativePath, args = []) {
  const envFile = resolve(webDir, ".env");
  const result = spawnSync(
    process.execPath,
    ["--env-file", envFile, resolve(webDir, scriptRelativePath), ...args],
    {
      stdio: "inherit",
      shell: false,
      cwd: webDir,
      env: process.env,
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
