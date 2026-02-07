import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const PublicationForm = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    citations: 0,
    downloads: 0,
    impactFactor: 0,
    researchArea: 'Marine Biology',
    publicationType: 'Journal Article',
    tags: '',
    openAccess: true,
    pdfUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        authors: Array.isArray(initialData.authors) ? initialData.authors.join(', ') : initialData.authors || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || ''
      });
    }
  }, [initialData]);

  const researchAreas = [
    'Marine Biology', 'Climate Change', 'Fisheries Management',
    'Oceanography', 'Conservation', 'Marine Policy', 'Aquaculture',
    'Coastal Engineering', 'Marine Biotechnology', 'Ocean Modeling'
  ];

  const publicationTypes = [
    'Journal Article', 'Conference Paper', 'Technical Report',
    'Book Chapter', 'Dataset', 'Thesis/Dissertation', 'Review Article', 'Policy Brief'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      authors: formData.authors.split(',').map(a => a.trim()).filter(a => a),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      citations: parseInt(formData.citations) || 0,
      downloads: parseInt(formData.downloads) || 0,
      impactFactor: parseFloat(formData.impactFactor) || 0,
      year: parseInt(formData.year)
    };
    onSave(processedData);
  };

  return (
    <div className="p-8 rounded-2xl bg-white backdrop-blur-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {initialData ? 'Edit' : 'Add New'} Publication
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Publication title"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Authors * (comma-separated)</label>
          <input
            type="text"
            value={formData.authors}
            onChange={(e) => setFormData({...formData, authors: e.target.value})}
            placeholder="Dr. Name, Dr. Name2"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Journal *</label>
          <input
            type="text"
            value={formData.journal}
            onChange={(e) => setFormData({...formData, journal: e.target.value})}
            placeholder="Journal name"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Year *</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            min="1900"
            max="2100"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">DOI</label>
          <input
            type="text"
            value={formData.doi}
            onChange={(e) => setFormData({...formData, doi: e.target.value})}
            placeholder="10.1234/journal.2024.001"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Research Area *</label>
          <select
            value={formData.researchArea}
            onChange={(e) => setFormData({...formData, researchArea: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {researchAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Publication Type *</label>
          <select
            value={formData.publicationType}
            onChange={(e) => setFormData({...formData, publicationType: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {publicationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Abstract *</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => setFormData({...formData, abstract: e.target.value})}
            placeholder="Publication abstract..."
            rows="4"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Citations</label>
          <input
            type="number"
            value={formData.citations}
            onChange={(e) => setFormData({...formData, citations: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Downloads</label>
          <input
            type="number"
            value={formData.downloads}
            onChange={(e) => setFormData({...formData, downloads: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Impact Factor</label>
          <input
            type="number"
            value={formData.impactFactor}
            onChange={(e) => setFormData({...formData, impactFactor: e.target.value})}
            step="0.1"
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">PDF URL</label>
          <input
            type="url"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="coral reefs, climate change, biodiversity"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.openAccess}
              onChange={(e) => setFormData({...formData, openAccess: e.target.checked})}
              className="w-5 h-5 rounded bg-slate-100 border-slate-300 text-[#0066CC]"
            />
            <span className="text-slate-900">Open Access Publication</span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold hover:shadow-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Publication
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicationForm;
