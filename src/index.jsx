import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializePWA } from './utils/pwa';
import "./i18n";
import "./styles/tailwind.css";
import "./styles/index.css";
import './styles/mobile-optimizations.css';
import './styles/accessibility.css';

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
