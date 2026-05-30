import { defineConfig } from "tsdown";

// ESM-only library build. tsdown (Rolldown-based) emits dist/*.js + dist/*.d.ts.
//
// - `unbundle: true` keeps the file graph 1:1 with src/ (Rolldown preserveModules),
//   so per-file `"use client"` directives survive and Tailwind class strings stay
//   as readable literals the consumer's purge step can scan.
// - react / react-dom / tailwindcss (peers) and runtime deps (radix-ui, cva, …)
//   are auto-externalized by tsdown — we do NOT bundle them.
// - The build emits JS + types ONLY. theme.css is produced by the token pipeline
//   (`npm run build:tokens`), never by the bundler.
export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  dts: true,
  unbundle: true,
  clean: true,
  sourcemap: true,
});
