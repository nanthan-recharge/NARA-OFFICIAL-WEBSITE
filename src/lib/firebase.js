// Firebase configuration and initialization for NARA Digital Ocean
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm7WGzLY7qM1i3pLgLhkceS1LTplYh6Lo",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "455192505259",
  appId: "1:455192505259:web:760c764d5e7d7da3b140ee",
  measurementId: "G-8MLEKN8HP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ─── App Check (anti-abuse / anti-spam) ─────────────────────────────────────
// Attests that Firestore/Storage requests come from the real NARA app using
// reCAPTCHA v3, so automated spam (e.g. against the public feedback form) is
// rejected once enforcement is enabled in the Firebase console.
//
// SAFE BY DEFAULT: this only runs when VITE_RECAPTCHA_V3_SITE_KEY is set, so
// the app behaves exactly as before until you register App Check. Roll out by:
//   1. Firebase console → App Check → register this web app with reCAPTCHA v3
//      (paste the reCAPTCHA v3 site key into VITE_RECAPTCHA_V3_SITE_KEY).
//   2. Watch App Check "Requests" in Monitor mode until tokens look healthy.
//   3. Then switch Firestore to "Enforce".
// For localhost, set VITE_APPCHECK_DEBUG_TOKEN (see console → App Check → debug).
if (typeof window !== 'undefined' && import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY) {
  try {
    const debugToken = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN;
    if (debugToken) {
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === 'true' ? true : debugToken;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn('[AppCheck] initialization skipped:', err?.message || err);
  }
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Initialize Analytics lazily — defer GTM script to avoid blocking LCP
let analytics = null;
if (typeof window !== 'undefined') {
  const initAnalytics = () => {
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
      isSupported()?.then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })?.catch(() => {});
    }).catch(() => {});
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnalytics);
  } else {
    setTimeout(initAnalytics, 3000);
  }
}

export { analytics };
export default app;