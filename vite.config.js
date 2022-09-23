import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())}
  return defineConfig({
    plugins: [
      vue()
    ],
    // base: process.env.NODE_ENV === "production" ? "/vue-meldle/" : '/',
    build: {
      target: 'esnext'
    }
  })
}
  
