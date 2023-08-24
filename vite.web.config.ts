import react from "@vitejs/plugin-react";
import merge from "ts-deepmerge";
import svgr from "vite-plugin-svgr";
import { UserConfig, defineConfig } from "vite";
import baseConfig from "./vite.config.js";

const noAssetsCopyPlugin = () => ({
  name: "no-assets-copy",
  generateBundle(_, bundle) {
    for (const name in bundle) {
      if (name.startsWith("assets/")) {
        delete bundle[name];
      }
    }
  },
});

export default defineConfig(({ command, mode, ssrBuild }) => {
  const isDev = mode === "development";

  const webConfig: UserConfig = {
    plugins: [react(), svgr(), noAssetsCopyPlugin()],

    build: {
      rollupOptions: {
        input: "src/webview/webview.tsx",
        output: {
          entryFileNames: "[name].js",
          format: "esm",
        },
      },
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
      terserOptions: {
        format: { comments: false },
        compress: {
          passes: 3,
        },
      },
      rollupOptions: {
        treeshake: "smallest",
        output: {
          compact: true,
        },
      },
    },
  };

  return merge(
    baseConfig,
    webConfig,
    isDev ? confOverrideDev : confOverrideProd,
  ) as UserConfig;
});
