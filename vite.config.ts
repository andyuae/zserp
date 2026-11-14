import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS === 'true' && repository ? `/${repository}/` : '/'

export default defineConfig({
  base,
  plugins: [
    vue(),
    AutoImport({ resolvers: [ElementPlusResolver()], dts: 'src/auto-imports.d.ts' }),
    Components({ resolvers: [ElementPlusResolver()], dts: 'src/components.d.ts' }),
  ],
  optimizeDeps: { noDiscovery: true, include: [] },
})
