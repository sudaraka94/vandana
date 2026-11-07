import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Preload the Sinhala font files the home screen uses first, so the text
// doesn't wait for the CSS to be parsed before the fonts start downloading.
const PRELOAD_FONTS = [/noto-sans-sinhala-sinhala-400-normal-.*\.woff2$/, /noto-serif-sinhala-sinhala-600-normal-.*\.woff2$/];

const preloadFonts = (): Plugin => ({
  name: "vandana:preload-fonts",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler: (_html, ctx) =>
      Object.keys(ctx.bundle ?? {})
        .filter((file) => PRELOAD_FONTS.some((re) => re.test(file)))
        .map((file) => ({
          tag: "link",
          attrs: { rel: "preload", href: `/${file}`, as: "font", type: "font/woff2", crossorigin: "anonymous" },
          injectTo: "head",
        })),
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    preloadFonts(),
    // Service worker: keeps the app and every text on the device, so it opens
    // instantly and works offline. It updates itself after each deploy.
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      manifest: false, // public/manifest.webmanifest is used as is
      workbox: {
        globPatterns: ["index.html", "assets/**/*.{js,css,woff2}", "content/*.json", "images/*.svg", "favicon.*", "icon-192x192.png", "manifest.webmanifest"],
        // Accented Latin letters are rare here; those font files load only if a page needs them.
        globIgnores: ["**/*-latin-ext-*"],
        // Pages opened inside the installed app are rendered by the app itself.
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/(sitemap\.xml|robots\.txt|llms(-full)?\.txt)$/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: { outDir: "docs" },
});
