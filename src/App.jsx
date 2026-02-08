import React, { useEffect, useState, lazy, Suspense } from "react";
import Routes from "./Routes";
import './styles/variables.css';
import './styles/theme-global.css';
import './styles/academy-themes.css';

// Lazy-load non-critical components — these don't need to block initial render
const InstallPrompt = lazy(() => import('./components/pwa/PWAComponents').then(m => ({ default: m.InstallPrompt })));
const UpdateBanner = lazy(() => import('./components/pwa/PWAComponents').then(m => ({ default: m.UpdateBanner })));
const OfflineIndicator = lazy(() => import('./components/pwa/PWAComponents').then(m => ({ default: m.OfflineIndicator })));
const CookieConsent = lazy(() => import('./components/compliance/CookieConsent'));
const AccessibilityToolbar = lazy(() => import('./components/compliance/AccessibilityToolbar'));

function App() {
  // Use local state instead of zustand to avoid React 19 compatibility issues
  const [theme] = useState('normal');

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <>
      <Routes />
      <Suspense fallback={null}>
        <InstallPrompt />
        <UpdateBanner />
        <OfflineIndicator />
        <CookieConsent />
        <AccessibilityToolbar />
      </Suspense>
    </>
  );
}

export default App;
