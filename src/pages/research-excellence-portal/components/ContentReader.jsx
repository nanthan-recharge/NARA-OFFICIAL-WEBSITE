import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getResearchContentById, incrementDownloads } from '../../../services/researchContentService';
import { createReaderContentFromPublication, findFallbackPublicationById } from '../../../data/researchEnhancedFallback';
import DocumentReader from './DocumentReader';

const getTextByLanguage = (value, language) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[language] || value.en || value.si || value.ta || '';
  }
  return '';
};

const getPublicationYear = (content) => {
  if (!content) return '';
  if (content.year) return content.year;
  if (content.publicationDate) {
    const year = new Date(content.publicationDate).getFullYear();
    if (!Number.isNaN(year)) return year;
  }
  return '';
};

const getReadableDate = (content) => {
  if (!content?.publicationDate) return '';
  const date = new Date(content.publicationDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

const getLanguageAwareFileUrl = (content, language) => {
  if (!content) return '';

  if (typeof content.fileURL === 'string' && content.fileURL) {
    return content.fileURL;
  }

  if (content.fileURL && typeof content.fileURL === 'object') {
    return (
      content.fileURL[language] ||
      content.fileURL.en ||
      content.fileURL.si ||
      content.fileURL.ta ||
      Object.values(content.fileURL).find(Boolean) ||
      ''
    );
  }

  if (content.fileURLs && typeof content.fileURLs === 'object') {
    return (
      content.fileURLs[language] ||
      content.fileURLs.en ||
      content.fileURLs.si ||
      content.fileURLs.ta ||
      Object.values(content.fileURLs).find(Boolean) ||
      ''
    );
  }

  return '';
};

const toAuthorLine = (authors) => {
  if (Array.isArray(authors)) return authors.join(', ');
  if (typeof authors === 'string') return authors;
  return 'NARA Research Team';
};

const ContentReader = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation(['researchPortal']);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('abstract');
  const [viewMode, setViewMode] = useState('standard');

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadContent = async () => {
    const normalizedId = decodeURIComponent(String(id || ''));

    setLoading(true);
    setError(null);

    try {
      const data = await getResearchContentById(normalizedId);
      if (data) {
        setContent({ ...data, source: data.source || 'live' });
        return;
      }

      const fallbackPublication = findFallbackPublicationById(normalizedId);
      if (fallbackPublication) {
        setContent(createReaderContentFromPublication(fallbackPublication));
        return;
      }

      setContent(null);
      setError('Paper not found in database');
    } catch (loadError) {
      const fallbackPublication = findFallbackPublicationById(normalizedId);
      if (fallbackPublication) {
        setContent(createReaderContentFromPublication(fallbackPublication));
        setError(null);
      } else {
        setContent(null);
        setError(loadError.message || 'Failed to load content');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const fileUrl = getLanguageAwareFileUrl(content, i18n.language);
    if (!fileUrl) return;

    if (content?.source !== 'fallback') {
      await incrementDownloads(content.id);
    }

    window.open(fileUrl, '_blank');
  };

  const handleCite = () => {
    if (!content) return;

    const citation = `${toAuthorLine(content.authors)} (${getPublicationYear(content)}). ${getCurrentLangContent(
      content.title
    )}. ${content.journal || ''}, ${content.volume || ''}(${content.issue || ''}), ${content.pages || ''}.${
      content.doi ? ` DOI: ${content.doi}` : ''
    }`;

    navigator.clipboard.writeText(citation);
    alert(t('reader.citationCopied'));
  };

  const getCurrentLangContent = (multilingualField) => getTextByLanguage(multilingualField, i18n.language);

  const currentFileUrl = getLanguageAwareFileUrl(content, i18n.language);
  const authorLine = toAuthorLine(content?.authors);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Icons.FileX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Content Not Found</h2>
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 mb-2">
              <strong>Paper ID:</strong> {id}
            </p>
            {error ? (
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/research-excellence-portal"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('reader.backToPortal')}
            </Link>
            <button
              onClick={loadContent}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'reader') {
    return <DocumentReader content={content} onBack={() => setViewMode('standard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Link
            to="/research-excellence-portal"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('reader.backToPortal')}
          </Link>

          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => setViewMode('reader')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Icons.BookOpen className="w-5 h-5" />
              <span>📱 iPad Reader</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <span className="text-xs font-semibold text-slate-600 uppercase">Language:</span>
              <div className="flex gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-1.5 shadow-md">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'en'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('si')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'si'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇱🇰 සිංහල
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ta')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'ta'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇱🇰 தமிழ்
                </button>
              </div>
            </div>

            {currentFileUrl ? (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icons.Download className="w-5 h-5" />
                {t('reader.downloadPDF')}
              </button>
            ) : null}

            <button
              onClick={handleCite}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Icons.Quote className="w-5 h-5" />
              {t('reader.cite')}
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{getCurrentLangContent(content.title)}</h1>
            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Icons.Users className="w-5 h-5" />
                <span>{authorLine}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Calendar className="w-5 h-5" />
                <span>{getReadableDate(content)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.BookOpen className="w-5 h-5" />
                <span>{content.journal}</span>
              </div>
              {content.doi ? (
                <div className="flex items-center gap-2">
                  <Icons.Link className="w-5 h-5" />
                  <span>DOI: {content.doi}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-slate-200">
            <div className="p-4 text-center border-r border-slate-200">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Eye className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.views || 0}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.views')}</p>
            </div>
            <div className="p-4 text-center border-r border-slate-200">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Download className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.downloads || 0}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.downloads')}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Bookmark className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.bookmarks || 0}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.bookmark')}</p>
            </div>
          </div>

          <div className="border-b border-slate-200">
            <div className="flex gap-1 p-2">
              {['abstract', 'fullText', 'references'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t(`reader.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'abstract' ? (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('reader.abstract')}</h2>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {getCurrentLangContent(content.abstract)}
                </p>

                {content.tags && content.tags.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{t('card.keywords')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, idx) => (
                        <span
                          key={`${content.id}-${idx}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeTab === 'fullText' ? (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('reader.fullText')}</h2>

                {currentFileUrl ? (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.FileText className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">PDF Document Available</h3>
                      <p className="text-slate-600 mb-1">{content.fileName || 'Research Paper'}</p>
                      <p className="text-sm text-slate-500">
                        Click below to view or download the full research paper
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={currentFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Icons.ExternalLink className="w-6 h-6" />
                        <span>Open PDF in New Tab</span>
                      </a>

                      <a
                        href={currentFileUrl}
                        download={content.fileName}
                        className="px-8 py-4 bg-white hover:bg-slate-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition-colors flex items-center justify-center gap-3"
                      >
                        <Icons.Download className="w-6 h-6" />
                        <span>Download PDF</span>
                      </a>
                    </div>

                    <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Icons.Info className="w-4 h-4" />
                        <span>
                          The PDF will open in a new browser tab where you can read, zoom, and download it.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                    <Icons.AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-slate-700">Full text content not available. Please check back later.</p>
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'references' ? (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('reader.references')}</h2>
                <div className="bg-slate-50 rounded-lg p-6">
                  <p className="text-slate-600">
                    {authorLine} ({getPublicationYear(content)}). {getCurrentLangContent(content.title)}. <em>{content.journal}</em>,{' '}
                    {content.volume}({content.issue}), {content.pages}.
                    {content.doi ? ` DOI: ${content.doi}` : ''}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentReader;
