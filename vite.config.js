import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Si lo publicás en GitHub Pages bajo un subdirectorio (p. ej.
// jogretoco88.github.io/mexilink-inventario/), cambiá base a "/mexilink-inventario/".
export default defineConfig({
  base: "/inventario-mexilink2/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png", "icon-maskable-512.png"],
      manifest: {
        name: "Inventario MexiLink",
        short_name: "Inventario",
        description: "Conteo semanal de inventario para la ruta DSD de King Soopers.",
        lang: "es",
        theme_color: "#0f1115",
        background_color: "#0f1115",
        display: "standalone",
        orientation: "portrait",
        start_url: ".",
        scope: ".",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
        navigateFallback: "index.html",
      },
    }),
  ],
});
