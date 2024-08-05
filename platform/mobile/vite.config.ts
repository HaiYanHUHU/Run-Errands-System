import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    // port: '3030',
    // open: env.VITE_OPEN,
    cors: true,
    hmr: true,
    // https: false,
    // 代理跨域（mock 不需要配置，这里只是个事列）
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:33334', //本地
        changeOrigin: true,
      },
    },
  },
  resolve: {
    // 别名
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
