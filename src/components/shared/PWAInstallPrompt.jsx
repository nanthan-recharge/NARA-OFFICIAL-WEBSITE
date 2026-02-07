import React, { useState, useEffect, useCallback } from 'react';

/**
 * PWAInstallPrompt — Beautiful slide-up banner for PWA installation.
 * Shows on both mobile and desktop when the app is installable.
 * Dismissible with 7-day localStorage cooldown.
 */
const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        // Check if already dismissed recently
        const dismissedAt = localStorage.getItem('pwa-install-dismissed');
        if (dismissedAt) {
            const daysSinceDismiss = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismiss < 7) return;
        }

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) return;
        if (window.navigator.standalone) return;

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Small delay so the page loads first
            setTimeout(() => setShowBanner(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;
        setIsInstalling(true);

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setShowBanner(false);
            }
        } catch (err) {
            console.warn('PWA install failed:', err);
        } finally {
            setDeferredPrompt(null);
            setIsInstalling(false);
        }
    }, [deferredPrompt]);

    const handleDismiss = useCallback(() => {
        setShowBanner(false);
        localStorage.setItem('pwa-install-dismissed', String(Date.now()));
    }, []);

    if (!showBanner) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
            style={{
                animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
        >
            <div className="mx-auto max-w-lg px-4 pb-4">
                <div
                    className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 40, 80, 0.95) 0%, rgba(0, 80, 160, 0.95) 100%)',
                    }}
                >
                    {/* Decorative gradient accent */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                            background: 'linear-gradient(90deg, #00d4ff, #0099ff, #00d4ff)',
                        }}
                    />

                    <div className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            {/* App Icon */}
                            <div className="flex-shrink-0">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #0066CC, #0099FF)',
                                    }}
                                >
                                    <img
                                        src="/assets/nara-logo.png"
                                        alt="NARA"
                                        className="h-8 w-8 rounded-lg object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                      `;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-white">
                                    Install NARA App
                                </h3>
                                <p className="mt-0.5 text-xs text-cyan-100/80 leading-relaxed">
                                    Get instant access to ocean data, advisories & services — works offline too.
                                </p>
                            </div>

                            {/* Dismiss button */}
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="flex-shrink-0 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                                aria-label="Dismiss install prompt"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleInstall}
                                disabled={isInstalling}
                                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/25 disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(135deg, #00aaff, #0077cc)',
                                }}
                            >
                                {isInstalling ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M4 12a8 8 0 0 1 8-8" />
                                        </svg>
                                        Installing...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Install App
                                    </span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default PWAInstallPrompt;
