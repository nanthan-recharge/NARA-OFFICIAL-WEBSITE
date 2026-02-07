import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Plus, Edit, Trash2, Search, Calendar, Globe,
  Save, X, Upload, Image as ImageIcon, ArrowLeft, RefreshCw,
  Star, GripVertical, ChevronDown, Eye, Clock, CheckCircle
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { uploadNewsImage, deleteNewsImage, deleteAllNewsImages } from '../../services/newsImageService';
import { createPreviewURL, formatFileSize } from '../../utils/imageConverter';

const CATEGORIES = [
  { value: 'general', label: 'General News' },
  { value: 'research', label: 'Research Updates' },
  { value: 'events', label: 'Events' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'press', label: 'Press Releases' },
  { value: 'achievements', label: 'Achievements' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', icon: Clock, color: 'bg-slate-100 text-slate-700' },
  { value: 'published', label: 'Published', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'archived', label: 'Archived', icon: Eye, color: 'bg-amber-100 text-amber-700' },
];

const EMPTY_FORM = {
  title: { en: '', si: '', ta: '' },
  content: { en: '', si: '', ta: '' },
  excerpt: { en: '', si: '', ta: '' },
  category: 'general',
  status: 'draft',
  featuredImage: '',
  images: [],
  tags: [],
  publishDate: new Date().toISOString().split('T')[0],
  year: new Date().getFullYear(),
  views: 0,
  isFeatured: false,
};

const NewsAdmin = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // List state
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Image upload state
  const [pendingFiles, setPendingFiles] = useState([]); // Files not yet uploaded
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total }
  const [dragOver, setDragOver] = useState(false);

  // ─── Load News ──────────────────────────────────────────────────
  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setNews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  // ─── Filtering ──────────────────────────────────────────────────
  const filteredNews = news.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      item.title?.en?.toLowerCase().includes(q) ||
      item.excerpt?.en?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── Form Helpers ───────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ ...EMPTY_FORM, publishDate: new Date().toISOString().split('T')[0], year: new Date().getFullYear() });
    setPendingFiles([]);
    setEditingNews(null);
    setTagInput('');
  };

  const openCreateForm = () => { resetForm(); setShowForm(true); };

  const openEditForm = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || { en: '', si: '', ta: '' },
      content: item.content || { en: '', si: '', ta: '' },
      excerpt: item.excerpt || { en: '', si: '', ta: '' },
      category: item.category || 'general',
      status: item.status || 'draft',
      featuredImage: item.featuredImage || '',
      images: item.images || [],
      tags: item.tags || [],
      publishDate: item.publishDate || new Date().toISOString().split('T')[0],
      year: item.year || new Date().getFullYear(),
      views: item.views || 0,
      isFeatured: item.isFeatured || false,
    });
    setPendingFiles([]);
    setShowForm(true);
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      if (keys.length === 2) {
        return { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } };
      }
      return { ...prev, [path]: value };
    });
  };

  // Auto-set year from publishDate
  const handleDateChange = (date) => {
    const year = date ? parseInt(date.split('-')[0], 10) : new Date().getFullYear();
    setFormData(prev => ({ ...prev, publishDate: date, year }));
  };

  // ─── Tag Management ─────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ─── Image Management ──────────────────────────────────────────
  const handleFileSelect = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newPending = imageFiles.map(f => ({
      file: f,
      preview: createPreviewURL(f),
      name: f.name,
      size: f.size,
    }));
    setPendingFiles(prev => [...prev, ...newPending]);
  };

  const removePendingFile = (index) => {
    setPendingFiles(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExistingImage = async (index) => {
    const img = formData.images[index];
    if (img?.storagePath) {
      try { await deleteNewsImage(img.storagePath); } catch (e) { console.error(e); }
    }
    setFormData(prev => {
      const images = [...prev.images];
      images.splice(index, 1);
      const featuredImage = images.length > 0 ? images[0].url : '';
      return { ...prev, images, featuredImage };
    });
  };

  const setFeaturedImage = (index) => {
    setFormData(prev => {
      const images = [...prev.images];
      const [featured] = images.splice(index, 1);
      images.unshift(featured);
      const reordered = images.map((img, i) => ({ ...img, order: i }));
      return { ...prev, images: reordered, featuredImage: reordered[0]?.url || '' };
    });
  };

  // ─── Drop Zone ──────────────────────────────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
  };

  // ─── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let articleId = editingNews?.id;
      let allImages = [...formData.images];

      // If creating new, save first to get ID
      if (!articleId) {
        const docRef = await addDoc(collection(db, 'news'), {
          ...formData,
          images: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        articleId = docRef.id;
      }

      // Upload pending files
      if (pendingFiles.length > 0) {
        setUploadProgress({ current: 0, total: pendingFiles.length });
        for (let i = 0; i < pendingFiles.length; i++) {
          const result = await uploadNewsImage(articleId, pendingFiles[i].file, allImages.length + i);
          allImages.push({
            url: result.url,
            storagePath: result.storagePath,
            caption: { en: '', si: '', ta: '' },
            order: allImages.length,
            width: result.width,
            height: result.height,
          });
          setUploadProgress({ current: i + 1, total: pendingFiles.length });
        }
        // Cleanup previews
        pendingFiles.forEach(f => URL.revokeObjectURL(f.preview));
        setPendingFiles([]);
        setUploadProgress(null);
      }

      const featuredImage = allImages.length > 0 ? allImages[0].url : formData.featuredImage;

      // Update the document
      await updateDoc(doc(db, 'news', articleId), {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        status: formData.status,
        featuredImage,
        images: allImages,
        tags: formData.tags,
        publishDate: formData.publishDate,
        year: formData.year,
        views: formData.views,
        isFeatured: formData.isFeatured,
        updatedAt: serverTimestamp(),
      });

      setShowForm(false);
      resetForm();
      loadNews();
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  // ─── Delete Article ─────────────────────────────────────────────
  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title?.en}"? This cannot be undone.`)) return;
    try {
      if (item.images?.length > 0) await deleteAllNewsImages(item.images);
      await deleteDoc(doc(db, 'news', item.id));
      loadNews();
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-nara-navy to-slate-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/admin/master')} className="flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition text-sm">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl"><Newspaper size={28} /></div>
              <div>
                <h1 className="text-2xl font-bold">News Management</h1>
                <p className="text-slate-300 text-sm">{news.length} articles total</p>
              </div>
            </div>
            <button onClick={openCreateForm} className="flex items-center gap-2 bg-white text-nara-navy px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition text-sm">
              <Plus size={18} /> New Article
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-nara-blue/30 focus:border-nara-blue text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-nara-blue/30">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={loadNews} className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition" title="Refresh">
            <RefreshCw size={18} className="text-slate-500" />
          </button>
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-nara-blue border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-500 text-sm">Loading articles...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <Newspaper className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">No articles found</h3>
            <p className="text-slate-400 text-sm mt-1">Create your first news article</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNews.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex gap-4 items-start">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {item.featuredImage ? (
                    <img src={item.featuredImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-slate-300" /></div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                      item.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                    }`}>{item.status}</span>
                    <span className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-600 rounded-full font-medium">
                      {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </span>
                    {item.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm truncate">{item.title?.en || 'Untitled'}</h3>
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{item.excerpt?.en}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{item.publishDate}</span>
                    <span>{item.images?.length || 0} images</span>
                    <span>{item.views || 0} views</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEditForm(item)} className="p-2 hover:bg-slate-100 rounded-lg transition" title="Edit">
                    <Edit size={16} className="text-slate-500" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════ FORM MODAL ═══════════════════ */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => !saving && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-5xl my-8 shadow-2xl"
              onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingNews ? 'Edit Article' : 'Create New Article'}
                </h2>
                <button onClick={() => !saving && setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">

                {/* ── Image Gallery ── */}
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                    <ImageIcon size={18} className="text-nara-blue" /> Image Gallery
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({formData.images.length + pendingFiles.length} images — auto-converted to WebP)
                    </span>
                  </h3>

                  {/* Existing + Pending images grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
                    {/* Existing uploaded images */}
                    {formData.images.map((img, idx) => (
                      <div key={img.url} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-nara-blue/40 transition bg-slate-50">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                            <Star size={10} /> Featured
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-1.5">
                            {idx !== 0 && (
                              <button type="button" onClick={() => setFeaturedImage(idx)} className="p-1.5 bg-white rounded-lg text-amber-600 hover:bg-amber-50" title="Set as featured">
                                <Star size={14} />
                              </button>
                            )}
                            <button type="button" onClick={() => removeExistingImage(idx)} className="p-1.5 bg-white rounded-lg text-red-500 hover:bg-red-50" title="Remove">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pending files (not yet uploaded) */}
                    {pendingFiles.map((pf, idx) => (
                      <div key={pf.name + idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-300 bg-blue-50/50">
                        <img src={pf.preview} alt="" className="w-full h-full object-cover opacity-70" />
                        <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 text-white text-[9px] px-2 py-1 truncate">
                          {pf.name} • {formatFileSize(pf.size)}
                        </div>
                        <button type="button" onClick={() => removePendingFile(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition">
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {/* Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                        dragOver ? 'border-nara-blue bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Upload size={24} className={dragOver ? 'text-nara-blue' : 'text-slate-400'} />
                      <span className="text-[11px] text-slate-500 mt-1.5 text-center px-2">Drop images or click</span>
                    </div>
                  </div>

                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => { handleFileSelect(e.target.files); e.target.value = ''; }} />

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                      <div className="animate-spin w-5 h-5 border-2 border-nara-blue border-t-transparent rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 font-medium">
                          Converting & uploading {uploadProgress.current}/{uploadProgress.total}...
                        </p>
                        <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1.5">
                          <div className="bg-nara-blue h-1.5 rounded-full transition-all"
                            style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Title (Multilingual) ── */}
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                    <Globe size={18} className="text-nara-blue" /> Title
                  </h3>
                  <div className="grid gap-3">
                    {[
                      { key: 'en', label: 'English', required: true },
                      { key: 'si', label: 'සිංහල (Sinhala)' },
                      { key: 'ta', label: 'தமிழ் (Tamil)' },
                    ].map(lang => (
                      <div key={lang.key}>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{lang.label}</label>
                        <input type="text" value={formData.title[lang.key]} required={lang.required}
                          onChange={e => updateField(`title.${lang.key}`, e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-nara-blue/30 focus:border-nara-blue text-sm" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Excerpt (Multilingual) ── */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Excerpt / Summary</h3>
                  <div className="grid gap-3">
                    {[
                      { key: 'en', label: 'English' },
                      { key: 'si', label: 'සිංහල' },
                      { key: 'ta', label: 'தமிழ்' },
                    ].map(lang => (
                      <div key={lang.key}>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{lang.label}</label>
                        <textarea value={formData.excerpt[lang.key]} rows={2}
                          onChange={e => updateField(`excerpt.${lang.key}`, e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-nara-blue/30 focus:border-nara-blue text-sm resize-none" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Content (Multilingual) ── */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Full Content</h3>
                  <div className="grid gap-3">
                    {[
                      { key: 'en', label: 'English', required: true },
                      { key: 'si', label: 'සිංහල' },
                      { key: 'ta', label: 'தமிழ்' },
                    ].map(lang => (
                      <div key={lang.key}>
                        <label className="block text-xs font-medium text-slate-500 mb-1">{lang.label}</label>
                        <textarea value={formData.content[lang.key]} rows={6} required={lang.required}
                          onChange={e => updateField(`content.${lang.key}`, e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-nara-blue/30 focus:border-nara-blue text-sm resize-y" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Meta Fields ── */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                    <select value={formData.category} onChange={e => updateField('category', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-nara-blue/30">
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                    <select value={formData.status} onChange={e => updateField('status', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-nara-blue/30">
                      {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Publish Date</label>
                    <input type="date" value={formData.publishDate} onChange={e => handleDateChange(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-nara-blue/30" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer py-2.5">
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => updateField('isFeatured', e.target.checked)}
                        className="w-4 h-4 text-nara-blue rounded focus:ring-nara-blue/30" />
                      <span className="text-sm text-slate-700">Featured on Homepage</span>
                    </label>
                  </div>
                </div>

                {/* ── Tags ── */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag..."
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-nara-blue/30" />
                    <button type="button" onClick={addTag} className="px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200 transition">Add</button>
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                  <button type="button" onClick={() => !saving && setShowForm(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-nara-navy text-white rounded-xl hover:bg-nara-blue transition text-sm font-semibold disabled:opacity-50">
                    <Save size={16} />
                    {saving ? 'Saving...' : editingNews ? 'Update Article' : 'Create Article'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsAdmin;
