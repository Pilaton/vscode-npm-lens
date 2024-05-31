import path from 'node:path';
import { merge } from 'ts-deepmerge';
import { type UserConfig, defineConfig } from 'vite';
import banner from 'vite-plugin-banner';

const bannerText = `/**
 * npmLens
 * @file Control panel for your project's dependencies.
 * @author Pilaton <dev@pilaton.com>
 * @see {@link https://github.com/Pilaton/npmLens|GitHub}
*/`;

const baseBuildConfig = {
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'node_modules/vscode'),
    },
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      external: [
        /node:[a-zA-Z0-9_:]*/,
        'node:stream',
        'fs',
        'path',
        'child_process',
        'stream',
        'vscode',
      ],
      input: './src/extension.ts',
      output: {
        entryFileNames: '[name].js',
        format: 'commonjs',
      },
    },
    lib: {
      entry: './src/extension.ts',
      formats: ['cjs'],
    },
    // ssr: true,
    target: 'node20',
  },
} satisfies UserConfig;

const overrides = {
  forDev: {
    build: {
      minify: 'esbuild',
      sourcemap: 'inline',
      rollupOptions: {
        output: {
          compact: false,
        },
      },
    },
  },

  forProd: {
    build: {
      minify: 'terser',
      rollupOptions: {
        treeshake: 'recommended',
      },
    },
  },
} satisfies Record<'forDev' | 'forProd', UserConfig>;

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [banner(bannerText)],
    ...merge(baseBuildConfig, isDevelopment ? overrides.forDev : overrides.forProd),
  };
});
