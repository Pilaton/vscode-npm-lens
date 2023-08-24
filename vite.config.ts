import { defineConfig } from "vite";

import banner from "vite-plugin-banner";

const bannerText = `/**
 * npmLens
 * @file Control panel for your project's dependencies.
 * @author Pilaton <dev@pilaton.com>
 * @see {@link https://github.com/Pilaton/npmLens|GitHub}
*/`;

export default defineConfig({
  plugins: [banner(bannerText)],
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: "dist",
  },
});
