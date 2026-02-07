import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Icons from 'lucide-react';
import {
  mediaAssetsService,
  mediaContactsService,
  mediaPressFileService,
  pressReleasesService,
  storiesService
} from '../../services/mediaPressService';
import mediaPressFallbackData from '../../data/mediaPressFallbackData.json';

const TABS = [
  { id: 'releases', label: 'Press Releases', icon: Icons.FileText },
  { id: 'assets', label: 'Media Assets', icon: Icons.Image },
  { id: 'stories', label: 'Stories', icon: Icons.BookOpen },
  { id: 'contacts', label: 'Contacts', icon: Icons.Phone }
];

const SORT_OPTIONS = {
  releases: [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title', label: 'Title (A-Z)' }
  ],
  assets: [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'downloads', label: 'Most downloaded' }
  ],
  stories: [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'featured', label: 'Featured first' }
  ],
  contacts: [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'department', label: 'Department' }
  ]
};

const DEFAULT_FORMS = {
  releases: {
    title: '',
    category: '',
    summary: '',
    content: '',
    publishDate: '',
    pdfUrl: '',
    pdfPath: '',
    source: '',
    attachmentsText: ''
  },
  assets: {
    title: '',
    description: '',
    assetType: 'image',
    category: '',
    fileUrl: '',
    filePath: '',
    thumbnailUrl: '',
    thumbnailPath: '',
    resolution: '',
    uploadDate: '',
    approved: true
  },
  stories: {
    title: '',
    excerpt: '',
    content: '',
    storyType: '',
    publishDate: '',
    imageUrl: '',
    imagePath: '',
    featured: false
  },
  contacts: {
    name: '',
    position: '',
    email: '',
    phone: '',
    department: ''
  }
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const normalizeKey = (value) => (
  (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
);

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

const createFallbackImportPayloads = (rawData) => {
  const metadata = rawData?.metadata || {};
  const source = metadata.source || 'National Aquatic Resources Research and Development Agency (NARA)';
  const sourceUrl = metadata.source_url || 'http://www.nara.ac.lk/?page_id=20299';
  const fallbackISO = `${metadata.scraped_date || '2026-02-06'}T00:00:00.000Z`;
  const sourceTag = `nara-fallback-import-${metadata.scraped_date || '2026-02-06'}`;
  const articles = Array.isArray(rawData?.articles) ? rawData.articles : [];

  const releases = articles.map((article) => ({
    title: article.title || 'Untitled News',
    category: article.category || 'News',
    summary: createExcerpt(article.content, 280),
    content: article.content || '',
    publishDate: parseLooseDateToISO(article.date, fallbackISO),
    pdfUrl: '',
    pdfPath: '',
    source,
    sourceUrl,
    sourceTag,
    attachments: [],
    importRef: `fallback-article-${article.id}`
  }));

  const stories = articles.map((article, index) => ({
    title: article.title || 'Untitled Story',
    excerpt: createExcerpt(article.content, 220),
    content: article.content || '',
    storyType: article.category || 'News Story',
    publishDate: parseLooseDateToISO(article.date, fallbackISO),
    imageUrl: '',
    imagePath: '',
    featured: index < 6,
    source,
    sourceUrl,
    sourceTag,
    importRef: `fallback-article-${article.id}`
  }));

  const assets = articles.map((article) => ({
    title: article.title || 'Untitled Document',
    description: createExcerpt(article.content, 180),
    assetType: 'document',
    category: article.category || 'Press Resource',
    fileUrl: sourceUrl,
    filePath: '',
    thumbnailUrl: '',
    thumbnailPath: '',
    resolution: '',
    uploadDate: parseLooseDateToISO(article.date, fallbackISO),
    approved: true,
    source,
    sourceUrl,
    sourceTag,
    importRef: `fallback-article-${article.id}`
  }));

  const contacts = [
    {
      name: 'NARA Media Communications Unit',
      position: 'Official Media Desk',
      email: 'media@nara.ac.lk',
      phone: '+94 11 252 1001',
      department: 'Corporate Communications',
      sourceTag
    },
    {
      name: 'NARA Public Relations Office',
      position: 'Press Liaison',
      email: 'info@nara.ac.lk',
      phone: '+94 11 252 1002',
      department: 'Public Affairs',
      sourceTag
    }
  ];

  return { metadata, releases, stories, assets, contacts };
};

const getServiceForTab = (tab) => {
  if (tab === 'releases') return pressReleasesService;
  if (tab === 'assets') return mediaAssetsService;
  if (tab === 'stories') return storiesService;
  return mediaContactsService;
};

const parseDateValue = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value?.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  if (value instanceof Date) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const toInputDate = (value) => {
  const parsed = parseDateValue(value);
  if (!parsed) return '';
  return parsed.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  const parsed = parseDateValue(value);
  if (!parsed) return 'Not set';
  return parsed.toLocaleDateString();
};

const getRecordDate = (tab, item) => {
  if (!item) return null;
  if (tab === 'releases') return parseDateValue(item.publishDate) || parseDateValue(item.updatedAt) || parseDateValue(item.createdAt);
  if (tab === 'assets') return parseDateValue(item.uploadDate) || parseDateValue(item.updatedAt) || parseDateValue(item.createdAt);
  if (tab === 'stories') return parseDateValue(item.publishDate) || parseDateValue(item.updatedAt) || parseDateValue(item.createdAt);
  return parseDateValue(item.updatedAt) || parseDateValue(item.createdAt);
};

const createDefaultForm = (tab) => {
  const base = { ...DEFAULT_FORMS[tab] };
  if (tab === 'releases' || tab === 'assets' || tab === 'stories') {
    base.publishDate = base.publishDate || toInputDate(new Date());
  }
  if (tab === 'assets') {
    base.uploadDate = toInputDate(new Date());
  }
  return base;
};

const createFormFromItem = (tab, item) => {
  if (!item) return createDefaultForm(tab);

  if (tab === 'releases') {
    return {
      title: item.title || '',
      category: item.category || '',
      summary: item.summary || '',
      content: item.content || '',
      publishDate: toInputDate(item.publishDate),
      pdfUrl: item.pdfUrl || '',
      pdfPath: item.pdfPath || '',
      source: item.source || '',
      attachmentsText: Array.isArray(item.attachments) ? item.attachments.join('\n') : ''
    };
  }

  if (tab === 'assets') {
    return {
      title: item.title || '',
      description: item.description || '',
      assetType: item.assetType || 'image',
      category: item.category || '',
      fileUrl: item.fileUrl || '',
      filePath: item.filePath || '',
      thumbnailUrl: item.thumbnailUrl || '',
      thumbnailPath: item.thumbnailPath || '',
      resolution: item.resolution || '',
      uploadDate: toInputDate(item.uploadDate),
      approved: item.approved !== false
    };
  }

  if (tab === 'stories') {
    return {
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      storyType: item.storyType || '',
      publishDate: toInputDate(item.publishDate),
      imageUrl: item.imageUrl || '',
      imagePath: item.imagePath || '',
      featured: Boolean(item.featured)
    };
  }

  return {
    name: item.name || '',
    position: item.position || '',
    email: item.email || '',
    phone: item.phone || '',
    department: item.department || ''
  };
};

const buildPayload = (tab, formData) => {
  if (tab === 'releases') {
    return {
      title: formData.title.trim(),
      category: formData.category.trim(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : new Date().toISOString(),
      pdfUrl: formData.pdfUrl.trim(),
      pdfPath: formData.pdfPath || '',
      source: formData.source.trim(),
      attachments: formData.attachmentsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    };
  }

  if (tab === 'assets') {
    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      assetType: formData.assetType,
      category: formData.category.trim(),
      fileUrl: formData.fileUrl.trim(),
      filePath: formData.filePath || '',
      thumbnailUrl: formData.thumbnailUrl.trim(),
      thumbnailPath: formData.thumbnailPath || '',
      resolution: formData.resolution.trim(),
      uploadDate: formData.uploadDate ? new Date(formData.uploadDate).toISOString() : new Date().toISOString(),
      approved: Boolean(formData.approved)
    };
  }

  if (tab === 'stories') {
    return {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      storyType: formData.storyType.trim(),
      publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : new Date().toISOString(),
      imageUrl: formData.imageUrl.trim(),
      imagePath: formData.imagePath || '',
      featured: Boolean(formData.featured)
    };
  }

  return {
    name: formData.name.trim(),
    position: formData.position.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    department: formData.department.trim()
  };
};

const MediaPressKitAdmin = () => {
  const [activeTab, setActiveTab] = useState('releases');
  const [records, setRecords] = useState({
    releases: [],
    assets: [],
    stories: [],
    contacts: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(createDefaultForm('releases'));
  const [importingFallback, setImportingFallback] = useState(false);

  const showMessage = useCallback((type, message) => {
    if (type === 'error') {
      setErrorMessage(message);
      setSuccessMessage('');
      return;
    }

    setSuccessMessage(message);
    setErrorMessage('');
  }, []);

  useEffect(() => {
    if (!successMessage && !errorMessage) return undefined;

    const timer = setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 4200);

    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  const loadAllData = useCallback(async () => {
    setLoading(true);

    try {
      const [releasesResult, assetsResult, storiesResult, contactsResult] = await Promise.all([
        pressReleasesService.getAll({ limit: 200 }),
        mediaAssetsService.getAll({ limit: 200 }),
        storiesService.getAll({ limit: 200 }),
        mediaContactsService.getAll()
      ]);

      setRecords({
        releases: releasesResult.data || [],
        assets: assetsResult.data || [],
        stories: storiesResult.data || [],
        contacts: contactsResult.data || []
      });
    } catch (error) {
      showMessage('error', `Failed to load media press kit data: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    setSortBy(activeTab === 'contacts' ? 'name' : 'newest');
    setSearchTerm('');
  }, [activeTab]);

  const filteredItems = useMemo(() => {
    const items = records[activeTab] || [];
    const loweredSearch = searchTerm.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (!loweredSearch) return true;

      if (activeTab === 'contacts') {
        return [item.name, item.position, item.department, item.email, item.phone]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(loweredSearch));
      }

      if (activeTab === 'assets') {
        return [item.title, item.description, item.category, item.assetType]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(loweredSearch));
      }

      if (activeTab === 'stories') {
        return [item.title, item.excerpt, item.storyType]
          .filter(Boolean)
          .some((value) => value.toString().toLowerCase().includes(loweredSearch));
      }

      return [item.title, item.summary, item.content, item.category]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(loweredSearch));
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }

      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortBy === 'department') {
        return (a.department || '').localeCompare(b.department || '');
      }

      if (sortBy === 'downloads') {
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      }

      if (sortBy === 'featured') {
        if (Boolean(a.featured) === Boolean(b.featured)) {
          const dateA = getRecordDate(activeTab, a)?.getTime() || 0;
          const dateB = getRecordDate(activeTab, b)?.getTime() || 0;
          return dateB - dateA;
        }

        return a.featured ? -1 : 1;
      }

      const dateA = getRecordDate(activeTab, a)?.getTime() || 0;
      const dateB = getRecordDate(activeTab, b)?.getTime() || 0;

      if (sortBy === 'oldest') {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }, [activeTab, records, searchTerm, sortBy]);

  const openCreateForm = useCallback(() => {
    setEditingItem(null);
    setFormData(createDefaultForm(activeTab));
    setIsFormOpen(true);
  }, [activeTab]);

  const openEditForm = useCallback((item) => {
    setEditingItem(item);
    setFormData(createFormFromItem(activeTab, item));
    setIsFormOpen(true);
  }, [activeTab]);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData(createDefaultForm(activeTab));
    setUploadingField('');
  }, [activeTab]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFileUpload = useCallback(async (field, pathField, file, category) => {
    if (!file) return;

    setUploadingField(field);

    try {
      const uploadResult = await mediaPressFileService.uploadFile(file, category);

      if (uploadResult.error || !uploadResult.data?.url) {
        throw uploadResult.error || new Error('Upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        [field]: uploadResult.data.url,
        [pathField]: uploadResult.data.path
      }));

      showMessage('success', 'File uploaded successfully.');
    } catch (error) {
      showMessage('error', `File upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingField('');
    }
  }, [showMessage]);

  const validateForm = useCallback(() => {
    if (activeTab === 'releases') {
      if (!formData.title.trim()) return 'Title is required.';
      if (!formData.content.trim() && !formData.summary.trim()) return 'Add summary or content for the press release.';
      return '';
    }

    if (activeTab === 'assets') {
      if (!formData.title.trim()) return 'Title is required.';
      if (!formData.fileUrl.trim()) return 'File URL is required. Upload a file or paste a URL.';
      return '';
    }

    if (activeTab === 'stories') {
      if (!formData.title.trim()) return 'Title is required.';
      if (!formData.excerpt.trim() && !formData.content.trim()) return 'Story excerpt or content is required.';
      return '';
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      return 'Name and email are required for media contacts.';
    }

    return '';
  }, [activeTab, formData]);

  const handleSave = useCallback(async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showMessage('error', validationError);
      return;
    }

    setSaving(true);

    try {
      const service = getServiceForTab(activeTab);
      const payload = buildPayload(activeTab, formData);

      if (editingItem?.id) {
        const updateResult = await service.update(editingItem.id, payload);
        if (updateResult.error) {
          throw updateResult.error;
        }

        showMessage('success', 'Item updated successfully.');
      } else {
        const createResult = await service.create(payload);
        if (createResult.error) {
          throw createResult.error;
        }

        showMessage('success', 'Item created successfully.');
      }

      await loadAllData();
      closeForm();
    } catch (error) {
      showMessage('error', `Unable to save this item: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  }, [activeTab, closeForm, editingItem?.id, formData, loadAllData, showMessage, validateForm]);

  const handleDelete = useCallback(async (item) => {
    if (!item?.id) return;

    const confirmed = window.confirm('Delete this item permanently?');
    if (!confirmed) return;

    setSaving(true);

    try {
      const service = getServiceForTab(activeTab);
      const deleteResult = await service.delete(item.id);
      if (deleteResult.error) {
        throw deleteResult.error;
      }

      showMessage('success', 'Item deleted successfully.');
      await loadAllData();
    } catch (error) {
      showMessage('error', `Unable to delete this item: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  }, [activeTab, loadAllData, showMessage]);

  const handleImportFallback = useCallback(async () => {
    const fallbackPayload = createFallbackImportPayloads(mediaPressFallbackData);
    const articleCount = fallbackPayload.releases.length;
    const confirmed = window.confirm(
      `Import ${articleCount} fallback news articles into Firestore as releases, stories, and document assets?\n\nDuplicate titles/emails will be skipped.`
    );

    if (!confirmed) return;

    setImportingFallback(true);
    setSaving(true);

    const existingReleaseTitles = new Set(records.releases.map((item) => normalizeKey(item.title)));
    const existingStoryTitles = new Set(records.stories.map((item) => normalizeKey(item.title)));
    const existingAssetTitles = new Set(records.assets.map((item) => normalizeKey(item.title)));
    const existingContactEmails = new Set(records.contacts.map((item) => normalizeKey(item.email)));

    let createdReleases = 0;
    let createdStories = 0;
    let createdAssets = 0;
    let createdContacts = 0;
    let skipped = 0;
    let errors = 0;

    try {
      for (const release of fallbackPayload.releases) {
        const key = normalizeKey(release.title);
        if (existingReleaseTitles.has(key)) {
          skipped += 1;
          continue;
        }

        const result = await pressReleasesService.create(release);
        if (result.error) {
          errors += 1;
          continue;
        }

        existingReleaseTitles.add(key);
        createdReleases += 1;
      }

      for (const story of fallbackPayload.stories) {
        const key = normalizeKey(story.title);
        if (existingStoryTitles.has(key)) {
          skipped += 1;
          continue;
        }

        const result = await storiesService.create(story);
        if (result.error) {
          errors += 1;
          continue;
        }

        existingStoryTitles.add(key);
        createdStories += 1;
      }

      for (const asset of fallbackPayload.assets) {
        const key = normalizeKey(asset.title);
        if (existingAssetTitles.has(key)) {
          skipped += 1;
          continue;
        }

        const result = await mediaAssetsService.create(asset);
        if (result.error) {
          errors += 1;
          continue;
        }

        existingAssetTitles.add(key);
        createdAssets += 1;
      }

      for (const contact of fallbackPayload.contacts) {
        const emailKey = normalizeKey(contact.email);
        if (emailKey && existingContactEmails.has(emailKey)) {
          skipped += 1;
          continue;
        }

        const result = await mediaContactsService.create(contact);
        if (result.error) {
          errors += 1;
          continue;
        }

        if (emailKey) existingContactEmails.add(emailKey);
        createdContacts += 1;
      }

      showMessage(
        errors > 0 ? 'error' : 'success',
        `Import finished: ${createdReleases} releases, ${createdStories} stories, ${createdAssets} assets, ${createdContacts} contacts created. ${skipped} skipped.${errors > 0 ? ` ${errors} failed.` : ''}`
      );
      await loadAllData();
    } catch (error) {
      showMessage('error', `Fallback import failed: ${error.message || 'Unknown error'}`);
    } finally {
      setImportingFallback(false);
      setSaving(false);
    }
  }, [loadAllData, records.assets, records.contacts, records.releases, records.stories, showMessage]);

  const renderList = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-600">
          Loading media press kit records...
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-600">
          No records found for this tab.
        </div>
      );
    }

    if (activeTab === 'contacts') {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{contact.name || 'Unnamed Contact'}</h3>
                  <p className="text-sm text-slate-600">{contact.position || 'Position not set'}</p>
                  <p className="text-sm text-slate-600 mt-2">{contact.department || 'No department'}</p>
                  <p className="text-sm text-slate-700 mt-2">{contact.email || 'No email'}</p>
                  <p className="text-sm text-slate-700">{contact.phone || 'No phone'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditForm(contact)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" title="Edit">
                    <Icons.Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(contact)} className="p-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50" title="Delete">
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900 text-lg">{item.title || 'Untitled'}</h3>
                  {activeTab === 'stories' && item.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">Featured</span>
                  )}
                  {activeTab === 'assets' && (
                    <>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">{item.assetType || 'asset'}</span>
                      {item.approved === false ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-800">Pending</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">Approved</span>
                      )}
                    </>
                  )}
                </div>

                {activeTab === 'releases' && (
                  <>
                    <p className="text-sm text-slate-600 mb-1">{item.category || 'General'} • {formatDate(item.publishDate)}</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{item.summary || item.content || 'No summary available.'}</p>
                  </>
                )}

                {activeTab === 'assets' && (
                  <>
                    <p className="text-sm text-slate-600 mb-1">{item.category || 'Uncategorized'} • {formatDate(item.uploadDate)}</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{item.description || 'No description available.'}</p>
                    <p className="text-xs text-slate-500 mt-2">Downloads: {item.downloadCount || 0}</p>
                  </>
                )}

                {activeTab === 'stories' && (
                  <>
                    <p className="text-sm text-slate-600 mb-1">{item.storyType || 'General'} • {formatDate(item.publishDate)}</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{item.excerpt || item.content || 'No summary available.'}</p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeTab === 'assets' && item.fileUrl && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                    title="Open file"
                  >
                    <Icons.ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => openEditForm(item)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" title="Edit">
                  <Icons.Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item)} className="p-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50" title="Delete">
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReleaseForm = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(event) => handleInputChange('title', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(event) => handleInputChange('category', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Policy, Research, Event"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
        <input
          type="date"
          value={formData.publishDate}
          onChange={(event) => handleInputChange('publishDate', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(event) => handleInputChange('summary', event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
        <textarea
          value={formData.content}
          onChange={(event) => handleInputChange('content', event.target.value)}
          rows={7}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Source / Citation</label>
        <input
          type="text"
          value={formData.source}
          onChange={(event) => handleInputChange('source', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">PDF URL</label>
        <input
          type="url"
          value={formData.pdfUrl}
          onChange={(event) => handleInputChange('pdfUrl', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Upload PDF (optional)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => handleFileUpload('pdfUrl', 'pdfPath', event.target.files?.[0], 'press-releases')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {uploadingField === 'pdfUrl' && <p className="mt-1 text-xs text-slate-500">Uploading PDF...</p>}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Attachments (one URL per line)</label>
        <textarea
          value={formData.attachmentsText}
          onChange={(event) => handleInputChange('attachmentsText', event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const renderAssetForm = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(event) => handleInputChange('title', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Asset Type</label>
        <select
          value={formData.assetType}
          onChange={(event) => handleInputChange('assetType', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="logo">Logo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(event) => handleInputChange('category', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(event) => handleInputChange('description', event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">File URL *</label>
        <input
          type="url"
          value={formData.fileUrl}
          onChange={(event) => handleInputChange('fileUrl', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(event) => handleInputChange('thumbnailUrl', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Main File</label>
        <input
          type="file"
          onChange={(event) => handleFileUpload('fileUrl', 'filePath', event.target.files?.[0], 'media-assets')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {uploadingField === 'fileUrl' && <p className="mt-1 text-xs text-slate-500">Uploading file...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleFileUpload('thumbnailUrl', 'thumbnailPath', event.target.files?.[0], 'media-assets-thumbnails')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {uploadingField === 'thumbnailUrl' && <p className="mt-1 text-xs text-slate-500">Uploading thumbnail...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Resolution</label>
        <input
          type="text"
          value={formData.resolution}
          onChange={(event) => handleInputChange('resolution', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="1920x1080"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Date</label>
        <input
          type="date"
          value={formData.uploadDate}
          onChange={(event) => handleInputChange('uploadDate', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2 flex items-center gap-2">
        <input
          id="asset-approved"
          type="checkbox"
          checked={Boolean(formData.approved)}
          onChange={(event) => handleInputChange('approved', event.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="asset-approved" className="text-sm text-slate-700">Approved for public page</label>
      </div>
    </div>
  );

  const renderStoryForm = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(event) => handleInputChange('title', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Story Type</label>
        <input
          type="text"
          value={formData.storyType}
          onChange={(event) => handleInputChange('storyType', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="Case Study"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date</label>
        <input
          type="date"
          value={formData.publishDate}
          onChange={(event) => handleInputChange('publishDate', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(event) => handleInputChange('excerpt', event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
        <textarea
          value={formData.content}
          onChange={(event) => handleInputChange('content', event.target.value)}
          rows={7}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(event) => handleInputChange('imageUrl', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => handleFileUpload('imageUrl', 'imagePath', event.target.files?.[0], 'media-stories')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {uploadingField === 'imageUrl' && <p className="mt-1 text-xs text-slate-500">Uploading image...</p>}
      </div>

      <div className="md:col-span-2 flex items-center gap-2">
        <input
          id="story-featured"
          type="checkbox"
          checked={Boolean(formData.featured)}
          onChange={(event) => handleInputChange('featured', event.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="story-featured" className="text-sm text-slate-700">Featured on public Media Press Kit</label>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(event) => handleInputChange('name', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
        <input
          type="text"
          value={formData.position}
          onChange={(event) => handleInputChange('position', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(event) => handleInputChange('email', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(event) => handleInputChange('phone', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
        <input
          type="text"
          value={formData.department}
          onChange={(event) => handleInputChange('department', event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Admin · Communications</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">Media Press Kit Manager</h1>
              <p className="text-slate-600 mt-2">
                Manage press releases, downloadable assets, stories, and media contacts used by the public Media Press Kit page.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadAllData}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2"
              >
                <Icons.RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleImportFallback}
                disabled={importingFallback || saving}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                title="One-click import fallback NARA news dataset into Firestore"
              >
                {importingFallback ? <Icons.Loader2 className="w-4 h-4 animate-spin" /> : <Icons.Database className="w-4 h-4" />}
                {importingFallback ? 'Importing...' : 'Import Fallback Data'}
              </button>
              <button
                onClick={openCreateForm}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center gap-2"
              >
                <Icons.Plus className="w-4 h-4" />
                Add {TABS.find((tab) => tab.id === activeTab)?.label || 'Item'}
              </button>
            </div>
          </div>

          {(successMessage || errorMessage) && (
            <div className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium ${errorMessage
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
              {errorMessage || successMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Press Releases</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{records.releases.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Media Assets</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{records.assets.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Stories</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{records.stories.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase">Contacts</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{records.contacts.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-4">
            <div className="flex flex-wrap gap-2 py-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                      ? 'bg-blue-700 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <div className="grid gap-3 md:grid-cols-[1fr,220px]">
              <div className="relative">
                <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search records..."
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2"
                />
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                {(SORT_OPTIONS[activeTab] || []).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4">{renderList()}</div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Edit' : 'Add'} {TABS.find((tab) => tab.id === activeTab)?.label || 'Item'}
              </h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-slate-100">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {activeTab === 'releases' && renderReleaseForm()}
              {activeTab === 'assets' && renderAssetForm()}
              {activeTab === 'stories' && renderStoryForm()}
              {activeTab === 'contacts' && renderContactForm()}

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || Boolean(uploadingField)}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPressKitAdmin;
