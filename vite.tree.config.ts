import { UserConfig, defineConfig } from "vite";
import merge from "ts-deepmerge";
import baseConfig from "./vite.config.js";

export default defineConfig(({ command, mode, ssrBuild }) => {
  const isDev = mode === "development";

  const treeConfig: UserConfig = {
    build: {
      rollupOptions: {
        external: ["fs", "path", "vscode"],
        input: "./src/extension.ts",
        output: {
          format: "cjs",
        },
      },
      ssr: true,
      target: "node18",
    },
  };

  const confOverrideDev: UserConfig = {
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          compact: false,
          sourcemap: "inline",
        },
      },
    },
  };

  const confOverrideProd: UserConfig = {
    build: {
      minify: "terser",
      rollupOptions: {
        treeshake: "smallest",
      },
    },
  };

  return merge(
    baseConfig,
    treeConfig,
    isDev ? confOverrideDev : confOverrideProd,
  ) as UserConfig;
});
