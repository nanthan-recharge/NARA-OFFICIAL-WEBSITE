import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import MultilingualContent from '../../components/compliance/MultilingualContent';
import {
  Download,
  Database,
  FileJson,
  BookOpen,
  Shield,
  Globe,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const datasets = [
  {
    id: 'fish-stock-assessment',
    title: {
      en: 'Coastal Fish Stock Assessment 2015-2024',
      si: 'වෙරළ මත්ස්‍ය තොග තක්සේරුව 2015-2024',
      ta: 'கடற்கரை மீன் இருப்பு மதிப்பீடு 2015-2024'
    },
    description: {
      en: 'Monthly catch, effort, and size data for 15 key coastal species across Sri Lanka.',
      si: 'ශ්‍රී ලංකාව පුරා ප්‍රධාන වෙරළ මත්ස්‍ය වර්ග 15 සඳහා මාසික අල්ලීම, උත්සාහය සහ ප්‍රමාණ දත්ත.',
      ta: 'இலங்கையின் 15 முக்கிய கடற்கரை இனங்களுக்கு மாதாந்திர பிடிப்பு, முயற்சி மற்றும் அளவு தரவு.'
    },
    category: 'fisheries',
    records: 126840,
    updated: '2024-12-20',
    formats: ['CSV', 'JSON', 'API'],
    license: 'CC BY 4.0',
    datagovlk: true
  },
  {
    id: 'ocean-current-data',
    title: {
      en: 'Ocean Current & Temperature Data 2024',
      si: 'සාගර ධාරා සහ උෂ්ණත්ව දත්ත 2024',
      ta: 'கடல் நீரோட்டம் & வெப்பநிலை தரவு 2024'
    },
    description: {
      en: 'Real-time oceanographic observations from offshore monitoring buoys.',
      si: 'මුහුදු මට්ටමේ නිරීක්ෂණ තටාකවලින් ලබාගත් වාර්තාමාන සාගර විද්‍යාත්මක දත්ත.',
      ta: 'ஆழ்கடல் கண்காணிப்பு மிதவைகளிலிருந்து நிகழ்நேர கடல்சார் கண்காணிப்புகள்.'
    },
    category: 'oceanography',
    records: 52400,
    updated: '2024-12-18',
    formats: ['CSV', 'JSON', 'API'],
    license: 'CC BY 4.0',
    datagovlk: false
  },
  {
    id: 'research-publications',
    title: {
      en: 'NARA Research Publications 2010-2024',
      si: 'NARA පර්යේෂණ ප්‍රකාශන 2010-2024',
      ta: 'NARA ஆராய்ச்சி வெளியீடுகள் 2010-2024'
    },
    description: {
      en: 'Peer-reviewed papers, technical reports, and knowledge briefs produced by NARA teams.',
      si: 'NARA කණ්ඩායම් විසින් සකස් කළ සම-සමාලෝචනය කළ පර්යේෂණ යොමු, තාක්ෂණික වාර්තා සහ දැනුම් සාරාංශ.',
      ta: 'NARA அணிகள் தயாரித்த சக மதிப்பாய்வு கட்டுரைகள், தொழில்நுட்ப அறிக்கைகள் மற்றும் அறிவு சுருக்கங்கள்.'
    },
    category: 'publications',
    records: 1240,
    updated: '2024-12-15',
    formats: ['JSON', 'XML'],
    license: 'CC BY 4.0',
    datagovlk: true
  }
];

const categoryIds = ['all', 'fisheries', 'environment', 'research', 'aquaculture', 'oceanography', 'publications'];

const OpenDataPortal = () => {
  const { t, i18n } = useTranslation('openData');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const language = useMemo(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    return ['en', 'si', 'ta'].includes(lang) ? lang : 'en';
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categoryOptions = useMemo(
    () => categoryIds.map((id) => ({ id, label: t(`categories.${id}`) })),
    [language, t]
  );

  const filteredDatasets = useMemo(
    () =>
      datasets.filter((dataset) => {
        const title = dataset.title[language] || dataset.title.en;
        const description = dataset.description[language] || dataset.description.en;
        const matchesSearch =
          searchQuery.trim() === '' ||
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [language, searchQuery, selectedCategory]
  );

  const resultsLabel = t('filters.results', { count: filteredDatasets.length });

  return (
    <MultilingualContent language={language}>
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCA2LTE2IDYtMjIgMHMtNi0xNC02LTE0IDYtNiAxNC02IDEwLTIgMTQgNCA0IDEwIDAgMTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 font-semibold backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  <span>{t('hero.badge')}</span>
                </div>
              </div>

              <h1 className="mb-6 text-5xl font-bold md:text-6xl">{t('hero.title')}</h1>
              <p className="mb-4 text-2xl text-white/90">{t('hero.subtitle')}</p>
              <p className="mx-auto max-w-3xl text-lg text-white/80">{t('hero.description')}</p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-yellow-300" />
                <div className="text-left">
                  <div className="text-xs text-white/70">{t('hero.licenseLabel')}</div>
                  <div className="font-bold text-white">{t('hero.licenseValue')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="relative z-20 -mt-8 mx-auto max-w-7xl px-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-600">{t('filters.searchLabel')}</span>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('filters.searchPlaceholder')}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-gray-600">{t('filters.categoryLabel')}</span>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-10 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">{resultsLabel}</div>
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredDatasets.map((dataset, index) => {
              const title = dataset.title[language] || dataset.title.en;
              const description = dataset.description[language] || dataset.description.en;

              return (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                    </div>
                    <Database className="ml-4 h-8 w-8 flex-shrink-0 text-blue-600" />
                  </div>

                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>{t('dataset.records')}:</span>
                      <span className="font-semibold text-gray-900">{dataset.records.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>{t('dataset.updated')}:</span>
                      <span className="font-semibold text-gray-900">{dataset.updated}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>{t('dataset.license')}:</span>
                      <span className="font-semibold text-green-600">{dataset.license}</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {dataset.formats.map((format) => (
                      <span key={format} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {format}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 font-semibold text-white transition-all hover:shadow-lg">
                      <span className="flex items-center justify-center gap-2">
                        <Download size={16} />
                        {t('actions.downloadCSV')}
                      </span>
                    </button>
                    <button className="flex-1 rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white transition-all hover:bg-gray-700">
                      <span className="flex items-center justify-center gap-2">
                        <FileJson size={16} />
                        {t('actions.downloadJSON')}
                      </span>
                    </button>
                  </div>

                  {dataset.datagovlk && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <a
                        href="https://data.gov.lk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-800"
                      >
                        <ExternalLink size={12} />
                        {t('links.dataGovLk')}
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-7xl px-4 pb-12">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center text-white">
            <BookOpen className="mx-auto mb-6 h-16 w-16 opacity-90" />
            <h2 className="mb-4 text-3xl font-bold">{t('cta.title')}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{t('cta.description')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="rounded-xl bg-white px-8 py-4 font-bold text-blue-600 transition-all hover:shadow-2xl">
                {t('actions.apiDocs')}
              </button>
              <button className="rounded-xl border-2 border-white bg-white/20 px-8 py-4 font-semibold text-white transition-all hover:bg-white/30">
                {t('actions.openDataPolicy')}
              </button>
            </div>
            <p className="mt-6 text-sm text-white/80">{t('actions.contact')}</p>
          </div>
        </div>
      </div>
    </MultilingualContent>
  );
};

export default OpenDataPortal;
