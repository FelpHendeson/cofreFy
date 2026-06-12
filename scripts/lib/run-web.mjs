import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { root } from "./utils.mjs";

export const webDir = resolve(root, "apps/web");

export function runWeb(command, args = []) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: true,
    cwd: webDir,
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
