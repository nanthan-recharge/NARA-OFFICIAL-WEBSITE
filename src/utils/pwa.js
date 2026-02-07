/**
 * PWA Service Worker Registration and Management
 * Handles service worker lifecycle, updates, and offline capabilities
 */

// Configuration
const SW_PATH = '/service-worker.js';
const SW_SCOPE = '/';

// Service Worker registration status
let registration = null;
let isUpdateAvailable = false;

/**
 * Register the service worker
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service workers are not supported in this browser');
    return null;
  }

  try {
    console.log('[PWA] Registering service worker...');
    
    registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: SW_SCOPE,
      updateViaCache: 'none' // Always fetch fresh SW file
    });

    console.log('[PWA] Service worker registered successfully:', registration);

    // Handle service worker updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[PWA] New service worker found, installing...');

      newWorker.addEventListener('statechange', () => {
        console.log('[PWA] Service worker state:', newWorker.state);

        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          isUpdateAvailable = true;
          console.log('[PWA] New version available, prompting user...');
          notifyUserAboutUpdate();
        }

        if (newWorker.state === 'activated') {
          console.log('[PWA] Service worker activated');
        }
      });
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      console.log('[PWA] Checking for updates...');
      registration.update();
    }, 60 * 60 * 1000);

    // Check for updates when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && registration) {
        console.log('[PWA] Page visible, checking for updates...');
        registration.update();
      }
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      const success = await registration.unregister();
      console.log('[PWA] Service worker unregistered:', success);
      return success;
    }
    
    return false;
  } catch (error) {
    console.error('[PWA] Failed to unregister service worker:', error);
    return false;
  }
}

/**
 * Notify user about available update
 */
function notifyUserAboutUpdate() {
  const event = new CustomEvent('pwa-update-available', {
    detail: {
      registration,
      updateServiceWorker: () => updateServiceWorker()
    }
  });
  
  window.dispatchEvent(event);
}

/**
 * Update the service worker (skip waiting and reload)
 */
export function updateServiceWorker() {
  if (!registration || !registration.waiting) {
    console.warn('[PWA] No waiting service worker found');
    return;
  }

  console.log('[PWA] Updating service worker...');
  
  // Send message to service worker to skip waiting
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  // Reload page when new service worker takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] New service worker activated, reloading page...');
    window.location.reload();
  });
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
}

/**
 * Check if device is iOS
 */
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Check if device is Android
 */
export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if browser supports install prompt
 */
export function supportsInstallPrompt() {
  return 'BeforeInstallPromptEvent' in window;
}

/**
 * Show install prompt
 */
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');
  e.preventDefault();
  deferredInstallPrompt = e;
  
  // Dispatch custom event for UI to handle
  const event = new CustomEvent('pwa-install-available');
  window.dispatchEvent(event);
});

export async function showInstallPrompt() {
  if (!deferredInstallPrompt) {
    console.warn('[PWA] Install prompt not available');
    return { outcome: 'not-available' };
  }

  console.log('[PWA] Showing install prompt...');
  
  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    
    console.log('[PWA] User install choice:', outcome);
    deferredInstallPrompt = null;
    
    return { outcome };
  } catch (error) {
    console.error('[PWA] Install prompt error:', error);
    return { outcome: 'error', error };
  }
}

/**
 * Track app install
 */
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  deferredInstallPrompt = null;
  
  // Track install event (analytics)
  if (window.gtag) {
    window.gtag('event', 'pwa_install', {
      event_category: 'PWA',
      event_label: 'App Installed'
    });
  }
  
  // Dispatch custom event
  const event = new CustomEvent('pwa-installed');
  window.dispatchEvent(event);
});

/**
 * Clear all caches
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('[PWA] All caches cleared');
    return true;
  } catch (error) {
    console.error('[PWA] Failed to clear caches:', error);
    return false;
  }
}

/**
 * Get cache sizes
 */
export async function getCacheSizes() {
  if (!('caches' in window)) {
    return {};
  }

  try {
    const cacheNames = await caches.keys();
    const sizes = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      sizes[cacheName] = requests.length;
    }

    return sizes;
  } catch (error) {
    console.error('[PWA] Failed to get cache sizes:', error);
    return {};
  }
}

/**
 * Check if online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function setupNetworkListeners(onOnline, onOffline) {
  window.addEventListener('online', () => {
    console.log('[PWA] Network: Online');
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Network: Offline');
    if (onOffline) onOffline();
  });
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return 'not-supported';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[PWA] Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('[PWA] Notification permission error:', error);
    return 'error';
  }
}

/**
 * Show notification
 */
export async function showNotification(title, options = {}) {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('[PWA] Notification permission not granted');
    return false;
  }

  try {
    if (registration && registration.showNotification) {
      await registration.showNotification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        ...options
      });
    } else {
      new Notification(title, {
        icon: '/favicon.ico',
        ...options
      });
    }
    
    return true;
  } catch (error) {
    console.error('[PWA] Failed to show notification:', error);
    return false;
  }
}

/**
 * Check storage quota
 */
export async function checkStorageQuota() {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const percentUsed = (estimate.usage / estimate.quota * 100).toFixed(2);
    
    console.log('[PWA] Storage:', {
      used: formatBytes(estimate.usage),
      total: formatBytes(estimate.quota),
      percent: percentUsed + '%'
    });

    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentUsed: parseFloat(percentUsed)
    };
  } catch (error) {
    console.error('[PWA] Failed to check storage:', error);
    return null;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Initialize PWA features
 */
export async function initializePWA() {
  console.log('[PWA] Initializing...');

  // Register service worker
  await registerServiceWorker();

  // Check if standalone
  const standalone = isStandalone();
  console.log('[PWA] Running in standalone mode:', standalone);

  // Setup network listeners
  setupNetworkListeners(
    () => {
      console.log('[PWA] Connection restored');
      // Show toast notification
      showNotification('Back Online', {
        body: 'Your connection has been restored',
        tag: 'network-status'
      });
    },
    () => {
      console.log('[PWA] Connection lost');
      // Show toast notification
      showNotification('You\'re Offline', {
        body: 'Some features may not be available',
        tag: 'network-status'
      });
    }
  );

  // Check storage quota
  await checkStorageQuota();

  console.log('[PWA] Initialization complete');
}

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  updateServiceWorker,
  isStandalone,
  isIOS,
  isAndroid,
  supportsInstallPrompt,
  showInstallPrompt,
  clearAllCaches,
  getCacheSizes,
  isOnline,
  setupNetworkListeners,
  requestNotificationPermission,
  showNotification,
  checkStorageQuota,
  initializePWA
};
