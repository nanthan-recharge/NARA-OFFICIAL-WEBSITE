import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializePWA } from './utils/pwa';
import "./i18n";
import "./styles/tailwind.css";
import "./styles/index.css";
import './styles/mobile-optimizations.css';
import './styles/accessibility.css';

// Recover from stale lazy-chunk references after a deploy: when a dynamic import
// (route chunk) fails to load — usually because the cached index.html points at
// JS chunks a newer release has purged — reload once to fetch fresh assets
// instead of hanging on the loading spinner. Guarded so it can't loop.
const recoverFromStaleChunk = () => {
  try {
    if (sessionStorage.getItem('nara-chunk-reloaded')) return;
    sessionStorage.setItem('nara-chunk-reloaded', '1');
    window.location.reload();
  } catch (e) {
    window.location.reload();
  }
};
// Vite fires this when a module preload fails.
window.addEventListener('vite:preloadError', recoverFromStaleChunk);
// Fallback for runtime dynamic-import failures.
window.addEventListener('error', (e) => {
  const msg = e?.message || '';
  if (/Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i.test(msg)) {
    recoverFromStaleChunk();
  }
});
window.addEventListener('unhandledrejection', (e) => {
  const msg = (e?.reason && (e.reason.message || String(e.reason))) || '';
  if (/Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically/i.test(msg)) {
    recoverFromStaleChunk();
  }
});
// Clear the guard once the app has booted successfully.
window.addEventListener('load', () => {
  setTimeout(() => { try { sessionStorage.removeItem('nara-chunk-reloaded'); } catch (e) {} }, 5000);
});

const container = document.getElementById("root");
const root = createRoot(container);

// Initialize PWA only in production.
// In development, proactively clear stale service workers/caches that can mask local UI changes.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    initializePWA().catch(error => {
      console.error('PWA Initialization failed:', error);
    });
  } else {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch((error) => console.warn('Failed to unregister service workers in development:', error));

    if ('caches' in window) {
      caches.keys()
        .then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
        .catch((error) => console.warn('Failed to clear caches in development:', error));
    }
  }
}

root.render(<App />);
