import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import legacy from '@vitejs/plugin-legacy';
import esbuild from 'rollup-plugin-esbuild';
import dotenv from 'dotenv';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }): any => {
  dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  });
  let env = process.env;
  return {
    base: env.VITE_BASE || '/',
    server: {
      host: '0.0.0.0', // Server host name, set to "0.0.0.0" if external access is allowed
      port: '3030',
      open: env.VITE_OPEN,
      cors: true,
      hmr: true,
      // https: false,
      // 
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:33334', //localhost
          changeOrigin: true,
          bypass(req, res, options) {
            const proxyURL = options.target + (req.url);
            res.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
          },
        },
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_TITLE,
            env: process.env.NODE_ENV,
          },
        },
      }),
      {
        ...esbuild({
          target: 'chrome66',
          include: /\.[jt]sx?$/,
          loaders: {
            '.js': 'jsx',
          },
        }),
        enforce: 'post',
        pure: env.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      },
      legacy({
        renderLegacyChunks: false,
        modernPolyfills: ['es.global-this'],
        targets: ['chrome 66'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // This plug-in is required for IE11
      }),
      mode === 'analysis' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1536,
      rollupOptions: {
        output: {
          manualChunks(id: string | string[]) {
            if (id.includes('node_modules')) {
              if (id.includes('node_modules/echarts')) {
                return `echarts`;
              }
            }
          },
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    resolve: {
      // 
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      //
      preprocessorOptions: {
        less: {
          charset: false,
          javascriptEnabled: true,
        },
        sass: {
          charset: false,
          javascriptEnable: true,
        },
      },
    },
  };
});

