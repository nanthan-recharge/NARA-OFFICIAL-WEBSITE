import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackPDFDownload } from '../utils/pdfDownloadTracker';

/**
 * PDFDownloadCard Component
 * Beautiful card for displaying and downloading division PDF resources
 */
const PDFDownloadCard = ({ division }) => {
  const { t, i18n } = useTranslation('divisions');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const currentLang = i18n.language;

  if (!division.pdfResource) return null;

  const { filename, path, pages, sizeKB, description } = division.pdfResource;

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = path;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download with analytics
      await trackPDFDownload(
        division.id,
        division.name[currentLang] || division.name.en,
        filename,
        currentLang
      );

      // Show success feedback
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadComplete(true);
        setTimeout(() => setDownloadComplete(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const handlePreview = () => {
    window.open(path, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${division.gradient} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <LucideIcons.FileText size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t('pdfCard.headerTitle')}</h3>
              <p className="text-sm opacity-90">{t('pdfCard.headerSubtitle')}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
            {t('pdfCard.badge')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          {description[currentLang] || description.en}
        </p>

        {/* File Info */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <LucideIcons.FileType size={20} className="mx-auto text-blue-600 mb-1" />
            <div className="text-xs text-gray-500">{t('pdfCard.fileInfo.formatLabel')}</div>
            <div className="text-sm font-bold text-gray-900">{t('pdfCard.fileInfo.formatValue')}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <LucideIcons.FileStack size={20} className="mx-auto text-green-600 mb-1" />
            <div className="text-xs text-gray-500">{t('pdfCard.fileInfo.pagesLabel')}</div>
            <div className="text-sm font-bold text-gray-900">{pages}</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <LucideIcons.HardDrive size={20} className="mx-auto text-purple-600 mb-1" />
            <div className="text-xs text-gray-500">{t('pdfCard.fileInfo.sizeLabel')}</div>
            <div className="text-sm font-bold text-gray-900">
              {t('card.pdfInfo.size', { size: sizeKB })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 ${
              downloadComplete
                ? 'bg-green-600'
                : `bg-gradient-to-r ${division.gradient}`
            } text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
          >
            {isDownloading ? (
              <>
                <LucideIcons.Loader2 size={20} className="animate-spin" />
                <span>{t('pdfCard.buttons.downloading')}</span>
              </>
            ) : downloadComplete ? (
              <>
                <LucideIcons.CheckCircle size={20} />
                <span>{t('pdfCard.buttons.downloaded')}</span>
              </>
            ) : (
              <>
                <LucideIcons.Download size={20} />
                <span>{t('pdfCard.buttons.download')}</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePreview}
            className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LucideIcons.Eye size={20} />
            <span className="hidden sm:inline">{t('pdfCard.buttons.preview')}</span>
          </motion.button>
        </div>

        {/* File Name */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <LucideIcons.File size={14} />
            <span>{t('pdfCard.fileNameLabel')}:</span>
            <span className="font-mono truncate">{filename}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFDownloadCard;
