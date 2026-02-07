import React, { useEffect, useState } from "react";
import Routes from "./Routes";
import {
  InstallPrompt,
  UpdateBanner,
  OfflineIndicator,
  IOSInstallInstructions
} from './components/pwa/PWAComponents';
import { SkipLink } from './components/compliance/SkipLink';
import CookieConsent from './components/compliance/CookieConsent';
import AccessibilityToolbar from './components/compliance/AccessibilityToolbar';
import './styles/variables.css';
import './styles/theme-global.css';
import './styles/academy-themes.css';

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
      <SkipLink />
      <InstallPrompt />
      <UpdateBanner />
      <OfflineIndicator />
      <IOSInstallInstructions />
      <main id="main-content" role="main">
        <Routes />
      </main>
      <CookieConsent />
      <AccessibilityToolbar />
    </>
  );
}

export default App;
