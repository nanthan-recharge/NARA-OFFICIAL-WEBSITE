import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import {
  pressReleasesService,
  mediaAssetsService,
  storiesService,
  mediaContactsService,
  mediaPressDashboardService
} from '../../services/mediaPressService';
import mediaPressFallbackData from '../../data/mediaPressFallbackData.json';

const ASSET_TYPES = ['all', 'image', 'video', 'document', 'logo'];
const ASSET_SORT_OPTIONS = ['latest', 'oldest', 'downloads'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const makeFriendlyError = (error) => {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'Unexpected error';
};

const getSafeText = (value, fallback = 'Not available') => {
  if (typeof value === 'string' && value.trim()) return value;
  return fallback;
};

const parseDateValue = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value?.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const sanitizeFilename = (value = 'download') => (
  value
    .toString()
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'download'
);

const copyText = async (value) => {
  if (!value) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }

  return false;
};

const buildCitationText = ({ item, type, currentUrl }) => {
  const title = getSafeText(item?.title, type === 'story' ? 'Story' : 'Press Release');
  const source = getSafeText(item?.source, 'NARA');
  const publishedDate = parseDateValue(item?.publishDate)?.toISOString().slice(0, 10) || 'n.d.';
  const url = currentUrl || '';
  return `${source}. (${publishedDate}). ${title}. ${url}`.trim();
};

const buildDashboardSnapshot = ({ releases, assets, stories, contacts }) => ({
  overview: {
    totalReleases: releases.length,
    totalAssets: assets.length,
    totalStories: stories.length,
    totalContacts: contacts.length
  },
  recentReleases: releases.slice(0, 5),
  recentAssets: assets.slice(0, 10),
  featuredStories: stories.filter((item) => item.featured).slice(0, 5),
  assetsByType: assets.reduce((acc, asset) => {
    const key = asset.assetType || 'document';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}),
  contacts
});

