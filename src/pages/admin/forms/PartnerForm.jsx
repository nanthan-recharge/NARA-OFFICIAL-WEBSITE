import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const PartnerForm = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: 'University',
    region: 'Asia-Pacific',
    joinedYear: new Date().getFullYear(),
    status: 'Active',
    collaborationType: '',
    jointPublications: 0,
    activeProjects: 0,
    mou: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    focusAreas: '',
    achievements: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        collaborationType: Array.isArray(initialData.collaborationType) ? initialData.collaborationType.join(', ') : initialData.collaborationType || '',
        focusAreas: Array.isArray(initialData.focusAreas) ? initialData.focusAreas.join(', ') : initialData.focusAreas || '',
        achievements: Array.isArray(initialData.achievements) ? initialData.achievements.join('\n') : initialData.achievements || ''
      });
    }
  }, [initialData]);

  const types = ['University', 'Research Institute', 'Government Agency', 'NGO', 'Private Sector'];
  const regions = ['Asia-Pacific', 'Europe', 'North America', 'Africa', 'Latin America', 'Middle East'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      collaborationType: formData.collaborationType.split(',').map(c => c.trim()).filter(c => c),
      focusAreas: formData.focusAreas.split(',').map(f => f.trim()).filter(f => f),
      achievements: formData.achievements.split('\n').map(a => a.trim()).filter(a => a),
      jointPublications: parseInt(formData.jointPublications) || 0,
      activeProjects: parseInt(formData.activeProjects) || 0,
      joinedYear: parseInt(formData.joinedYear)
    };
    onSave(processedData);
  };

  return (
    <div className="p-8 rounded-2xl bg-white backdrop-blur-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {initialData ? 'Edit' : 'Add New'} Partner
        </h2>
        <button onClick={onCancel} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Institution Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Country *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Region *</label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({...formData, region: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Year Joined *</label>
          <input
            type="number"
            value={formData.joinedYear}
            onChange={(e) => setFormData({...formData, joinedYear: e.target.value})}
            min="1900"
            max="2100"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Joint Publications</label>
          <input
            type="number"
            value={formData.jointPublications}
            onChange={(e) => setFormData({...formData, jointPublications: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Active Projects</label>
          <input
            type="number"
            value={formData.activeProjects}
            onChange={(e) => setFormData({...formData, activeProjects: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Collaboration Types (comma-separated)</label>
          <input
            type="text"
            value={formData.collaborationType}
            onChange={(e) => setFormData({...formData, collaborationType: e.target.value})}
            placeholder="Research, Training, Student Exchange"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Contact Name</label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData({...formData, contactName: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Contact Email</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Contact Phone</label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Focus Areas (comma-separated)</label>
          <input
            type="text"
            value={formData.focusAreas}
            onChange={(e) => setFormData({...formData, focusAreas: e.target.value})}
            placeholder="Marine Biology, Climate Science, Fisheries"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Key Achievements (one per line)</label>
          <textarea
            value={formData.achievements}
            onChange={(e) => setFormData({...formData, achievements: e.target.value})}
            rows="4"
            placeholder="Achievement 1&#10;Achievement 2&#10;Achievement 3"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.mou}
              onChange={(e) => setFormData({...formData, mou: e.target.checked})}
              className="w-5 h-5 rounded bg-slate-100 border-slate-300 text-[#0066CC]"
            />
            <span className="text-slate-900">MoU Signed</span>
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
                Save Partner
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerForm;
