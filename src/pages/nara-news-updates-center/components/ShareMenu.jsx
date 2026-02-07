import React, { useCallback, useMemo, useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Link as LinkIcon,
  MessageCircle,
  Copy
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildArticleSharePayload, downloadArticlePdf } from '../../../utils/share';

const SHARE_OPTIONS = [
  { key: 'facebook', icon: Facebook, color: '#1877F2' },
  { key: 'twitter', icon: Twitter, color: '#1DA1F2' },
  { key: 'linkedin', icon: Linkedin, color: '#0A66C2' },
  { key: 'whatsapp', icon: MessageCircle, color: '#25D366' },
  { key: 'email', icon: Mail, color: '#6366F1' },
  { key: 'copy', icon: Copy, color: '#0EA5E9' }
];

const ShareMenu = ({
  article,
  showLabel = false,
  showLink = false,
  className = '',
  size = 'md',
  orientation = 'row'
}) => {
  const { t, i18n } = useTranslation('news');
  const [copied, setCopied] = useState(false);
  const sharePayload = useMemo(() => buildArticleSharePayload(article, i18n.language), [article, i18n.language]);
  const canUseNavigator = typeof navigator !== 'undefined';

  const handleShare = useCallback(
    (platform) => {
      setCopied(false);
      if (!sharePayload?.url) return;

      if (platform === 'copy') {
        if (canUseNavigator && navigator.clipboard?.writeText) {
          navigator.clipboard
            .writeText(sharePayload.url)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              setCopied(false);
            });
        }
        return;
      }

      if (platform === 'email') {
        const mailto = `mailto:?subject=${encodeURIComponent(sharePayload.title)}&body=${encodeURIComponent(
          `${sharePayload.summary}\n\n${sharePayload.url}`
        )}`;
        window.open(mailto, '_blank', 'noopener');
        return;
      }

      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${sharePayload.title}\n${sharePayload.url}`
        )}`;
        window.open(whatsappUrl, '_blank', 'noopener');
        return;
      }

      const encodedUrl = encodeURIComponent(sharePayload.url);
      const encodedTitle = encodeURIComponent(sharePayload.title);
      const encodedSummary = encodeURIComponent(sharePayload.summary ?? '');

      const urlMap = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`
      };

      const shareUrl = urlMap[platform];
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener');
      }
    },
    [canUseNavigator, sharePayload]
  );

  const handlePdfDownload = useCallback(async () => {
    try {
      await downloadArticlePdf(article, { language: i18n.language, t });
    } catch (error) {
      console.error('Failed to download article PDF', error);
    }
  }, [article, i18n.language, t]);

  const buttonClasses = useMemo(() => {
    const base =
      'group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border text-slate-500 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 hover:-translate-y-0.5';
    const sizes = {
      sm: 'h-9 w-9 text-base',
      md: 'h-11 w-11 text-lg',
      lg: 'h-12 w-12 text-xl'
    };
    return `${base} ${sizes[size] || sizes.md}`;
  }, [size]);

  const iconSize = useMemo(() => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 22;
    return 18;
  }, [size]);

  const containerClasses = useMemo(() => {
    const base = 'flex items-center gap-2';
    const orient = orientation === 'column' ? 'flex-col items-start gap-3' : 'flex-row flex-wrap';
    return `${base} ${orient} ${className}`;
  }, [className, orientation]);

  return (
    <div className={containerClasses} data-share-menu-root>
      {showLabel && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Share2 className="h-3.5 w-3.5" />
          {t('share.title')}
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {SHARE_OPTIONS.map(({ key, icon: Icon, color }) => {
          const softBorder = `${color}33`;
          const softGlow = `${color}22`;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleShare(key)}
              className={buttonClasses}
              style={{
                borderColor: softBorder,
                background: `linear-gradient(135deg, ${color}14, ${color}08)`,
                boxShadow: `0 10px 18px ${softGlow}`
              }}
              aria-label={t(`share.${key}`)}
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                aria-hidden="true"
              />
              <Icon
                size={iconSize}
                className="relative z-10 transition-colors duration-300 group-hover:text-white"
                style={{ color }}
              />
            </button>
          );
        })}
        <button
          type="button"
          onClick={handlePdfDownload}
          className={buttonClasses}
          style={{
            borderColor: '#1D4ED855',
            background: 'linear-gradient(135deg, #1D4ED814, #1D4ED808)',
            boxShadow: '0 10px 18px #1D4ED822'
          }}
          aria-label={t('share.pdf')}
        >
          <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" />
          <Download
            size={iconSize}
            className="relative z-10 text-blue-600 transition-colors duration-300 group-hover:text-white"
          />
        </button>
      </div>
      {showLink && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <LinkIcon className="h-3 w-3 text-blue-500" />
          <span className="truncate max-w-[160px] md:max-w-[220px]">{sharePayload.url}</span>
          {copied && <span className="text-blue-600 font-medium">{t('share.copied')}</span>}
        </div>
      )}
      {!showLink && copied && (
        <span className="text-[11px] font-medium text-blue-600">{t('share.copied')}</span>
      )}
    </div>
  );
};

export default ShareMenu;
