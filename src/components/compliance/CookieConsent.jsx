import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Eye } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const consent = localStorage.getItem('nara-cookie-consent');
    const lang = localStorage.getItem('nara-lang') || 'en';
    setLanguage(lang);
    
    if (!consent) {
      // Show banner after 1 second
      setTimeout(() => setIsVisible(true), 1000);
    }

    // Listen for language changes
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const content = {
    en: {
      title: 'Cookie & Privacy Notice',
      description: 'This is an official Sri Lankan Government website. We use essential cookies to ensure proper functioning and analytics cookies to improve our services.',
      pdpaNotice: 'Your data is protected under the Personal Data Protection Act, No. 9 of 2022 (PDPA).',
      essential: 'Essential Cookies',
      essentialDesc: 'Required for site functionality, security, and language preferences.',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand usage patterns to improve our services.',
      acceptAll: 'Accept All',
      acceptEssential: 'Essential Only',
      customize: 'Customize',
      privacyPolicy: 'Privacy Policy',
      close: 'Close'
    },
    si: {
      title: 'කුකී සහ පෞද්ගලිකත්ව දැන්වීම',
      description: 'මෙය නිල ශ්‍රී ලංකා රජයේ වෙබ් අඩවියකි. අපි අත්‍යවශ්‍ය කුකීස් භාවිතා කරන්නේ නිසි ක්‍රියාකාරිත්වය සහතික කිරීමට සහ විශ්ලේෂණ කුකීස් අපගේ සේවා වැඩිදියුණු කිරීමට ය.',
      pdpaNotice: 'ඔබගේ දත්ත පුද්ගලික දත්ත ආරක්ෂණ පනත, අංක 9, 2022 (PDPA) යටතේ ආරක්ෂා වේ.',
      essential: 'අත්‍යවශ්‍ය කුකීස්',
      essentialDesc: 'වෙබ් අඩවියේ ක්‍රියාකාරිත්වය, ආරක්ෂාව සහ භාෂා මනාපයන් සඳහා අවශ්‍ය වේ.',
      analytics: 'විශ්ලේෂණ කුකීස්',
      analyticsDesc: 'අපගේ සේවා වැඩිදියුණු කිරීම සඳහා භාවිත රටා තේරුම් ගැනීමට උපකාරී වේ.',
      acceptAll: 'සියල්ල පිළිගන්න',
      acceptEssential: 'අත්‍යවශ්‍ය පමණක්',
      customize: 'අභිරුචිකරණය',
      privacyPolicy: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය',
      close: 'වසන්න'
    },
    ta: {
      title: 'குக்கீ & தனியுரிமை அறிவிப்பு',
      description: 'இது இலங்கை அரசாங்கத்தின் அதிகாரப்பூர்வ வலைத்தளம். சரியான செயல்பாட்டை உறுதிப்படுத்த அத்தியாவசிய குக்கீகளையும், எங்கள் சேவைகளை மேம்படுத்த பகுப்பாய்வு குக்கீகளையும் பயன்படுத்துகிறோம்.',
      pdpaNotice: 'உங்கள் தரவு தனிப்பட்ட தரவு பாதுகாப்புச் சட்டம், எண். 9, 2022 (PDPA) இன் கீழ் பாதுகாக்கப்படுகிறது.',
      essential: 'அத்தியாவசிய குக்கீகள்',
      essentialDesc: 'தள செயல்பாடு, பாதுகாப்பு மற்றும் மொழி விருப்பங்களுக்குத் தேவை.',
      analytics: 'பகுப்பாய்வு குக்கீகள்',
      analyticsDesc: 'எங்கள் சேவைகளை மேம்படுத்த பயன்பாட்டு முறைகளைப் புரிந்துகொள்ள உதவுகிறது.',
      acceptAll: 'அனைத்தையும் ஏற்கவும்',
      acceptEssential: 'அத்தியாவசியம் மட்டும்',
      customize: 'தனிப்பயனாக்கு',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      close: 'மூடு'
    }
  };

  const t = content[language] || content.en;

  const handleAccept = (type) => {
    const consent = {
      essential: true,
      analytics: type === 'all',
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('nara-cookie-consent', JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Cookie Banner */}
      <div className="relative w-full max-w-6xl mb-6 mx-4 pointer-events-auto animate-slideUp">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Government Badge */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Sri Lanka Government Official Website
              </span>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1" lang={language}>
                <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{t.pdpaNotice}</span>
                </div>
              </div>
            </div>

            {/* Cookie Details (Expandable) */}
            {showDetails && (
              <div className="mb-6 space-y-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700" lang={language}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked disabled className="w-4 h-4" />
                    <span className="text-white font-semibold text-sm">{t.essential}</span>
                  </div>
                  <p className="text-slate-400 text-xs ml-6">{t.essentialDesc}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-white font-semibold text-sm">{t.analytics}</span>
                  </div>
                  <p className="text-slate-400 text-xs ml-6">{t.analyticsDesc}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3" lang={language}>
              <button
                onClick={() => handleAccept('all')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                aria-label={t.acceptAll}
              >
                {t.acceptAll}
              </button>
              <button
                onClick={() => handleAccept('essential')}
                className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                aria-label={t.acceptEssential}
              >
                {t.acceptEssential}
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-6 py-3 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                aria-label={t.customize}
              >
                {t.customize}
              </button>
              <a
                href="/privacy-policy"
                className="px-6 py-3 text-slate-400 hover:text-white text-sm underline transition-colors"
                aria-label={t.privacyPolicy}
              >
                {t.privacyPolicy}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
