// Firebase Configuration for NARA Digital Ocean
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics lazily — defer GTM script to avoid blocking LCP
let analytics = null;
if (typeof window !== 'undefined') {
  // Delay analytics initialization until after first paint
  const initAnalytics = () => {
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
      isSupported()?.then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })?.catch(() => {});
    }).catch(() => {});
  };
  // Use requestIdleCallback to avoid blocking main thread
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnalytics);
  } else {
    setTimeout(initAnalytics, 3000);
  }
}

export { analytics };

// Development mode emulator connections (optional)
if (import.meta.env?.DEV && typeof window !== 'undefined') {
  // Uncomment these lines if you want to use Firebase emulators in development
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, "localhost", 9199);
  // connectFunctionsEmulator(functions, "localhost", 5001);
}

export default app;