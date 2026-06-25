import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Download, RefreshCw, WifiOff, Share2, PlusSquare } from 'lucide-react';

const PWA_COPY = {
  en: {
    heading: 'Install NARA',
    subheading: 'Fast access, fewer reloads, offline support.',
    install: 'Install',
    installing: 'Installing...',
    later: 'Later',
    updateTitle: 'New NARA version available',
    updateText: 'Refresh once to use the latest public services and fixes.',
    updateAction: 'Update',
    updating: 'Updating...',
    offline: 'You are offline. Cached pages remain available.',
    iosTitle: 'Add NARA to Home Screen',
    iosIntro: 'Install the site for quick mobile access.',
    iosStepShare: 'Tap the Share button.',
    iosStepAdd: 'Choose Add to Home Screen.',
    iosDone: 'Got it'
  },
  si: {
    heading: 'NARA ස්ථාපනය කරන්න',
    subheading: 'වේගවත් ප්‍රවේශය, අඩු නැවත පූරණය, නොබැඳි සහාය.',
    install: 'ස්ථාපනය',
    installing: 'ස්ථාපනය වේ...',
    later: 'පසුව',
    updateTitle: 'නව NARA අනුවාදයක් ඇත',
    updateText: 'නවතම සේවා සහ දෝෂ නිරාකරණ සඳහා එක් වරක් යාවත්කාලීන කරන්න.',
    updateAction: 'යාවත්කාලීන',
    updating: 'යාවත්කාලීන වේ...',
    offline: 'ඔබ නොබැඳිව සිටී. සුරැකි පිටු භාවිත කළ හැක.',
    iosTitle: 'NARA මුල් තිරයට එක් කරන්න',
    iosIntro: 'වේගවත් ජංගම ප්‍රවේශය සඳහා වෙබ් අඩවිය ස්ථාපනය කරන්න.',
    iosStepShare: 'Share බොත්තම තට්ටු කරන්න.',
    iosStepAdd: 'Add to Home Screen තෝරන්න.',
    iosDone: 'තේරුණා'
  },
  ta: {
    heading: 'NARA நிறுவவும்',
    subheading: 'வேகமான அணுகல், குறைந்த மீளேற்றம், இணையமற்ற ஆதரவு.',
    install: 'நிறுவு',
    installing: 'நிறுவுகிறது...',
    later: 'பின்னர்',
    updateTitle: 'புதிய NARA பதிப்பு உள்ளது',
    updateText: 'சமீபத்திய சேவைகள் மற்றும் திருத்தங்களுக்கு ஒருமுறை புதுப்பிக்கவும்.',
    updateAction: 'புதுப்பி',
    updating: 'புதுப்பிக்கிறது...',
    offline: 'நீங்கள் இணையமற்ற நிலையில் உள்ளீர்கள். சேமித்த பக்கங்கள் கிடைக்கும்.',
    iosTitle: 'NARA-வை முகப்பு திரையில் சேர்க்கவும்',
    iosIntro: 'வேகமான மொபைல் அணுகலுக்கு தளத்தை நிறுவவும்.',
    iosStepShare: 'Share பொத்தானைத் தட்டவும்.',
    iosStepAdd: 'Add to Home Screen தேர்ந்தெடுக்கவும்.',
    iosDone: 'புரிந்தது'
  }
};

const PWA_INSTALL_DISMISS_KEY = 'pwa-install-dismissed';
const PWA_INSTALL_COMPLETE_KEY = 'pwa-install-complete';
const INSTALL_DISMISS_DAYS = 7;
const IOS_INSTALL_DISMISS_KEY = 'ios-install-dismissed';

const getCurrentLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }
  try {
    return localStorage.getItem('nara-lang') || document.documentElement.lang || 'en';
  } catch {
    return document.documentElement.lang || 'en';
  }
};

const getCopy = (language) => PWA_COPY[language] || PWA_COPY.en;

const getStoredValue = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStoredValue = (key, value) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // PWA prompts should fail quietly if storage is blocked.
  }
};

const removeStoredValue = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore blocked storage.
  }
};

const wasDismissedRecently = (key) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return true;
  }

  const dismissedAt = getStoredValue(key);
  if (!dismissedAt) {
    return false;
  }

  const daysSinceDismiss = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
  return Number.isFinite(daysSinceDismiss) && daysSinceDismiss < INSTALL_DISMISS_DAYS;
};

/**
 * PWA Install Prompt Component
 * Shows a banner prompting users to install the app
 */
