import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const ProjectForm = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    pi: '',
    category: 'Marine Biology',
    status: 'Active',
    duration: '',
    progress: 0,
    budget: '',
    spent: '',
    team: 0,
    partners: '',
    description: '',
    objectives: '',
    outcomes: '',
    fundingSource: '',
    publications: 0,
    datasets: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        partners: Array.isArray(initialData.partners) ? initialData.partners.join(', ') : initialData.partners || '',
        objectives: Array.isArray(initialData.objectives) ? initialData.objectives.join('\n') : initialData.objectives || '',
        outcomes: Array.isArray(initialData.outcomes) ? initialData.outcomes.join('\n') : initialData.outcomes || ''
      });
    }
  }, [initialData]);

  const categories = [
    'Marine Biology', 'Climate Change', 'Fisheries Management',
    'Oceanography', 'Conservation', 'Marine Policy'
  ];

  const statuses = ['Active', 'Planning', 'Completing', 'Completed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      partners: formData.partners.split(',').map(p => p.trim()).filter(p => p),
      objectives: formData.objectives.split('\n').map(o => o.trim()).filter(o => o),
      outcomes: formData.outcomes.split('\n').map(o => o.trim()).filter(o => o),
      progress: parseInt(formData.progress) || 0,
      team: parseInt(formData.team) || 0,
      publications: parseInt(formData.publications) || 0,
      datasets: parseInt(formData.datasets) || 0
    };
    onSave(processedData);
  };

  return (
    <div className="p-8 rounded-2xl bg-white backdrop-blur-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {initialData ? 'Edit' : 'Add New'} Project
        </h2>
        <button onClick={onCancel} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Project Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Principal Investigator *</label>
          <input
            type="text"
            value={formData.pi}
            onChange={(e) => setFormData({...formData, pi: e.target.value})}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Duration (e.g., 2023-2026)</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            placeholder="2023-2026"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Progress (%)</label>
          <input
            type="number"
            value={formData.progress}
            onChange={(e) => setFormData({...formData, progress: e.target.value})}
            min="0"
            max="100"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Budget (e.g., $2.8M)</label>
          <input
            type="text"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
            placeholder="$2.8M"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Spent (e.g., $1.9M)</label>
          <input
            type="text"
            value={formData.spent}
            onChange={(e) => setFormData({...formData, spent: e.target.value})}
            placeholder="$1.9M"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Team Size</label>
          <input
            type="number"
            value={formData.team}
            onChange={(e) => setFormData({...formData, team: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-2">Funding Source</label>
          <input
            type="text"
            value={formData.fundingSource}
            onChange={(e) => setFormData({...formData, fundingSource: e.target.value})}
            placeholder="e.g., NSF, EU Horizon"
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

        <div>
          <label className="block text-sm text-slate-500 mb-2">Datasets</label>
          <input
            type="number"
            value={formData.datasets}
            onChange={(e) => setFormData({...formData, datasets: e.target.value})}
            min="0"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Partners (comma-separated)</label>
          <input
            type="text"
            value={formData.partners}
            onChange={(e) => setFormData({...formData, partners: e.target.value})}
            placeholder="NOAA, CSIRO, University of Tokyo"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Objectives (one per line)</label>
          <textarea
            value={formData.objectives}
            onChange={(e) => setFormData({...formData, objectives: e.target.value})}
            rows="4"
            placeholder="Objective 1&#10;Objective 2&#10;Objective 3"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-slate-500 mb-2">Key Outcomes (one per line)</label>
          <textarea
            value={formData.outcomes}
            onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
            rows="4"
            placeholder="Outcome 1&#10;Outcome 2&#10;Outcome 3"
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
                Save Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
