import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enLda from './locales/en/lda.json';
import enMarketplace from './locales/en/marketplace.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enResearch from './locales/en/research.json';
import enCollaboration from './locales/en/collaboration.json';
import enNews from './locales/en/news.json';
import enProcurement from './locales/en/procurement.json';
import enResearchEnhanced from './locales/en/researchEnhanced.json';
import enDigitalLibrary from './locales/en/digitalLibrary.json';
import enKnowledge from './locales/en/knowledge.json';
import enLabResults from './locales/en/labResults.json';
import enMaritime from './locales/en/maritime.json';
import enIntegration from './locales/en/integration.json';
import enFishAdvisory from './locales/en/fishAdvisory.json';
import enAudiences from './locales/en/audiences.json';
import enContact from './locales/en/contact.json';
import enPublicConsultation from './locales/en/publicConsultation.json';
import enOpenData from './locales/en/openData.json';
import enMarineIncident from './locales/en/marineIncident.json';
import enExportMarket from './locales/en/exportMarket.json';
import enMediaGallery from './locales/en/mediaGallery.json';
import enVesselBooking from './locales/en/vesselBooking.json';
import enMedia from './locales/en/media.json';
import enLibrary from './locales/en/library.json';
import enLibraryAuth from './locales/en/libraryAuth.json';
import enLibraryDashboard from './locales/en/libraryDashboard.json';
import enProjectPipeline from './locales/en/project-pipeline.json';
import enScientificEvidence from './locales/en/scientific-evidence.json';
import enRegistration from './locales/en/registration.json';
import enResearchPortal from './locales/en/researchPortal.json';
import enDivisions from './locales/en/divisions.json';
import enAnalytics from './locales/en/analytics.json';
import enIndustryExporters from './locales/en/industryExporters.json';
import enGovernmentServices from './locales/en/governmentServices.json';
import enVesselTracking from './locales/en/vesselTracking.json';
import enNaraAct from './locales/en/naraAct.json';
import enSupportingDivisions from './locales/en/supportingDivisions.json';
import enRegionalCenters from './locales/en/regionalCenters.json';
import enRTI from './locales/en/rti.json';
import enScientistSession from './locales/en/scientistSession.json';
import enVacancies from './locales/en/vacancies.json';
import taCommon from './locales/ta/common.json';
import taLda from './locales/ta/lda.json';
import taMarketplace from './locales/ta/marketplace.json';
import taHome from './locales/ta/home.json';
import taAbout from './locales/ta/about.json';
import taResearch from './locales/ta/research.json';
import taCollaboration from './locales/ta/collaboration.json';
import taNews from './locales/ta/news.json';
import taProcurement from './locales/ta/procurement.json';
import taResearchEnhanced from './locales/ta/researchEnhanced.json';
import taDigitalLibrary from './locales/ta/digitalLibrary.json';
import taKnowledge from './locales/ta/knowledge.json';
import taLabResults from './locales/ta/labResults.json';
import taMaritime from './locales/ta/maritime.json';
import taIntegration from './locales/ta/integration.json';
import taFishAdvisory from './locales/ta/fishAdvisory.json';
import taAudiences from './locales/ta/audiences.json';
import taContact from './locales/ta/contact.json';
import taPublicConsultation from './locales/ta/publicConsultation.json';
import taOpenData from './locales/ta/openData.json';
import taMarineIncident from './locales/ta/marineIncident.json';
import taExportMarket from './locales/ta/exportMarket.json';
import taMediaGallery from './locales/ta/mediaGallery.json';
import taVesselBooking from './locales/ta/vesselBooking.json';
import taMedia from './locales/ta/media.json';
import taLibrary from './locales/ta/library.json';
import taLibraryAuth from './locales/ta/libraryAuth.json';
import taLibraryDashboard from './locales/ta/libraryDashboard.json';
import taProjectPipeline from './locales/ta/project-pipeline.json';
import taScientificEvidence from './locales/ta/scientific-evidence.json';
import taRegistration from './locales/ta/registration.json';
import taResearchPortal from './locales/ta/researchPortal.json';
import taDivisions from './locales/ta/divisions.json';
import taAnalytics from './locales/ta/analytics.json';
import taIndustryExporters from './locales/ta/industryExporters.json';
import taGovernmentServices from './locales/ta/governmentServices.json';
import taVesselTracking from './locales/ta/vesselTracking.json';
import taNaraAct from './locales/ta/naraAct.json';
import taSupportingDivisions from './locales/ta/supportingDivisions.json';
import taRegionalCenters from './locales/ta/regionalCenters.json';
import taRTI from './locales/ta/rti.json';
import taScientistSession from './locales/ta/scientistSession.json';
import taVacancies from './locales/ta/vacancies.json';
import siCommon from './locales/si/common.json';
import siLda from './locales/si/lda.json';
import siMarketplace from './locales/si/marketplace.json';
import siHome from './locales/si/home.json';
import siAbout from './locales/si/about.json';
import siResearch from './locales/si/research.json';
import siCollaboration from './locales/si/collaboration.json';
import siNews from './locales/si/news.json';
import siProcurement from './locales/si/procurement.json';
import siResearchEnhanced from './locales/si/researchEnhanced.json';
import siDigitalLibrary from './locales/si/digitalLibrary.json';
import siKnowledge from './locales/si/knowledge.json';
import siLabResults from './locales/si/labResults.json';
import siMaritime from './locales/si/maritime.json';
import siIntegration from './locales/si/integration.json';
import siFishAdvisory from './locales/si/fishAdvisory.json';
import siAudiences from './locales/si/audiences.json';
import siContact from './locales/si/contact.json';
import siPublicConsultation from './locales/si/publicConsultation.json';
import siOpenData from './locales/si/openData.json';
import siMarineIncident from './locales/si/marineIncident.json';
import siExportMarket from './locales/si/exportMarket.json';
import siMediaGallery from './locales/si/mediaGallery.json';
import siVesselBooking from './locales/si/vesselBooking.json';
import siMedia from './locales/si/media.json';
import siLibrary from './locales/si/library.json';
import siLibraryAuth from './locales/si/libraryAuth.json';
import siLibraryDashboard from './locales/si/libraryDashboard.json';
import siProjectPipeline from './locales/si/project-pipeline.json';
import siScientificEvidence from './locales/si/scientific-evidence.json';
import siRegistration from './locales/si/registration.json';
import siResearchPortal from './locales/si/researchPortal.json';
import siDivisions from './locales/si/divisions.json';
import siAnalytics from './locales/si/analytics.json';
import siIndustryExporters from './locales/si/industryExporters.json';
import siGovernmentServices from './locales/si/governmentServices.json';
import siVesselTracking from './locales/si/vesselTracking.json';
import siNaraAct from './locales/si/naraAct.json';
import siSupportingDivisions from './locales/si/supportingDivisions.json';
import siRegionalCenters from './locales/si/regionalCenters.json';
import siRTI from './locales/si/rti.json';
import siScientistSession from './locales/si/scientistSession.json';
import siVacancies from './locales/si/vacancies.json';

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    research: enResearch,
    collaboration: enCollaboration,
    procurement: enProcurement,
    news: enNews,
    researchEnhanced: enResearchEnhanced,
    digitalLibrary: enDigitalLibrary,
    knowledge: enKnowledge,
    labResults: enLabResults,
    lda: enLda,
    marketplace: enMarketplace,
    maritime: enMaritime,
    integration: enIntegration,
    fishAdvisory: enFishAdvisory,
    audiences: enAudiences,
    contact: enContact,
    publicConsultation: enPublicConsultation,
    openData: enOpenData,
    marineIncident: enMarineIncident,
    exportMarket: enExportMarket,
    mediaGallery: enMediaGallery,
    vesselBooking: enVesselBooking,
    media: enMedia,
    library: enLibrary,
    libraryAuth: enLibraryAuth,
    libraryDashboard: enLibraryDashboard,
    'project-pipeline': enProjectPipeline,
    'scientific-evidence': enScientificEvidence,
    registration: enRegistration,
    researchPortal: enResearchPortal,
    divisions: enDivisions,
    analytics: enAnalytics,
    industryExporters: enIndustryExporters,
    governmentServices: enGovernmentServices,
    vesselTracking: enVesselTracking,
    naraAct: enNaraAct,
    supportingDivisions: enSupportingDivisions,
    regionalCenters: enRegionalCenters,
    rti: enRTI,
    scientistSession: enScientistSession,
    vacancies: enVacancies
  },
  ta: {
    common: taCommon,
    home: taHome,
    about: taAbout,
    research: taResearch,
    collaboration: taCollaboration,
    procurement: taProcurement,
    news: taNews,
    researchEnhanced: taResearchEnhanced,
    digitalLibrary: taDigitalLibrary,
    knowledge: taKnowledge,
    labResults: taLabResults,
    lda: taLda,
    marketplace: taMarketplace,
    maritime: taMaritime,
    integration: taIntegration,
    fishAdvisory: taFishAdvisory,
    audiences: taAudiences,
    contact: taContact,
    publicConsultation: taPublicConsultation,
    openData: taOpenData,
    marineIncident: taMarineIncident,
    exportMarket: taExportMarket,
    mediaGallery: taMediaGallery,
    vesselBooking: taVesselBooking,
    media: taMedia,
    library: taLibrary,
    libraryAuth: taLibraryAuth,
    libraryDashboard: taLibraryDashboard,
    'project-pipeline': taProjectPipeline,
    'scientific-evidence': taScientificEvidence,
    registration: taRegistration,
    researchPortal: taResearchPortal,
    divisions: taDivisions,
    analytics: taAnalytics,
    industryExporters: taIndustryExporters,
    governmentServices: taGovernmentServices,
    vesselTracking: taVesselTracking,
    naraAct: taNaraAct,
    supportingDivisions: taSupportingDivisions,
    regionalCenters: taRegionalCenters,
    rti: taRTI,
    scientistSession: taScientistSession,
    vacancies: taVacancies
  },
  si: {
    common: siCommon,
    home: siHome,
    about: siAbout,
    research: siResearch,
    collaboration: siCollaboration,
    procurement: siProcurement,
    news: siNews,
    researchEnhanced: siResearchEnhanced,
    digitalLibrary: siDigitalLibrary,
    knowledge: siKnowledge,
    labResults: siLabResults,
    lda: siLda,
    marketplace: siMarketplace,
    maritime: siMaritime,
    integration: siIntegration,
    fishAdvisory: siFishAdvisory,
    audiences: siAudiences,
    contact: siContact,
    publicConsultation: siPublicConsultation,
    openData: siOpenData,
    marineIncident: siMarineIncident,
    exportMarket: siExportMarket,
    mediaGallery: siMediaGallery,
    vesselBooking: siVesselBooking,
    media: siMedia,
    library: siLibrary,
    libraryAuth: siLibraryAuth,
    libraryDashboard: siLibraryDashboard,
    'project-pipeline': siProjectPipeline,
    'scientific-evidence': siScientificEvidence,
    registration: siRegistration,
    researchPortal: siResearchPortal,
    divisions: siDivisions,
    analytics: siAnalytics,
    industryExporters: siIndustryExporters,
    governmentServices: siGovernmentServices,
    vesselTracking: siVesselTracking,
    naraAct: siNaraAct,
    supportingDivisions: siSupportingDivisions,
    regionalCenters: siRegionalCenters,
    rti: siRTI,
    scientistSession: siScientistSession,
    vacancies: siVacancies
  }
};

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem('nara-lang');
  if (stored && resources[stored]) {
    return stored;
  }

  const browserLang = window.navigator.language.split('-')[0];
  if (browserLang && resources[browserLang]) {
    return browserLang;
  }

  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    ns: ['common', 'home', 'about', 'research', 'collaboration', 'procurement', 'news', 'researchEnhanced', 'digitalLibrary', 'knowledge', 'labResults', 'lda', 'marketplace', 'maritime', 'integration', 'fishAdvisory', 'audiences', 'contact', 'publicConsultation', 'openData', 'marineIncident', 'exportMarket', 'mediaGallery', 'vesselBooking', 'media', 'library', 'libraryAuth', 'libraryDashboard', 'project-pipeline', 'scientific-evidence', 'registration', 'researchPortal', 'divisions', 'analytics', 'industryExporters', 'scientistSession', 'vacancies', 'governmentServices', 'vesselTracking'],
    defaultNS: 'common',
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

// Set initial language on HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

// Update HTML lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    console.log(`✅ Language set to ${lng === 'en' ? 'English' : lng === 'ta' ? 'Tamil' : 'Sinhala'}`);
  }
});

export const AVAILABLE_LANGUAGES = [
  { code: 'si', labelKey: 'language.sinhala' },
  { code: 'ta', labelKey: 'language.tamil' },
  { code: 'en', labelKey: 'language.english' }
];

export default i18n;
