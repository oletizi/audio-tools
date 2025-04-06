import { defineConfig } from "tsup";

export default defineConfig({
    // entry: ["src-deprecated/index.ts"],
    entry: ["src-deprecated/index.ts", "src-deprecated/s3k.ts", "src-deprecated/s5k.ts"],
    format: ["cjs", "esm"], // Build for commonJS and ESmodules
    dts: true, // Generate declaration file (.d.ts)
    // experimentalDts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
});