import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Cookie, Shield, X } from 'lucide-react';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }
  try {
    return localStorage.getItem('nara-lang') || 'en';
  } catch {
    return 'en';
  }
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    let consent = null;
    try {
      consent = localStorage.getItem('nara-cookie-consent');
    } catch {
      consent = null;
    }

    let timer;
    if (!consent) {
      // Show banner after first paint — delayed past LCP window
      // to avoid cookie banner being measured as Largest Contentful Paint
      timer = setTimeout(() => setIsVisible(true), 2500);
    }

    // Listen for language changes
    const handleLanguageChange = (e) => setLanguage(e.detail || 'en');
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const content = {
    en: {
      badge: 'Official Government Website',
      title: 'Cookie notice',
      description: 'We use essential cookies for security, language, and site operation. Analytics cookies help improve public services.',
      pdpaNotice: 'Handled under Sri Lanka’s Personal Data Protection Act, No. 9 of 2022.',
      essential: 'Essential Cookies',
      essentialDesc: 'Always on for security, session continuity, and language preferences.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Optional, anonymous usage insights for improving the website.',
      acceptAll: 'Accept all',
      acceptEssential: 'Essential Only',
      saveChoices: 'Save choices',
      customize: 'Manage',
      privacyPolicy: 'Privacy Policy',
      close: 'Close'
    },
    si: {
      badge: 'නිල රජයේ වෙබ් අඩවිය',
      title: 'කුකී දැන්වීම',
      description: 'ආරක්ෂාව, භාෂාව සහ වෙබ් අඩවි ක්‍රියාකාරීත්වය සඳහා අත්‍යවශ්‍ය කුකීස් භාවිතා කරයි. සේවා වැඩිදියුණු කිරීමට විශ්ලේෂණ කුකීස් උපකාරී වේ.',
      pdpaNotice: '2022 අංක 9 දරන පුද්ගලික දත්ත ආරක්ෂණ පනත යටතේ දත්ත සලකනු ලැබේ.',
      essential: 'අත්‍යවශ්‍ය කුකීස්',
      essentialDesc: 'ආරක්ෂාව, සැසි සහ භාෂා මනාපයන් සඳහා සැමවිටම ක්‍රියාත්මක වේ.',
      analytics: 'විශ්ලේෂණ කුකීස්',
      analyticsDesc: 'වෙබ් අඩවිය වැඩිදියුණු කිරීමට භාවිත වන විකල්ප නිර්නාමික දත්ත.',
      acceptAll: 'සියල්ල පිළිගන්න',
      acceptEssential: 'අත්‍යවශ්‍ය පමණක්',
      saveChoices: 'තේරීම් සුරකින්න',
      customize: 'කළමනාකරණය',
      privacyPolicy: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
      close: 'වසන්න'
    },
    ta: {
      badge: 'அதிகாரப்பூர்வ அரச வலைத்தளம்',
      title: 'குக்கீ அறிவிப்பு',
      description: 'பாதுகாப்பு, மொழி மற்றும் தள செயல்பாட்டிற்கு அத்தியாவசிய குக்கீகளைப் பயன்படுத்துகிறோம். சேவைகளை மேம்படுத்த பகுப்பாய்வு குக்கீகள் உதவும்.',
      pdpaNotice: '2022 ஆம் ஆண்டின் எண் 9 தனிப்பட்ட தரவு பாதுகாப்புச் சட்டத்தின் கீழ் தரவு கையாளப்படுகிறது.',
      essential: 'அத்தியாவசிய குக்கீகள்',
      essentialDesc: 'பாதுகாப்பு, அமர்வு மற்றும் மொழி விருப்பங்களுக்கு எப்போதும் இயங்கும்.',
      analytics: 'பகுப்பாய்வு குக்கீகள்',
      analyticsDesc: 'தளத்தை மேம்படுத்த உதவும் விருப்பமான, பெயரற்ற பயன்பாட்டு தகவல்.',
      acceptAll: 'அனைத்தையும் ஏற்கவும்',
      acceptEssential: 'அத்தியாவசியம் மட்டும்',
      saveChoices: 'தேர்வுகளை சேமி',
      customize: 'நிர்வகி',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      close: 'மூடு'
    }
  };

  const t = content[language] || content.en;

  const saveConsent = (analytics) => {
    const consent = {
      essential: true,
      analytics,
      timestamp: new Date().toISOString(),
      version: '1.1'
    };

    try {
      localStorage.setItem('nara-cookie-consent', JSON.stringify(consent));
    } catch {
      // If storage is unavailable, still hide the banner for this session.
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10001] pointer-events-none px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:inset-x-auto sm:right-4 sm:w-[min(26rem,calc(100vw-2rem))] sm:px-0 sm:pb-4">
      <div
        role="region"
        aria-labelledby="nara-cookie-title"
        className="relative mx-auto w-full pointer-events-auto animate-slideUp"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <div className="flex min-w-0 items-center gap-2 text-slate-700 dark:text-slate-200">
              <Shield className="h-3.5 w-3.5 shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
              <span className="truncate text-[11px] font-bold uppercase tracking-[0.14em]">
                {t.badge}
              </span>
            </div>
            <button 
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex h-8 min-h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-full p-0 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={t.close}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="p-3 sm:p-4" lang={language}>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="nara-cookie-title" className="text-sm font-bold text-slate-950 dark:text-white">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.description}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                aria-label={t.acceptAll}
              >
                <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {t.acceptAll}
              </button>
              <button
                type="button"
                onClick={() => saveConsent(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 transition-colors hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                aria-label={t.acceptEssential}
              >
                {t.acceptEssential}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex min-h-8 items-center gap-1 rounded-md px-1 font-semibold text-sky-700 transition-colors hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300 dark:hover:text-sky-100"
                aria-label={t.customize}
                aria-expanded={showDetails}
              >
                {t.customize}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <a
                href="/privacy-policy"
                className="inline-flex min-h-8 items-center rounded-md px-1 font-medium text-slate-500 underline-offset-2 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-slate-300 dark:hover:text-white"
                aria-label={t.privacyPolicy}
              >
                {t.privacyPolicy}
              </a>
            </div>

            {showDetails && (
              <div className="mt-3 max-h-[42vh] space-y-3 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-white/5" lang={language}>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 shrink-0 accent-sky-700" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{t.essential}</span>
                    <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">{t.essentialDesc}</p>
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-sky-700"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{t.analytics}</span>
                    <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-300">{t.analyticsDesc}</p>
                  </div>
                </label>
                <p className="rounded-lg bg-white px-2.5 py-2 font-medium leading-relaxed text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                  {t.pdpaNotice}
                </p>
                <button
                  type="button"
                  onClick={() => saveConsent(analyticsEnabled)}
                  className="inline-flex min-h-9 w-full items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  {t.saveChoices}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
