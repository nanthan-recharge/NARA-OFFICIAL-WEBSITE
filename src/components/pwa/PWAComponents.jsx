import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, RefreshCw } from 'lucide-react';

const PWA_TRI_LINGUAL_TEXT = [
  {
    key: 'si',
    heading: 'නාරා යෙදුම ස්ථාපනය කරන්න',
    subheading: 'ඕනෑම වේලාවක ඉක්මන් ප්‍රවේශයක්',
    description: 'ඕනෑම අවස්ථාවක ඉක්මන් ප්‍රවේශය සහ නොබැඳි සහය සඳහා නාරා ඔබේ මුල් පිටුවට එකතු කරන්න.'
  },
  {
    key: 'ta',
    heading: 'நாரா செயலியை நிறுவுங்கள்',
    subheading: 'எப்போதும் விரைவான அணுகல்',
    description: 'வேகமான அணுகலும் இணையதளமற்ற ஆதரவும் பெற உங்கள் முகப்பு திரையில் நாராவைச் சேர்க்கவும்.'
  },
  {
    key: 'en',
    heading: 'Install NARA App',
    subheading: 'Quick access anytime',
    description: 'Add NARA to your home screen for quick access and offline support.'
  }
];

const PWA_INSTALL_DISMISS_KEY = 'pwa-install-dismissed';
const PWA_INSTALL_COMPLETE_KEY = 'pwa-install-complete';

/**
 * PWA Install Prompt Component
 * Shows a banner prompting users to install the app
 */
export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const markInstalled = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    localStorage.setItem(PWA_INSTALL_COMPLETE_KEY, 'true');
    localStorage.removeItem(PWA_INSTALL_DISMISS_KEY);
    setShowPrompt(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return undefined;
    }

    const hasCompletedInstall = localStorage.getItem(PWA_INSTALL_COMPLETE_KEY);
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      // iOS PWA mode
      window.navigator.standalone;

    if (hasCompletedInstall || isStandalone) {
      markInstalled();
      return undefined;
    }

    const handleInstallAvailable = () => {
      if (!localStorage.getItem(PWA_INSTALL_COMPLETE_KEY) && !localStorage.getItem(PWA_INSTALL_DISMISS_KEY)) {
        setShowPrompt(true);
      }
    };

    const handleInstalled = () => {
      markInstalled();
    };

    // Listen for install availability
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);
    window.addEventListener('appinstalled', handleInstalled);

    // Check if already dismissed
    const dismissed = localStorage.getItem(PWA_INSTALL_DISMISS_KEY);
    if (dismissed) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
      window.removeEventListener('appinstalled', handleInstalled);
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
    localStorage.setItem(PWA_INSTALL_DISMISS_KEY, Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <img
                    src="/assets/nara-logo.png"
                    alt="NARA logo"
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col leading-tight">
                    {PWA_TRI_LINGUAL_TEXT.map(({ key, heading }, index) => (
                      <span
                        key={`pwa-heading-${key}`}
                        className={
                          index === 0
                            ? 'font-bold text-lg'
                            : index === 1
                              ? 'font-semibold text-base'
                              : 'font-semibold text-base'
                        }
                      >
                        {heading}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col leading-tight">
                    {PWA_TRI_LINGUAL_TEXT.map(({ key, subheading }, index) => (
                      <span
                        key={`pwa-subheading-${key}`}
                        className={index === 0 ? 'text-sm opacity-90' : 'text-xs opacity-80'}
                      >
                        {subheading}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-0.5 text-sm opacity-90 mb-4 leading-tight">
            {PWA_TRI_LINGUAL_TEXT.map(({ key, description }, index) => (
              <span key={`pwa-description-${key}`} className={index === 0 ? '' : 'text-xs opacity-80'}>
                {description}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-white text-blue-600 font-semibold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Install
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-3 text-white font-semibold hover:bg-white/20 rounded-xl transition-colors"
            >
              Later
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

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowBanner(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
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
    <div className="fixed top-0 left-0 right-0 z-50 p-4 animate-slide-down">
      <div className="max-w-md mx-auto bg-green-500 text-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold mb-1">New Version Available!</p>
            <p className="text-sm opacity-90">Update now to get the latest features</p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="ml-4 bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Now'
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-500 text-white py-2 px-4 text-center text-sm font-medium">
      <span className="inline-flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        You're offline. Some features may not be available.
      </span>
    </div>
  );
};

/**
 * iOS Install Instructions
 */
export const IOSInstallInstructions = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const checkShowInstructions = async () => {
      const { isIOS, isStandalone } = await import('../../utils/pwa');
      
      // Show instructions for iOS users who haven't installed
      if (isIOS() && !isStandalone()) {
        const dismissed = localStorage.getItem('ios-install-dismissed');
        if (!dismissed) {
          setShowInstructions(true);
        }
      }
    };

    checkShowInstructions();
  }, []);

  const handleDismiss = () => {
    setShowInstructions(false);
    localStorage.setItem('ios-install-dismissed', Date.now().toString());
  };

  if (!showInstructions) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Install NARA App</h3>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Install this app on your iPhone:
            </p>

            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                  1
                </span>
                <span className="text-gray-700 pt-0.5">
                  Tap the Share button at the bottom
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                  2
                </span>
                <span className="text-gray-700 pt-0.5">
                  Scroll down and tap "Add to Home Screen"
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
                  3
                </span>
                <span className="text-gray-700 pt-0.5">
                  Tap "Add" to confirm
                </span>
              </li>
            </ol>
          </div>

          <button
            onClick={handleDismiss}
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Got it!
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
