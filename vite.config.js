import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  /* "command" não serve aqui: vale 'serve' tanto no dev quanto no
     preview, e o preview precisa do mesmo prefixo do build, senão
     devolve o index.html no lugar dos assets. "mode" separa certo:
     development no dev, production no build e no preview. */
  base: mode === 'production' ? '/portfolio/' : '/',

  build: {
    // o GitHub Pages serve a pasta docs/ do branch principal
    outDir: 'docs',
    emptyOutDir: true
  }
}));
