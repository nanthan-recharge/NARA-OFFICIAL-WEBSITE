// Simple theme store using vanilla JS + React integration
// This avoids zustand compatibility issues with React 19

import { useSyncExternalStore, useCallback } from 'react';

let theme = 'normal';
const listeners = new Set();

const themeStore = {
  getState: () => ({ theme }),
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setState: (newState) => {
    if (typeof newState === 'function') {
      newState = newState({ theme });
    }
    if (newState.theme !== undefined) {
      theme = newState.theme;
      listeners.forEach((listener) => listener({ theme }));
    }
  },
};

// React hook for using the theme store
const useThemeStore = (selector = (state) => state.theme) => {
  const subscribe = useCallback((callback) => {
    return themeStore.subscribe(callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return selector({ theme });
  }, [selector]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

// Export actions for use in components
export const toggleTheme = () => {
  const themes = ['normal', 'dark', 'glow'];
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  themeStore.setState({ theme: themes[nextIndex] });
};

export const setTheme = (newTheme) => {
  themeStore.setState({ theme: newTheme });
};

export default useThemeStore;
