import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Base path para producción en Netlify
  base: "/",
  // Configuración para resolver correctamente las rutas en build
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Asegurar que el index.html maneje todas las rutas
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
});
