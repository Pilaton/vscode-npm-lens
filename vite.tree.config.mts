import { UserConfig, defineConfig } from "vite";
import merge from "ts-deepmerge";
import banner from "vite-plugin-banner";

const bannerText = `/**
 * npmLens
 * @file Control panel for your project's dependencies.
 * @author Pilaton <dev@pilaton.com>
 * @see {@link https://github.com/Pilaton/npmLens|GitHub}
*/`;

const treeConfig = {
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: "dist",
    rollupOptions: {
      external: ["fs", "path", "vscode"],
      input: "./src/extension.ts",
      output: {
        format: "commonjs",
      },
    },
    ssr: true,
    target: "node18",
  },
} satisfies UserConfig;

const overrides = {
  forDev: {
    build: {
      minify: "esbuild",
      sourcemap: "inline",
      rollupOptions: {
        output: {
          compact: false,
        },
      },
    },
  },

  forProd: {
    build: {
      minify: "terser",
      rollupOptions: {
        treeshake: "smallest",
      },
    },
  },
} satisfies Record<string, UserConfig>;

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [banner(bannerText)],
    ...merge(treeConfig, isDev ? overrides.forDev : overrides.forProd),
  };
});
