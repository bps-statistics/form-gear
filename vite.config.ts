import { defineConfig } from "vite";
import path from 'path';
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'form-gear',
      fileName: (format) => `form-gear.${format}.js`,
    },
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
