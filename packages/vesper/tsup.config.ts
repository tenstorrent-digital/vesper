import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  tsconfig: "./tsconfig.build.json",
  outDir: "dist",
  format: ["esm"],
  target: "es2022",
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: false,
  splitting: false,
  external: ["react", "react-dom"],
  outExtension() {
    return {
      js: ".js",
    };
  },
  onSuccess: "tsx scripts/copy-styles.ts",
});
