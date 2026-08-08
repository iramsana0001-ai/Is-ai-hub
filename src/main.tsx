import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// --- PWA update handling -----------------------------------------------
// A browser only re-checks a service worker for a new version when it
// performs a fresh navigation/registration check — but an installed PWA is
// usually just resumed from the home screen (app switches back into the
// foreground) rather than freshly reloaded, so that check can go a very
// long time without happening on its own. That's what leaves an installed
// copy "stuck" on an old version after a new deploy. To fix that, we
// register the service worker ourselves (instead of the plugin's default
// auto-injected script) so we can also trigger `registration.update()`:
//   - immediately, once, on startup
//   - every hour while the app stays open
//   - every time the app is brought back into the foreground
// `registerType: 'autoUpdate'` (see vite.config.ts) then takes care of
// applying any update it finds and reloading automatically — no manual
// clearing of data or reinstalling required.
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onRegisteredSW(_swUrl, registration) {
          if (!registration) return;

          const checkForUpdate = () => {
            registration.update().catch(() => {
              // Ignore transient network errors (e.g. offline) — the next
              // scheduled or foreground check will retry.
            });
          };

          checkForUpdate();
          setInterval(checkForUpdate, 60 * 60 * 1000); // hourly while open

          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') checkForUpdate();
          });
        },
      });
    })
    .catch(() => {
      // Service worker registration is a progressive enhancement — if it
      // fails to load for any reason, the app still works normally.
    });
}
