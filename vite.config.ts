import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: command === 'build' ? '/gibbs-aleks-helper/' : '/',
  build: {
    outDir: 'build/client',
    assetsDir: 'assets',
  },
}));