const createExcerpt = (text, length = 280) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}...`;
};

const parseLooseDateToISO = (value, fallbackISO) => {
  if (!value || /not specified/i.test(String(value))) {
    return fallbackISO;
  }

  const normalized = String(value)
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1')
    .replace(/\s+to\s+/gi, ' ')
    .trim();

  const directDate = new Date(normalized);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  const monthMatch = normalized.match(new RegExp(`\\b(${MONTH_NAMES.join('|')})\\b`, 'i'));
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/);

  if (monthMatch && yearMatch) {
    const monthDate = new Date(`${monthMatch[1]} 1, ${yearMatch[0]}`);
    if (!Number.isNaN(monthDate.getTime())) {
      return monthDate.toISOString();
    }
  }

  if (yearMatch) {
    const yearDate = new Date(`${yearMatch[0]}-01-01T00:00:00.000Z`);
    if (!Number.isNaN(yearDate.getTime())) {
      return yearDate.toISOString();
    }
  }

  return fallbackISO;
};

const createFallbackMediaDataset = (rawData) => {
  const metadata = rawData?.metadata || {};
  const source = metadata.source || 'National Aquatic Resources Research and Development Agency (NARA)';
  const sourceUrl = metadata.source_url || 'http://www.nara.ac.lk/?page_id=20299';
  const scrapedDate = metadata.scraped_date || '2026-02-06';
  const fallbackISO = `${scrapedDate}T00:00:00.000Z`;
  const articles = Array.isArray(rawData?.articles) ? rawData.articles : [];

  const releases = articles.map((article) => {
    const publishDate = parseLooseDateToISO(article.date, fallbackISO);
    return {
      id: `fallback-release-${article.id}`,
      title: article.title,
      category: article.category || 'News',
      summary: createExcerpt(article.content, 280),
      content: article.content,
      publishDate,
      publishDateLabel: article.date || '',
      pdfUrl: '',
      source,
      sourceUrl,
      attachments: [],
      viewCount: 0,
      downloadCount: 0,
      createdAt: fallbackISO,
      updatedAt: fallbackISO
    };
  });

  const stories = articles.map((article, index) => {
    const publishDate = parseLooseDateToISO(article.date, fallbackISO);
    return {
      id: `fallback-story-${article.id}`,
      title: article.title,
      excerpt: createExcerpt(article.content, 220),
      content: article.content,
      storyType: article.category || 'News Story',
      publishDate,
      publishDateLabel: article.date || '',
      featured: index < 6,
      imageUrl: '',
      source,
      sourceUrl,
      createdAt: fallbackISO,
      updatedAt: fallbackISO
    };
  });

  const assets = articles.map((article) => {
    const uploadDate = parseLooseDateToISO(article.date, fallbackISO);
    return {
      id: `fallback-asset-${article.id}`,
      title: article.title,
      description: createExcerpt(article.content, 200),
      assetType: 'document',
      category: article.category || 'Press Resource',
      fileUrl: sourceUrl,
      thumbnailUrl: '',
      resolution: '',
      uploadDate,
      approved: true,
      downloadCount: 0,
      createdAt: fallbackISO,
      updatedAt: fallbackISO
    };
  });

  const contacts = [
    {
      id: 'fallback-contact-1',
      name: 'NARA Media Communications Unit',
      position: 'Official Media Desk',
      email: 'media@nara.ac.lk',
      phone: '+94 11 252 1001',
      department: 'Corporate Communications',
      createdAt: fallbackISO,
      updatedAt: fallbackISO
    },
    {
      id: 'fallback-contact-2',
      name: 'NARA Public Relations Office',
      position: 'Press Liaison',
      email: 'info@nara.ac.lk',
      phone: '+94 11 252 1002',
      department: 'Public Affairs',
      createdAt: fallbackISO,
      updatedAt: fallbackISO
    }
  ];

  return {
    metadata,
    releases,
    stories,
    assets,
    contacts
  };
};

const MediaPressKit = () => {
  const { t, i18n } = useTranslation(['common', 'media']);
  const currentLang = i18n.language || 'en';

  const [activeView, setActiveView] = useState('home');
  const [dashboardData, setDashboardData] = useState(null);
  const [releases, setReleases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [stories, setStories] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionStatus, setActionStatus] = useState(null);
  const [fallbackInfo, setFallbackInfo] = useState(null);

  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [assetSortBy, setAssetSortBy] = useState('latest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  const statusTimerRef = useRef(null);
  const fallbackDataset = useMemo(() => createFallbackMediaDataset(mediaPressFallbackData), []);

  const formatMediaDate = useCallback((value) => {
    const parsed = parseDateValue(value);
    if (!parsed) {
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
      return t('common:notAvailable', { defaultValue: 'Not available' });
    }
    return parsed.toLocaleDateString(currentLang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [currentLang, t]);

  const showStatus = useCallback((type, message) => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    setActionStatus({ type, message });
    statusTimerRef.current = setTimeout(() => {
      setActionStatus(null);
      statusTimerRef.current = null;
    }, 4200);
  }, []);

  useEffect(() => () => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    try {
      const [dashResult, releasesResult, assetsResult, storiesResult, contactsResult] = await Promise.all([
        mediaPressDashboardService.getStatistics(),
        pressReleasesService.getAll({ limit: 50 }),
        mediaAssetsService.getAll({ limit: 100 }),
        storiesService.getAll({ limit: 30 }),
        mediaContactsService.getAll()
      ]);

      const safeReleases = releasesResult?.data || [];
      const safeAssets = assetsResult?.data || [];
      const safeStories = storiesResult?.data || [];
      const safeContacts = contactsResult?.data || [];

      const hasLiveData = safeReleases.length > 0 || safeAssets.length > 0 || safeStories.length > 0 || safeContacts.length > 0;
      const finalReleases = safeReleases.length ? safeReleases : fallbackDataset.releases;
      const finalAssets = safeAssets.length ? safeAssets : fallbackDataset.assets;
      const finalStories = safeStories.length ? safeStories : fallbackDataset.stories;
      const finalContacts = safeContacts.length ? safeContacts : fallbackDataset.contacts;

      setReleases(finalReleases);
      setAssets(finalAssets);
      setStories(finalStories);
      setContacts(finalContacts);

      if (hasLiveData && dashResult?.data) {
        const mergedDashboard = {
          ...dashResult.data,
          overview: {
            totalReleases: finalReleases.length,
            totalAssets: finalAssets.length,
            totalStories: finalStories.length,
            totalContacts: finalContacts.length
          },
          recentReleases: finalReleases.slice(0, 5),
          recentAssets: finalAssets.slice(0, 10),
          featuredStories: finalStories.filter((item) => item.featured).slice(0, 5),
          assetsByType: finalAssets.reduce((acc, asset) => {
            const key = asset.assetType || 'document';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {}),
          contacts: finalContacts
        };
        setDashboardData(mergedDashboard);
      } else {
        setDashboardData(buildDashboardSnapshot({
          releases: finalReleases,
          assets: finalAssets,
          stories: finalStories,
          contacts: finalContacts
        }));
      }

      if (!hasLiveData) {
        setFallbackInfo(fallbackDataset.metadata || null);
        showStatus(
          'warning',
          t('media:status.usingFallbackData', { defaultValue: 'Showing fallback NARA news dataset because live media collections are empty.' })
        );
      } else {
        setFallbackInfo(null);
      }
    } catch (error) {
      const message = makeFriendlyError(error);
      setLoadError('');
      setFallbackInfo(fallbackDataset.metadata || null);
      setReleases(fallbackDataset.releases);
      setAssets(fallbackDataset.assets);
      setStories(fallbackDataset.stories);
      setContacts(fallbackDataset.contacts);
      setDashboardData(buildDashboardSnapshot({
        releases: fallbackDataset.releases,
        assets: fallbackDataset.assets,
        stories: fallbackDataset.stories,
        contacts: fallbackDataset.contacts
      }));
      showStatus('warning', t('media:status.usingFallbackDueError', {
        defaultValue: `Live data unavailable (${message}). Showing fallback NARA news dataset.`
      }));
    } finally {
      setLoading(false);
    }
  }, [fallbackDataset, showStatus, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleShare = useCallback(async (payload = {}) => {
    const shareData = {
      title: payload.title || t('media:hero.title', { defaultValue: 'Media Press Kit' }),
      text: payload.text || t('media:hero.description', { defaultValue: 'Media resources from NARA' }),
      url: payload.url || (typeof window !== 'undefined' ? window.location.href : '')
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        showStatus('success', t('common:shared', { defaultValue: 'Shared successfully' }));
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        showStatus('success', t('common:linkCopied', { defaultValue: 'Link copied to clipboard' }));
        return;
      }

      showStatus('warning', t('common:shareUnavailable', { defaultValue: 'Sharing is not available on this device' }));
    } catch {
      showStatus('error', t('common:shareFailed', { defaultValue: 'Unable to share right now' }));
    }
  }, [showStatus, t]);

  const handlePlatformShare = useCallback((platform) => {
    if (typeof window === 'undefined') return;

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(t('media:hero.title', { defaultValue: 'NARA Media Press Kit' }));
    const platformUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`
    };

    const targetUrl = platformUrls[platform];
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }, [t]);

  const handleDownloadAsset = useCallback(async (asset) => {
    if (!asset?.fileUrl) {
      showStatus('warning', t('common:noFile', { defaultValue: 'No downloadable file available' }));
      return;
    }

    try {
      if (asset.id) {
        await mediaAssetsService.incrementDownload(asset.id);
      }
    } catch {
      // non-blocking metric failure
    }

    if (typeof window !== 'undefined') {
      window.open(asset.fileUrl, '_blank', 'noopener,noreferrer');
    }
  }, [showStatus, t]);

  const handleOpenRelease = useCallback((release) => {
    setModalType('release');
    setModalItem(release);
  }, []);

  const handleOpenStory = useCallback((story) => {
    setModalType('story');
    setModalItem(story);
  }, []);

  const handlePreviewAsset = useCallback((asset) => {
    setModalType('asset');
    setModalItem(asset);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalType(null);
    setModalItem(null);
  }, []);

  const handleDownloadRelease = useCallback(async (release) => {
    if (!release) return;

    if (release.pdfUrl) {
      if (typeof window !== 'undefined') {
        window.open(release.pdfUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    try {
      const doc = new jsPDF();
      const title = getSafeText(release.title, 'Press Release');
      const body = getSafeText(release.content, getSafeText(release.summary, ''));

      doc.setFontSize(18);
      doc.text(title, 14, 20, { maxWidth: 180 });
      doc.setFontSize(10);
      doc.text(`${t('media:sections.pressReleases', { defaultValue: 'Press Releases' })} • ${formatMediaDate(release.publishDateLabel || release.publishDate)}`, 14, 30);
      doc.setFontSize(12);

      const wrapped = doc.splitTextToSize(body, 180);
      doc.text(wrapped, 14, 40);
      doc.save(`${sanitizeFilename(title)}.pdf`);
    } catch {
      showStatus('error', t('common:downloadFailed', { defaultValue: 'Failed to generate PDF' }));
    }
  }, [formatMediaDate, showStatus, t]);

  const handleDownloadAllAssets = useCallback(async (assetList) => {
    if (!Array.isArray(assetList) || assetList.length === 0) {
      showStatus('warning', t('common:noAssets', { defaultValue: 'No assets available to download' }));
      return;
    }

    try {
      const zip = new JSZip();

      const manifest = assetList.map((asset) => ({
        id: asset.id,
        title: getSafeText(asset.title),
        description: getSafeText(asset.description, ''),
        type: asset.assetType || 'document',
        category: asset.category || '',
        fileUrl: asset.fileUrl || '',
        thumbnailUrl: asset.thumbnailUrl || '',
        resolution: asset.resolution || '',
        uploadDate: asset.uploadDate || null
      }));

      const csvHeader = 'id,title,type,category,fileUrl,thumbnailUrl,resolution,uploadDate';
      const csvRows = manifest.map((item) => (
        [
          item.id,
          `"${(item.title || '').replace(/"/g, '""')}"`,
          item.type,
          item.category,
          item.fileUrl,
          item.thumbnailUrl,
          item.resolution,
          item.uploadDate || ''
        ].join(',')
      ));

      zip.file('assets-manifest.json', JSON.stringify(manifest, null, 2));
      zip.file('assets-manifest.csv', [csvHeader, ...csvRows].join('\n'));
      zip.file(
        'README.txt',
        [
          'NARA Media Press Kit Package',
          '',
          `Generated: ${new Date().toISOString()}`,
          `Assets included: ${assetList.length}`,
          '',
          'This package contains metadata and source URLs for approved media assets.'
        ].join('\n')
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `nara_media_kit_${new Date().toISOString().slice(0, 10)}.zip`);
      showStatus('success', t('media:assets.downloadAllSuccess', { defaultValue: 'Media kit package downloaded' }));
    } catch {
      showStatus('error', t('media:assets.downloadAllFailed', { defaultValue: 'Failed to package media assets' }));
    }
  }, [showStatus, t]);

  const handleDownloadMediaKit = useCallback(async () => {
    try {
      const zip = new JSZip();
      const generatedAt = new Date().toISOString();

      const pressReleaseManifest = releases.map((release) => ({
        id: release.id || '',
        title: getSafeText(release.title),
        category: getSafeText(release.category, ''),
        publishDate: parseDateValue(release.publishDate)?.toISOString() || '',
        summary: getSafeText(release.summary || release.content, ''),
        pdfUrl: release.pdfUrl || '',
        source: getSafeText(release.source, '')
      }));

      const mediaAssetManifest = assets.map((asset) => ({
        id: asset.id || '',
        title: getSafeText(asset.title),
        type: asset.assetType || '',
        category: getSafeText(asset.category, ''),
        fileUrl: asset.fileUrl || '',
        thumbnailUrl: asset.thumbnailUrl || '',
        resolution: asset.resolution || '',
        uploadDate: parseDateValue(asset.uploadDate)?.toISOString() || '',
        downloadCount: asset.downloadCount || 0
      }));

      const storyManifest = stories.map((story) => ({
        id: story.id || '',
        title: getSafeText(story.title),
        storyType: getSafeText(story.storyType, ''),
        featured: Boolean(story.featured),
        publishDate: parseDateValue(story.publishDate)?.toISOString() || '',
        excerpt: getSafeText(story.excerpt || story.content, '')
      }));

      const contactManifest = contacts.map((contact) => ({
        id: contact.id || '',
        name: getSafeText(contact.name, ''),
        position: getSafeText(contact.position, ''),
        email: getSafeText(contact.email, ''),
        phone: getSafeText(contact.phone, ''),
        department: getSafeText(contact.department, '')
      }));

      zip.file('README.txt', [
        'NARA Media Press Kit Package',
        '',
        `Generated: ${generatedAt}`,
        `Press Releases: ${pressReleaseManifest.length}`,
        `Media Assets: ${mediaAssetManifest.length}`,
        `Stories: ${storyManifest.length}`,
        `Media Contacts: ${contactManifest.length}`,
        '',
        'This package includes structured metadata and source links for media teams and journalists.'
      ].join('\n'));

      zip.file('press-releases.json', JSON.stringify(pressReleaseManifest, null, 2));
      zip.file('media-assets.json', JSON.stringify(mediaAssetManifest, null, 2));
      zip.file('stories.json', JSON.stringify(storyManifest, null, 2));
      zip.file('media-contacts.json', JSON.stringify(contactManifest, null, 2));

      zip.file(
        'contact-sheet.csv',
        [
          'name,position,email,phone,department',
          ...contactManifest.map((contact) => (
            [
              `"${(contact.name || '').replace(/"/g, '""')}"`,
              `"${(contact.position || '').replace(/"/g, '""')}"`,
              `"${(contact.email || '').replace(/"/g, '""')}"`,
              `"${(contact.phone || '').replace(/"/g, '""')}"`,
              `"${(contact.department || '').replace(/"/g, '""')}"`
            ].join(',')
          ))
        ].join('\n')
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `nara_media_press_kit_${generatedAt.slice(0, 10)}.zip`);
      showStatus('success', t('media:quickActions.downloadSuccess', { defaultValue: 'Media kit package downloaded successfully.' }));
    } catch {
      showStatus('error', t('media:quickActions.downloadFailed', { defaultValue: 'Unable to generate media kit package.' }));
    }
  }, [assets, contacts, releases, showStatus, stories, t]);

  const handleSubscribe = useCallback(() => {
    const candidates = [
      ...(contacts || []),
      ...(dashboardData?.contacts || [])
    ];

    const primaryContact = candidates.find((contact) => contact?.email);
    const email = primaryContact?.email || 'media@nara.ac.lk';
    const subject = encodeURIComponent('Subscribe to NARA Media Press Updates');
    const body = encodeURIComponent('Please add me to NARA press/media updates.');

    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  }, [contacts, dashboardData]);

  const handlePressInquiry = useCallback(() => {
    const candidates = [
      ...(contacts || []),
      ...(dashboardData?.contacts || [])
    ];

    const primaryContact = candidates.find((contact) => contact?.email);
    const email = primaryContact?.email || 'media@nara.ac.lk';
    const subject = encodeURIComponent('Press inquiry - NARA Media Press Kit');
    const body = encodeURIComponent('Hello NARA Media Team,\n\nI would like additional information for media coverage.\n\nOrganization:\nDeadline:\nRequested materials:\n\nThank you.');

    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  }, [contacts, dashboardData?.contacts]);

  const handleCopyCitation = useCallback(async (item, type = 'release') => {
    const citation = buildCitationText({
      item,
      type,
      currentUrl: typeof window !== 'undefined' ? window.location.href : ''
    });

    try {
      const copied = await copyText(citation);
      if (copied) {
        showStatus('success', t('media:actions.copyCitationSuccess', { defaultValue: 'Citation copied to clipboard.' }));
        return;
      }

      showStatus('warning', t('media:actions.copyCitationUnavailable', { defaultValue: 'Clipboard access is not available on this device.' }));
    } catch {
      showStatus('error', t('media:actions.copyCitationFailed', { defaultValue: 'Unable to copy citation right now.' }));
    }
  }, [showStatus, t]);

  const handleRSSDownload = useCallback((releaseItems) => {
    try {
      const sorted = [...(releaseItems || [])]
        .sort((a, b) => {
          const dateA = parseDateValue(a.publishDate)?.getTime() || 0;
          const dateB = parseDateValue(b.publishDate)?.getTime() || 0;
          return dateB - dateA;
        })
        .slice(0, 20);

      const channelTitle = getSafeText(t('media:hero.title', { defaultValue: 'NARA Media Press Kit' }), 'NARA Media Press Kit');
      const channelDescription = getSafeText(t('media:hero.description', { defaultValue: 'NARA media releases and stories' }), 'NARA media releases and stories');
      const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.nara.ac.lk/media-press-kit';

      const itemsXml = sorted.map((release) => {
        const title = getSafeText(release.title, 'Press Release');
        const description = getSafeText(release.content || release.summary, '');
        const link = `${pageUrl}#release-${release.id || ''}`;
        const pubDate = parseDateValue(release.publishDate)?.toUTCString() || new Date().toUTCString();

        return `\n    <item>\n      <title><![CDATA[${title}]]></title>\n      <description><![CDATA[${description}]]></description>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pubDate}</pubDate>\n    </item>`;
      }).join('');

      const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n  <channel>\n    <title><![CDATA[${channelTitle}]]></title>\n    <description><![CDATA[${channelDescription}]]></description>\n    <link>${pageUrl}</link>${itemsXml}\n  </channel>\n</rss>`;

      const blob = new Blob([rss], { type: 'application/rss+xml;charset=utf-8' });
      saveAs(blob, 'nara-media-press-kit-rss.xml');
      showStatus('success', t('media:quickActions.rssSuccess', { defaultValue: 'RSS feed downloaded successfully.' }));
    } catch {
      showStatus('error', t('media:quickActions.rssFailed', { defaultValue: 'Unable to generate RSS feed.' }));
    }
  }, [showStatus, t]);

  const navTabs = useMemo(() => [
    { id: 'home', label: t('media:tabs.home', { defaultValue: 'Home' }), icon: Icons.Home },
    { id: 'releases', label: t('media:tabs.releases', { defaultValue: 'Press Releases' }), icon: Icons.FileText },
    { id: 'assets', label: t('media:tabs.assets', { defaultValue: 'Media Assets' }), icon: Icons.Image },
    { id: 'stories', label: t('media:tabs.stories', { defaultValue: 'Stories' }), icon: Icons.BookOpen },
    { id: 'contacts', label: t('media:tabs.contacts', { defaultValue: 'Media Contacts' }), icon: Icons.Phone }
  ], [t]);

  const releaseList = useMemo(() => (
    dashboardData?.recentReleases || releases.slice(0, 5)
  ), [dashboardData?.recentReleases, releases]);

  const featuredStoryList = useMemo(() => (
    dashboardData?.featuredStories || stories.filter((item) => item.featured).slice(0, 5)
  ), [dashboardData?.featuredStories, stories]);

  const assetsByType = useMemo(() => {
    if (dashboardData?.assetsByType) {
      return dashboardData.assetsByType;
    }

    return assets.reduce((acc, asset) => {
      const key = asset.assetType || 'document';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [dashboardData?.assetsByType, assets]);

  const filteredAssets = useMemo(() => {
    const loweredSearch = assetSearchTerm.trim().toLowerCase();

    const filtered = assets.filter((asset) => {
      const matchesType = selectedAssetType === 'all' || asset.assetType === selectedAssetType;
      if (!matchesType) return false;

      if (!loweredSearch) return true;

      return [asset.title, asset.description, asset.category, asset.assetType]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(loweredSearch));
    });

    return filtered.sort((a, b) => {
      if (assetSortBy === 'downloads') {
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      }

      const timeA = parseDateValue(a.uploadDate)?.getTime() || 0;
      const timeB = parseDateValue(b.uploadDate)?.getTime() || 0;

      if (assetSortBy === 'oldest') {
        return timeA - timeB;
      }

      return timeB - timeA;
    });
  }, [assets, assetSearchTerm, assetSortBy, selectedAssetType]);

  const activeContactCount = useMemo(() => (
    contacts.length || dashboardData?.overview?.totalContacts || 0
  ), [contacts.length, dashboardData?.overview?.totalContacts]);

  const lastUpdatedLabel = useMemo(() => {
    const timestamps = [
      ...releases.map((release) => parseDateValue(release.publishDate) || parseDateValue(release.updatedAt) || parseDateValue(release.createdAt)),
      ...assets.map((asset) => parseDateValue(asset.uploadDate) || parseDateValue(asset.updatedAt) || parseDateValue(asset.createdAt)),
      ...stories.map((story) => parseDateValue(story.publishDate) || parseDateValue(story.updatedAt) || parseDateValue(story.createdAt)),
      ...contacts.map((contact) => parseDateValue(contact.updatedAt) || parseDateValue(contact.createdAt))
    ].filter(Boolean);

    if (!timestamps.length) {
      return t('media:toolbar.lastUpdatedFallback', { defaultValue: 'Last updated: unavailable' });
    }

    const latest = timestamps.sort((a, b) => b.getTime() - a.getTime())[0];
    return t('media:toolbar.lastUpdatedLive', {
      defaultValue: 'Last updated from live data: {{value}}',
      value: latest.toLocaleString(currentLang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }, [assets, contacts, currentLang, releases, stories, t]);

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-pink-900 text-xl">{t('common:loading', { defaultValue: 'Loading...' })}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-blue-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(16)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ x: `${(index * 17) % 100}%`, y: `${(index * 29) % 100}%` }}
              animate={{
                x: [`${(index * 17) % 100}%`, `${(index * 17 + 14) % 100}%`],
                y: [`${(index * 29) % 100}%`, `${(index * 29 + 9) % 100}%`]
              }}
              transition={{ duration: 14 + index, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Icons.Camera className="w-7 h-7" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icons.Newspaper className="w-16 h-16" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" lang={currentLang}>
              {t('media:hero.title', { defaultValue: 'Media Press Kit' })}
            </h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed" lang={currentLang}>
              {t('media:hero.description', { defaultValue: 'Access press releases, high-resolution media assets, and story content for accurate reporting on NARA initiatives.' })}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button
                onClick={handleDownloadMediaKit}
                className="px-8 py-4 bg-white text-pink-900 font-bold rounded-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
              >
                <Icons.Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('media:quickActions.download', { defaultValue: 'Download Full Media Kit' })}
              </button>
              <button
                onClick={handleSubscribe}
                className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all flex items-center gap-3"
              >
                <Icons.Bell className="w-5 h-5" />
                {t('media:quickActions.subscribe', { defaultValue: 'Subscribe to Updates' })}
              </button>
              <button
                onClick={() => handleRSSDownload(releases)}
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <Icons.Rss className="w-5 h-5" />
                {t('media:quickActions.rss', { defaultValue: 'RSS Feed' })}
              </button>
            </div>

            {dashboardData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData?.overview?.totalReleases || 0}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.pressReleases', { defaultValue: 'Press Releases' })}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData?.overview?.totalAssets || 0}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.mediaAssets', { defaultValue: 'Media Assets' })}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData?.overview?.totalStories || 0}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.stories', { defaultValue: 'Stories' })}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-3xl font-bold mb-2">{dashboardData?.overview?.totalContacts || 0}</div>
                  <div className="text-sm text-pink-200">{t('media:stats.mediaContacts', { defaultValue: 'Media Contacts' })}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Feedback Banners */}
      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-3">
        {loadError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">{t('media:status.loadErrorTitle', { defaultValue: 'Unable to load latest data' })}</p>
              <p className="text-sm mt-1">{loadError}</p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              {t('media:status.retry', { defaultValue: 'Retry' })}
            </button>
          </div>
        )}

        {actionStatus && (
          <div className={`rounded-xl border p-4 text-sm font-medium ${actionStatus.type === 'error'
            ? 'border-red-200 bg-red-50 text-red-800'
            : actionStatus.type === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}>
            {actionStatus.message}
          </div>
        )}

        {fallbackInfo && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
            <p className="font-semibold">
              {t('media:status.fallbackDatasetTitle', { defaultValue: 'Displaying fallback NARA news dataset' })}
            </p>
            <p className="text-sm mt-1">
              {t('media:status.fallbackDatasetDescription', {
                defaultValue: '{{source}} • {{count}} articles • scraped {{date}} {{time}}',
                source: fallbackInfo.source || 'NARA',
                count: fallbackInfo.total_articles || 0,
                date: fallbackInfo.scraped_date || '',
                time: fallbackInfo.scraped_time || ''
              })}
            </p>
            {fallbackInfo.source_url && (
              <a
                href={fallbackInfo.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                {t('media:status.viewSource', { defaultValue: 'View source page' })}
                <Icons.ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Professional Toolbar */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Icons.Calendar className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600">{lastUpdatedLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icons.Users className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600">
                  {t('media:toolbar.activeContactsLive', {
                    defaultValue: '{{count}} active media contacts',
                    count: activeContactCount
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePlatformShare('twitter')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('media:toolbar.shareTwitter', { defaultValue: 'Share on Twitter' })}
              >
                <Icons.Twitter className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handlePlatformShare('facebook')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('media:toolbar.shareFacebook', { defaultValue: 'Share on Facebook' })}
              >
                <Icons.Facebook className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handlePlatformShare('linkedin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('media:toolbar.shareLinkedIn', { defaultValue: 'Share on LinkedIn' })}
              >
                <Icons.Linkedin className="w-5 h-5 text-gray-600" />
              </button>
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <a
                href="/admin/media-press-kit"
                className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Icons.Settings className="w-4 h-4" />
                {t('media:toolbar.adminPanel', { defaultValue: 'Admin Panel' })}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeView === tab.id
                  ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900" lang={currentLang}>
                    {t('media:sections.latestReleases', { defaultValue: 'Latest Press Releases' })}
                  </h2>
                  <button onClick={() => setActiveView('releases')} className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2">
                    {t('common:viewAll', { defaultValue: 'View All' })} <Icons.ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {releaseList.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {releaseList.map((release) => (
                      <motion.div
                        key={release.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-l-4 border-pink-500"
                      >
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 border-b border-gray-100">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-pink-600 rounded-xl shadow-lg">
                                <Icons.FileText className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                                    {getSafeText(release.category, t('media:tabs.releases', { defaultValue: 'Release' }))}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 flex items-center gap-2">
                                  <Icons.Clock className="w-3 h-3" />
                                  {formatMediaDate(release.publishDateLabel || release.publishDate)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleShare({
                                title: release.title,
                                text: getSafeText(release.content, ''),
                                url: typeof window !== 'undefined' ? `${window.location.href}#release-${release.id}` : ''
                              })}
                              className="p-2 hover:bg-white rounded-lg transition-colors"
                              title={t('common:share', { defaultValue: 'Share' })}
                            >
                              <Icons.Share2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors leading-tight">
                            {getSafeText(release.title, t('media:tabs.releases', { defaultValue: 'Press Release' }))}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {getSafeText(release.content || release.summary, t('common:noItems', { defaultValue: 'No content available' }))}
                          </p>

                          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => handleOpenRelease(release)}
                              className="flex-1 px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                            >
                              {t('common:readMore', { defaultValue: 'Read Full Release' })} <Icons.ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadRelease(release)}
                              className="px-4 py-2 border-2 border-pink-600 text-pink-600 font-medium rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-2"
                            >
                              <Icons.Download className="w-4 h-4" />
                              {t('common:downloadPDF', { defaultValue: 'Download PDF' })}
                            </button>
                            <button
                              onClick={() => handleCopyCitation(release, 'release')}
                              className="px-4 py-2 border-2 border-purple-600 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                            >
                              <Icons.Copy className="w-4 h-4" />
                              {t('media:actions.copySource', { defaultValue: 'Copy Source' })}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                    <Icons.FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>{t('media:status.noReleases', { defaultValue: 'No press releases available yet.' })}</p>
                  </div>
                )}
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                  {t('media:sections.featuredStories', { defaultValue: 'Featured Stories' })}
                </h2>
                {featuredStoryList.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredStoryList.map((story) => (
                      <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                        {story.imageUrl && (
                          <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
                            <img src={story.imageUrl} alt={getSafeText(story.title, 'Story')} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {getSafeText(story.storyType, t('media:tabs.stories', { defaultValue: 'Story' }))}
                            </span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{t('common:featured', { defaultValue: 'Featured' })}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{getSafeText(story.title, 'Story')}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{getSafeText(story.excerpt, '')}</p>
                          <button
                            onClick={() => handleOpenStory(story)}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            {t('common:readStory', { defaultValue: 'Read Story' })}
                          </button>
                          <button
                            onClick={() => handleCopyCitation(story, 'story')}
                            className="ml-3 text-slate-600 hover:text-slate-800 font-medium text-sm"
                          >
                            {t('media:actions.copySource', { defaultValue: 'Copy Source' })}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                    <Icons.BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>{t('media:status.noStories', { defaultValue: 'No stories published yet.' })}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                  {t('media:sections.quickDownloads', { defaultValue: 'Quick Downloads' })}
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {Object.entries(assetsByType).map(([type, count]) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedAssetType(type);
                        setActiveView('assets');
                      }}
                      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-center group"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        {type === 'image' && <Icons.Image className="w-8 h-8 text-pink-600" />}
                        {type === 'video' && <Icons.Video className="w-8 h-8 text-purple-600" />}
                        {type === 'document' && <Icons.FileText className="w-8 h-8 text-blue-600" />}
                        {type === 'logo' && <Icons.Award className="w-8 h-8 text-emerald-600" />}
                      </div>
                      <div className="font-bold text-gray-900 capitalize">{t(`media:assets.${type}${type === 'all' ? '' : 's'}`, { defaultValue: type })}</div>
                      <div className="text-sm text-gray-500 mt-1">{count} {t('common:files', { defaultValue: 'files' })}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'releases' && (
            <motion.div key="releases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                {t('media:sections.pressReleases', { defaultValue: 'Press Releases' })}
              </h2>
              {releases.length > 0 ? (
                <div className="space-y-6">
                  {releases.map((release) => (
                    <div key={release.id} id={`release-${release.id}`} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-pink-100 rounded-xl">
                          <Icons.FileText className="w-8 h-8 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                              {getSafeText(release.category, t('media:tabs.releases', { defaultValue: 'Release' }))}
                            </span>
                            <span className="text-sm text-gray-500">{formatMediaDate(release.publishDateLabel || release.publishDate)}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">{getSafeText(release.title, 'Press Release')}</h3>
                          <p className="text-gray-600 mb-4 whitespace-pre-line">{getSafeText(release.content, '')}</p>
                          {release.attachments && release.attachments.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <Icons.Paperclip className="w-4 h-4" />
                              <span>{release.attachments.length} {t('common:attachments', { defaultValue: 'attachment(s)' })}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 flex-wrap">
                            <button
                              onClick={() => handleDownloadRelease(release)}
                              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                            >
                              {t('common:downloadPDF', { defaultValue: 'Download PDF' })}
                            </button>
                            <button
                              onClick={() => handleShare({
                                title: release.title,
                                text: getSafeText(release.content, ''),
                                url: typeof window !== 'undefined' ? `${window.location.href}#release-${release.id}` : ''
                              })}
                              className="text-pink-600 hover:text-pink-700 font-medium"
                            >
                              {t('common:share', { defaultValue: 'Share' })}
                            </button>
                            <button
                              onClick={() => handleCopyCitation(release, 'release')}
                              className="text-slate-700 hover:text-slate-900 font-medium"
                            >
                              {t('media:actions.copySource', { defaultValue: 'Copy Source' })}
                            </button>
                            <button
                              onClick={() => handleOpenRelease(release)}
                              className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                              {t('common:readMore', { defaultValue: 'Read Full Release' })}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <Icons.FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t('media:status.noReleases', { defaultValue: 'No press releases available yet.' })}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'assets' && (
            <motion.div key="assets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" lang={currentLang}>
                      {t('media:assets.title', { defaultValue: 'Media Assets Library' })}
                    </h2>
                    <p className="text-sm text-gray-600">{t('media:assets.description', { defaultValue: 'High-resolution images, videos, logos, and documents for press use' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDownloadAllAssets(filteredAssets)}
                      className="px-4 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
                    >
                      <Icons.Download className="w-4 h-4" />
                      {t('media:assets.downloadAll', { defaultValue: 'Download All' })}
                    </button>
                    <button
                      onClick={() => setShowAdvancedFilters((prev) => !prev)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Icons.Filter className="w-4 h-4" />
                      {t('media:assets.advancedFilters', { defaultValue: 'Advanced Filters' })}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {ASSET_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedAssetType(type)}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${selectedAssetType === type
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type === 'all'
                        ? t('media:assets.all', { defaultValue: 'All Assets' })
                        : t(`media:assets.${type}${type === 'all' ? '' : 's'}`, { defaultValue: type })}
                    </button>
                  ))}
                </div>

                {showAdvancedFilters && (
                  <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t('common:search', { defaultValue: 'Search' })}
                      </label>
                      <input
                        type="text"
                        value={assetSearchTerm}
                        onChange={(event) => setAssetSearchTerm(event.target.value)}
                        placeholder={t('common:searchPlaceholder', { defaultValue: 'Search assets...' })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {t('common:sort', { defaultValue: 'Sort' })}
                      </label>
                      <select
                        value={assetSortBy}
                        onChange={(event) => setAssetSortBy(event.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        {ASSET_SORT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {t(`media:assets.sort.${option}`, {
                              defaultValue: option === 'latest'
                                ? 'Latest first'
                                : option === 'oldest'
                                  ? 'Oldest first'
                                  : 'Most downloaded'
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-200"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                      {asset.thumbnailUrl ? (
                        <img src={asset.thumbnailUrl} alt={getSafeText(asset.title, 'Asset')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Image className="w-20 h-20 text-pink-400 opacity-50" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePreviewAsset(asset)}
                          className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                          title={t('common:preview', { defaultValue: 'Preview' })}
                        >
                          <Icons.Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadAsset(asset)}
                          className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                          title={t('common:download', { defaultValue: 'Download' })}
                        >
                          <Icons.Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleShare({
                            title: asset.title,
                            text: getSafeText(asset.description, ''),
                            url: asset.fileUrl || asset.thumbnailUrl || (typeof window !== 'undefined' ? window.location.href : '')
                          })}
                          className="p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                          title={t('common:share', { defaultValue: 'Share' })}
                        >
                          <Icons.Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                          {getSafeText(asset.assetType, 'asset')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium capitalize">
                          {getSafeText(asset.assetType, 'asset')}
                        </span>
                        {asset.resolution && <span className="text-xs text-gray-500">{asset.resolution}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{getSafeText(asset.title, 'Untitled asset')}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{getSafeText(asset.description, '')}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                        {asset.resolution && (
                          <div className="flex items-center gap-1">
                            <Icons.Maximize className="w-3 h-3" />
                            {asset.resolution}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Icons.Download className="w-3 h-3" />
                          {asset.downloadCount || 0}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadAsset(asset)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <Icons.Download className="w-4 h-4" />
                        {t('common:download', { defaultValue: 'Download' })}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                  <Icons.Image className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold mb-2">{t('common:noAssets', { defaultValue: 'No assets found' })}</p>
                  <p className="text-sm">{t('common:noAssetsDescription', { defaultValue: 'Try adjusting your filters or check back later.' })}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" lang={currentLang}>
                {t('media:sections.allStories', { defaultValue: 'All Stories' })}
              </h2>
              {stories.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map((story) => (
                    <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                      {story.imageUrl && (
                        <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-600 overflow-hidden">
                          <img src={story.imageUrl} alt={getSafeText(story.title, 'Story')} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {getSafeText(story.storyType, t('media:tabs.stories', { defaultValue: 'Story' }))}
                          </span>
                          {story.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{t('common:featured', { defaultValue: 'Featured' })}</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{getSafeText(story.title, 'Story')}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-4">{getSafeText(story.excerpt, '')}</p>
                        <div className="text-xs text-gray-500 mb-4">{formatMediaDate(story.publishDateLabel || story.publishDate)}</div>
                        <button
                          onClick={() => handleOpenStory(story)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          {t('common:readStory', { defaultValue: 'Read Story' })}
                        </button>
                        <button
                          onClick={() => handleCopyCitation(story, 'story')}
                          className="w-full mt-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                          {t('media:actions.copySource', { defaultValue: 'Copy Source' })}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <Icons.BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t('media:status.noStories', { defaultValue: 'No stories available yet.' })}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'contacts' && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900" lang={currentLang}>
                  {t('media:sections.ourTeam', { defaultValue: 'Our Media Team' })}
                </h2>
                <button
                  onClick={handlePressInquiry}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Icons.Mail className="w-4 h-4" />
                  {t('media:contacts.pressInquiry', { defaultValue: 'Press Inquiry' })}
                </button>
              </div>
              {contacts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {getSafeText(contact.name, 'N').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{getSafeText(contact.name, 'Media Contact')}</h3>
                          <div className="text-sm text-gray-600 mb-3">{getSafeText(contact.position, 'Spokesperson')}</div>
                          <div className="space-y-2">
                            {contact.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icons.Mail className="w-4 h-4 text-pink-600" />
                                <a href={`mailto:${contact.email}`} className="hover:text-pink-600">{contact.email}</a>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icons.Phone className="w-4 h-4 text-pink-600" />
                                <a href={`tel:${contact.phone}`} className="hover:text-pink-600">{contact.phone}</a>
                              </div>
                            )}
                            {contact.department && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Icons.Building className="w-4 h-4 text-pink-600" />
                                {contact.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                  <Icons.Phone className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t('media:status.noContacts', { defaultValue: 'No media contacts available yet.' })}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalType && modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] overflow-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalType === 'release' && t('media:sections.pressReleases', { defaultValue: 'Press Release' })}
                  {modalType === 'story' && t('media:tabs.stories', { defaultValue: 'Story' })}
                  {modalType === 'asset' && t('media:tabs.assets', { defaultValue: 'Asset Preview' })}
                </h3>
                <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100">
                  <Icons.X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {(modalType === 'release' || modalType === 'story') && (
                  <>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{getSafeText(modalItem.title, 'Untitled')}</h4>
                      <p className="text-sm text-gray-500">{formatMediaDate(modalItem.publishDateLabel || modalItem.publishDate)}</p>
                    </div>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                      {getSafeText(modalItem.content || modalItem.excerpt, t('common:noItems', { defaultValue: 'No content available.' }))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {modalType === 'release' && (
                        <button
                          onClick={() => handleDownloadRelease(modalItem)}
                          className="px-4 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700"
                        >
                          {t('common:downloadPDF', { defaultValue: 'Download PDF' })}
                        </button>
                      )}
                      <button
                        onClick={() => handleShare({
                          title: modalItem.title,
                          text: getSafeText(modalItem.content || modalItem.excerpt, ''),
                          url: typeof window !== 'undefined' ? window.location.href : ''
                        })}
                        className="px-4 py-2 rounded-lg border border-pink-200 text-pink-700 font-semibold hover:bg-pink-50"
                      >
                        {t('common:share', { defaultValue: 'Share' })}
                      </button>
                      <button
                        onClick={() => handleCopyCitation(modalItem, modalType === 'story' ? 'story' : 'release')}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        {t('media:actions.copySource', { defaultValue: 'Copy Source' })}
                      </button>
                    </div>
                  </>
                )}

                {modalType === 'asset' && (
                  <>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{getSafeText(modalItem.title, 'Asset')}</h4>
                      <p className="text-sm text-gray-600">{getSafeText(modalItem.description, '')}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                      {modalItem.assetType === 'video' && modalItem.fileUrl ? (
                        <video src={modalItem.fileUrl} controls className="w-full max-h-[420px]" />
                      ) : modalItem.thumbnailUrl || modalItem.fileUrl ? (
                        <img
                          src={modalItem.thumbnailUrl || modalItem.fileUrl}
                          alt={getSafeText(modalItem.title, 'Asset preview')}
                          className="w-full max-h-[420px] object-contain bg-black"
                        />
                      ) : (
                        <div className="h-56 flex items-center justify-center text-gray-500">
                          {t('common:noPreview', { defaultValue: 'Preview not available' })}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleDownloadAsset(modalItem)}
                        className="px-4 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700"
                      >
                        {t('common:download', { defaultValue: 'Download' })}
                      </button>
                      <button
                        onClick={() => handleShare({
                          title: modalItem.title,
                          text: getSafeText(modalItem.description, ''),
                          url: modalItem.fileUrl || modalItem.thumbnailUrl || (typeof window !== 'undefined' ? window.location.href : '')
                        })}
                        className="px-4 py-2 rounded-lg border border-pink-200 text-pink-700 font-semibold hover:bg-pink-50"
                      >
                        {t('common:share', { defaultValue: 'Share' })}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPressKit;
