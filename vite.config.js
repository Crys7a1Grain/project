import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import ViteVueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), ViteVueJsx()],
})