export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [language, setLanguage] = useState(getCurrentLanguage);
  const showTimerRef = useRef(null);
  const t = getCopy(language);

  const markInstalled = useCallback(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      setStoredValue(PWA_INSTALL_COMPLETE_KEY, 'true');
      removeStoredValue(PWA_INSTALL_DISMISS_KEY);
    }
    setShowPrompt(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }

    const hasCompletedInstall = getStoredValue(PWA_INSTALL_COMPLETE_KEY);
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      // iOS PWA mode
      window.navigator.standalone;

    if (hasCompletedInstall || isStandalone) {
      markInstalled();
      return undefined;
    }

    const handleLanguageChange = (event) => {
      setLanguage(event.detail || getCurrentLanguage());
    };

    const handleInstallAvailable = () => {
      if (!getStoredValue(PWA_INSTALL_COMPLETE_KEY) && !wasDismissedRecently(PWA_INSTALL_DISMISS_KEY)) {
        const hasCookieConsent = getStoredValue('nara-cookie-consent');
        const delay = hasCookieConsent ? 1800 : 9000;
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = window.setTimeout(() => setShowPrompt(true), delay);
      }
    };

    const handleInstalled = () => {
      markInstalled();
    };

    // Listen for install availability
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('languageChange', handleLanguageChange);

    // Check if already dismissed
    if (wasDismissedRecently(PWA_INSTALL_DISMISS_KEY)) {
      setShowPrompt(false);
    }

    return () => {
      window.clearTimeout(showTimerRef.current);
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [markInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const { showInstallPrompt } = await import('../../utils/pwa');
      const result = await showInstallPrompt();
      if (result?.outcome === 'accepted') {
        markInstalled();
      }
    } catch (error) {
      console.error('Install error:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    setStoredValue(PWA_INSTALL_DISMISS_KEY, Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] pointer-events-none px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:inset-x-auto sm:right-4 sm:w-[min(24rem,calc(100vw-2rem))] sm:px-0 sm:pb-4 animate-slide-up">
      <div className="pointer-events-auto mx-auto overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-950">
        <div className="p-3 text-slate-900 dark:text-white sm:p-4" lang={language}>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10">
              <img
                src="/icons/icon-192x192.png"
                alt="NARA logo"
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold leading-snug">{t.heading}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{t.subheading}</p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex h-8 min-h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-full p-0 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={handleInstall}
              disabled={isInstalling}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-sky-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t.installing}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {t.install}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
            >
              {t.later}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PWA Update Available Banner
 */
export const UpdateBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [language, setLanguage] = useState(getCurrentLanguage);
  const t = getCopy(language);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowBanner(true);
    };
    const handleLanguageChange = (event) => setLanguage(event.detail || getCurrentLanguage());

    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const { updateServiceWorker } = await import('../../utils/pwa');
      updateServiceWorker();
    } catch (error) {
      console.error('Update error:', error);
      setIsUpdating(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[10000] px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] animate-slide-down">
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white p-3 text-slate-900 shadow-xl shadow-slate-900/15 dark:border-white/10 dark:bg-slate-950 dark:text-white" lang={language}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{t.updateTitle}</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{t.updateText}</p>
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t.updating}
              </>
            ) : (
              t.updateAction
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Offline Indicator
 */
export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [language, setLanguage] = useState(getCurrentLanguage);
  const t = getCopy(language);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleLanguageChange = (event) => setLanguage(event.detail || getCurrentLanguage());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[9997] px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <span className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-bold text-amber-900 shadow-lg dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-100" lang={language}>
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        {t.offline}
      </span>
    </div>
  );
};

/**
 * iOS Install Instructions
 */
export const IOSInstallInstructions = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [language, setLanguage] = useState(getCurrentLanguage);
  const t = getCopy(language);

  useEffect(() => {
    const checkShowInstructions = async () => {
      const { isIOS, isStandalone } = await import('../../utils/pwa');
      
      // Show instructions for iOS users who haven't installed
      if (isIOS() && !isStandalone()) {
        if (!wasDismissedRecently(IOS_INSTALL_DISMISS_KEY)) {
          const hasCookieConsent = getStoredValue('nara-cookie-consent');
          window.setTimeout(() => setShowInstructions(true), hasCookieConsent ? 2500 : 9500);
        }
      }
    };

    const handleLanguageChange = (event) => setLanguage(event.detail || getCurrentLanguage());
    window.addEventListener('languageChange', handleLanguageChange);
    checkShowInstructions();

    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const handleDismiss = () => {
    setShowInstructions(false);
    setStoredValue(IOS_INSTALL_DISMISS_KEY, Date.now().toString());
  };

  if (!showInstructions) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] pointer-events-none px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:inset-x-auto sm:right-4 sm:w-[min(24rem,calc(100vw-2rem))] sm:px-0 sm:pb-4 animate-slide-up">
      <div className="pointer-events-auto mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-950">
        <div className="p-4" lang={language}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">{t.iosTitle}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{t.iosIntro}</p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex h-8 min-h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-full p-0 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ol className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </span>
                {t.iosStepShare}
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                  <PlusSquare className="h-4 w-4" aria-hidden="true" />
                </span>
                {t.iosStepAdd}
              </li>
          </ol>

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-sky-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {t.iosDone}
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  InstallPrompt,
  UpdateBanner,
  OfflineIndicator,
  IOSInstallInstructions
};
