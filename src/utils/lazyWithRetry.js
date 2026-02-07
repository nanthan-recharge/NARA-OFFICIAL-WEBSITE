/**
 * Enhanced lazy loading with retry logic for better mobile reliability
 * Automatically retries failed chunk loads (common on poor connections)
 */
export const lazyWithRetry = (componentImport, retries = 3, interval = 1000) => {
  return new Promise((resolve, reject) => {
    const attemptLoad = (remainingRetries) => {
      componentImport()
        .then(resolve)
        .catch((error) => {
          if (remainingRetries === 0) {
            reject(error);
            return;
          }
          
          setTimeout(() => {
            console.log(`Retrying chunk load... (${retries - remainingRetries + 1}/${retries})`);
            attemptLoad(remainingRetries - 1);
          }, interval);
        });
    };
    
    attemptLoad(retries);
  });
};

/**
 * Preload a route component for faster navigation
 * Useful for anticipated user navigation paths
 */
export const preloadComponent = (componentImport) => {
  // Start loading but don't wait for it
  componentImport().catch(() => {
    // Silently fail preloads
  });
};

/**
 * Create a lazy component with prefetch on hover/focus
 */
export const lazyWithPrefetch = (componentImport) => {
  let component = null;
  
  return {
    load: () => {
      if (!component) {
        component = componentImport();
      }
      return component;
    },
    prefetch: () => {
      if (!component) {
        component = componentImport();
      }
    }
  };
};

export default lazyWithRetry;
