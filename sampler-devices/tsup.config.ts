import { defineConfig } from "tsup";

export default defineConfig({
    // entry: ["src/index.ts"],
    entry: ["src/s3k.ts", "src/s5k.ts"],
    format: ["cjs", "esm"], // Build for commonJS and ESmodules
    dts: true, // Generate declaration file (.d.ts)
    // experimentalDts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
});