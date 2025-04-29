import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/deportivo': 'http://localhost:3000',
      '/cultural': 'http://localhost:3000',
      '/academico': 'http://localhost:3000',
      '/laboratoristas': 'http://localhost:3000',
      '/tutoreo': 'http://localhost:3000',
    }
  }
});
