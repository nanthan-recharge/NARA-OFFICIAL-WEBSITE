import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const TeamForm = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    lead: '',
    members: 0,
    projects: 0,
    publications: 0,
    funding: '',
    focus: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      members: parseInt(formData.members) || 0,
      projects: parseInt(formData.projects) || 0,
      publications: parseInt(formData.publications) || 0
    };
    onSave(processedData);
  };

  return (
    <div className="p-8 rounded-2xl bg-white backdrop-blur-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {initialData ? 'Edit' : 'Add New'} Research Team
        </h2>
        <button onClick={onCancel} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Team Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Marine Biodiversity Lab"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Team Leader *</label>
          <input
            type="text"
            value={formData.lead}
            onChange={(e) => setFormData({...formData, lead: e.target.value})}
            placeholder="Dr. Name"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Number of Members</label>
          <input
            type="number"
            value={formData.members}
            onChange={(e) => setFormData({...formData, members: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Active Projects</label>
          <input
            type="number"
            value={formData.projects}
            onChange={(e) => setFormData({...formData, projects: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Publications</label>
          <input
            type="number"
            value={formData.publications}
            onChange={(e) => setFormData({...formData, publications: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Funding Secured</label>
          <input
            type="text"
            value={formData.funding}
            onChange={(e) => setFormData({...formData, funding: e.target.value})}
            placeholder="$2.3M"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Research Focus *</label>
          <textarea
            value={formData.focus}
            onChange={(e) => setFormData({...formData, focus: e.target.value})}
            placeholder="Describe the team's research focus..."
            rows="4"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
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
                Save Team
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
