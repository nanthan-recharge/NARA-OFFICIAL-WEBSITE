import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import siCommon from './locales/si/common.json';
import taCommon from './locales/ta/common.json';

const SUPPORTED_LANGUAGES = ['en', 'si', 'ta'];
const localeModules = import.meta.glob(['./locales/*/*.json', '!./locales/*/common.json']);

const resources = {
  en: { common: enCommon },
  si: { common: siCommon },
  ta: { common: taCommon }
};

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem('nara-lang');
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }

  const browserLang = window.navigator.language.split('-')[0];
  if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }

  return 'en';
};

const resolveLocaleModule = async (lng, ns) => {
  const normalizedLanguage = SUPPORTED_LANGUAGES.includes(lng) ? lng : 'en';
  const exactKey = `./locales/${normalizedLanguage}/${ns}.json`;
  const fallbackKey = `./locales/en/${ns}.json`;

  const loader = localeModules[exactKey] || localeModules[fallbackKey];
  if (!loader) {
    return {};
  }

  const module = await loader();
  return module.default || module;
};

const dynamicLocaleBackend = {
  type: 'backend',
  init: () => {},
  read: (language, namespace, callback) => {
    resolveLocaleModule(language, namespace)
      .then((data) => callback(null, data))
      .catch(() => callback(null, {}));
  }
};

i18n
  .use(dynamicLocaleBackend)
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',
    partialBundledLanguages: true,
    interpolation: {
      escapeValue: false
    },
    returnObjects: true,
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      nsMode: 'default'
    }
  });

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('nara-lang', lng);
  }
});

export const AVAILABLE_LANGUAGES = [
  { code: 'si', labelKey: 'language.sinhala' },
  { code: 'ta', labelKey: 'language.tamil' },
  { code: 'en', labelKey: 'language.english' }
];

export default i18n;
