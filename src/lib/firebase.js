// Firebase configuration and initialization for NARA Digital Ocean
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;