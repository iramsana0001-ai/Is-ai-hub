import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        // Auto-updates the service worker in the background (new content is
        // applied and the page reloads itself once a new version is
        // detected — no user action needed). Registration itself is done
        // manually in src/main.tsx (injectRegister: false) so we can also
        // poll for updates periodically and whenever the installed app is
        // brought back to the foreground — see the comment in main.tsx for
        // why that extra step matters for already-installed PWAs.
        registerType: 'autoUpdate',
        injectRegister: false,
        strategies: 'generateSW',

        includeAssets: [
          'favicon.ico',
          'favicon-16.png',
          'favicon-32.png',
          'apple-touch-icon.png',
          'icon-192-maskable.png',
          'icon-512-maskable.png',
        ],

        manifest: {
          id: '/',
          name: 'IS AI Directory Hub',
          short_name: 'IS AI Hub',
          description: 'Discover free AI tools and Islamic resources in one place.',
          start_url: '/?source=pwa',
          scope: '/',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'browser'],
          orientation: 'any',
          background_color: '#0A0A0A',
          theme_color: '#0B6E4F',
          lang: 'en',
          dir: 'ltr',
          categories: ['productivity', 'education', 'utilities', 'lifestyle'],
          icons: [
            {src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
            {src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
            {src: 'icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable'},
            {src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
          ],
          shortcuts: [
            {
              name: 'AI Finder Wizard',
              short_name: 'AI Finder',
              description: 'Find the right free AI tool for your needs',
              url: '/?shortcut=ai-finder',
              icons: [{src: 'icon-192.png', sizes: '192x192', type: 'image/png'}],
            },
            {
              name: 'Islamic Resources',
              short_name: 'Islamic Resources',
              description: 'Browse Islamic resources',
              url: '/?shortcut=islamic-resources',
              icons: [{src: 'icon-192.png', sizes: '192x192', type: 'image/png'}],
            },
          ],
        },

        workbox: {
          // Precache every built asset (hashed JS/CSS, HTML, icons, manifest).
          globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          // SPA offline navigation: unmatched routes fall back to the
          // cached app shell so client-side routing keeps working offline.
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              // HTML/document navigations: prefer fresh content, fall back to cache offline.
              urlPattern: ({request}) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'is-ai-hub-pages',
                networkTimeoutSeconds: 5,
                expiration: {maxEntries: 50, maxAgeSeconds: 24 * 60 * 60},
                cacheableResponse: {statuses: [0, 200]},
              },
            },
            {
              // Hashed JS/CSS bundles: safe to serve from cache, revalidate in background.
              urlPattern: ({request}) =>
                request.destination === 'script' || request.destination === 'style',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'is-ai-hub-static-resources',
                cacheableResponse: {statuses: [0, 200]},
              },
            },
            {
              // Images/icons: cache-first, rarely change.
              urlPattern: ({request}) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'is-ai-hub-images',
                expiration: {maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60},
                cacheableResponse: {statuses: [0, 200]},
              },
            },
            {
              // Fonts: cache-first with a long expiration.
              urlPattern: ({request}) => request.destination === 'font',
              handler: 'CacheFirst',
              options: {
                cacheName: 'is-ai-hub-fonts',
                expiration: {maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60},
                cacheableResponse: {statuses: [0, 200]},
              },
            },
          ],
        },

        devOptions: {
          // Keep the SW disabled in `vite dev` so it never interferes with HMR.
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
