import { execFileSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";

execFileSync(process.execPath, ["--check", "app.js"], { stdio: "inherit" });
await rm("public", { recursive: true, force: true });
await mkdir("public", { recursive: true });
await Promise.all(
  ["index.html", "app.js", "styles.css"].map((file) =>
    cp(file, `public/${file}`),
  ),
);
