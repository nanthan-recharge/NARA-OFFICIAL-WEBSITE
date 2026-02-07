/**
 * Mobile Performance Optimizations
 * Detects mobile devices and applies optimizations
 */

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isSlowConnection = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  const conn = navigator.connection;
  return (
    conn.effectiveType === 'slow-2g' ||
    conn.effectiveType === '2g' ||
    conn.saveData
  );
};

/**
 * Reduce motion for users with motion sensitivity or mobile
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get viewport dimensions optimized for mobile
 */
export const getViewport = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};

/**
 * Throttle function for performance-critical events (scroll, resize)
 */
export const throttle = (func, wait = 100) => {
  let timeout = null;
  let previous = 0;

  return function executedFunction(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
};

/**
 * Debounce function for input handlers
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Touch event optimization - prevents double-tap zoom
 */
export const preventDoubleTapZoom = (element) => {
  if (!element) return;
  
  let lastTap = 0;
  element.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
      event.preventDefault();
    }
    lastTap = currentTime;
  });
};

/**
 * Request idle callback polyfill for non-critical tasks
 */
export const requestIdleCallbackPolyfill = (callback, options = {}) => {
  if (typeof window.requestIdleCallback !== 'undefined') {
    return window.requestIdleCallback(callback, options);
  }
  
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallbackPolyfill = (id) => {
  if (typeof window.cancelIdleCallback !== 'undefined') {
    return window.cancelIdleCallback(id);
  }
  clearTimeout(id);
};

export default {
  isMobile,
  isSlowConnection,
  prefersReducedMotion,
  getViewport,
  throttle,
  debounce,
  preventDoubleTapZoom,
  requestIdleCallbackPolyfill,
  cancelIdleCallbackPolyfill
};
