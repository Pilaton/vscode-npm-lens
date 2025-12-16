import react from '@vitejs/plugin-react';
import { merge } from 'ts-deepmerge';
import { defineConfig, type UserConfig } from 'vite';
import banner from 'vite-plugin-banner';
import svgr from 'vite-plugin-svgr';

const bannerText = `/**
 * npmLens
 * @file Control panel for your project's dependencies.
 * @author Pilaton <dev@pilaton.com>
 * @see {@link https://github.com/Pilaton/npmLens|GitHub}
*/`;

const noAssetsCopyPlugin = () => ({
  name: 'no-assets-copy',
  generateBundle(_, bundle) {
    for (const name in bundle) {
      if (name.startsWith('assets/')) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-unsafe-member-access
        delete bundle[name];
      }
    }
  },
});

const baseBuildConfig = {
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      input: 'src/webview/webview.tsx',
      output: {
        entryFileNames: '[name].js',
        format: 'esm',
      },
    },
  },
} satisfies UserConfig;

const overrides = {
  forDev: {
    build: {
      minify: 'esbuild',
      sourcemap: 'inline',
      chunkSizeWarningLimit: 5000, // Suppress warning for dev with sourcemaps
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
      terserOptions: {
        format: { comments: false },
        compress: {
          passes: 3,
        },
      },
      rollupOptions: {
        treeshake: 'smallest',
        output: {
          compact: true,
        },
      },
    },
  },
} satisfies Record<string, UserConfig>;

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      banner(bannerText),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      svgr(),
      noAssetsCopyPlugin(),
    ],
    ...merge(baseBuildConfig, isDevelopment ? overrides.forDev : overrides.forProd),
  };
});
