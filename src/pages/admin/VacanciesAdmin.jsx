import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Plus, Edit, Trash2, Search, Calendar, MapPin,
  DollarSign, Users, Save, X, ArrowLeft, RefreshCw, Building2,
  Upload, FileText, GraduationCap, Tag, Download, Mail, Phone, Inbox
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import {
  JOB_CATEGORIES, STUDY_FIELDS, QUALIFICATION_LEVELS, DOCUMENT_TYPES, EMPLOYMENT_TYPES,
  NARA_DEPARTMENTS, categoryLabel, qualificationLabel, studyFieldLabel, documentTypeLabel,
} from '../../constants/vacancyTaxonomy';
import { getApplicationsForVacancy } from '../../services/jobApplicationService';

/**
 * Vacancies Admin — create/edit/delete job postings with structured category,
 * required qualifications, required documents and an optional job-description
 * PDF, plus a per-vacancy applicants viewer with document downloads.
 *
 * Postings are saved to the `vacancies` Firestore collection using the SAME
 * field names the public /vacancies page reads (applyUrl, salary, deadline,
 * positions, postedDate, qualifications) so posted jobs render in full.
 */
const EMPTY_FORM = {
  title: { en: '', si: '', ta: '' },
  description: { en: '', si: '', ta: '' },
  requirements: { en: '', si: '', ta: '' },
  department: '',
  category: 'scientific-research',
  location: 'Colombo',
  employmentType: 'full-time',
  salaryRange: '',
  closingDate: '',
  status: 'open',
  applicationUrl: '',
  numberOfPositions: 1,
  minQualification: 'bachelors',
  studyFields: [],
  qualificationsText: '',
  requiredDocuments: ['cv', 'educational-certificates', 'nic'],
  jobDescriptionUrl: '',
};

const statusOptions = [
  { value: 'open', label: 'Open', color: 'green' },
  { value: 'closed', label: 'Closed', color: 'red' },
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'filled', label: 'Filled', color: 'blue' },
];

const VacanciesAdmin = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  // Applicants viewer
  const [applicantsFor, setApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  useEffect(() => { loadVacancies(); }, []);

  const loadVacancies = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'vacancies'), orderBy('createdAt', 'desc')));
      setVacancies(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error loading vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const set = new Set(prev[field] || []);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [field]: [...set] };
    });
  };

  const uploadJobDescription = async (file) => {
    const safe = (file.name || 'job-description.pdf').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 80);
    const path = `vacancy_documents/${Date.now()}_${safe}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleJobDescFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB.'); return; }
    setUploading(true);
    try {
      const url = await uploadJobDescription(file);
      setFormData((prev) => ({ ...prev, jobDescriptionUrl: url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Document upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const qualifications = (formData.qualificationsText || '')
        .split('\n').map((s) => s.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);

      // Write canonical field names the public page reads, plus the admin names
      // for backward compatibility / editing.
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        department: formData.department,
        category: formData.category,
        location: formData.location,
        employmentType: formData.employmentType,
        status: formData.status,
        minQualification: formData.minQualification,
        studyFields: formData.studyFields,
        requiredDocuments: formData.requiredDocuments,
        qualifications,
        jobDescriptionUrl: formData.jobDescriptionUrl || '',
        // canonical (public page) + legacy (admin) duplicates:
        salary: formData.salaryRange,
        salaryRange: formData.salaryRange,
        deadline: formData.closingDate,
        closingDate: formData.closingDate,
        positions: Number(formData.numberOfPositions) || 1,
        numberOfPositions: Number(formData.numberOfPositions) || 1,
        applyUrl: formData.applicationUrl,
        applicationUrl: formData.applicationUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingVacancy) {
        await updateDoc(doc(db, 'vacancies', editingVacancy.id), payload);
      } else {
        await addDoc(collection(db, 'vacancies'), {
          ...payload,
          createdAt: serverTimestamp(),
          postedDate: new Date().toISOString(),
          applicationsCount: 0,
        });
      }
      setShowForm(false);
      setEditingVacancy(null);
      setFormData(EMPTY_FORM);
      loadVacancies();
    } catch (error) {
      console.error('Error saving vacancy:', error);
      alert('Could not save the vacancy. Please check the form and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
    try {
      await deleteDoc(doc(db, 'vacancies', id));
      loadVacancies();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
    }
  };

  const handleEdit = (vacancy) => {
    setEditingVacancy(vacancy);
    setFormData({
      title: vacancy.title || { en: '', si: '', ta: '' },
      description: vacancy.description || { en: '', si: '', ta: '' },
      requirements: vacancy.requirements || { en: '', si: '', ta: '' },
      department: vacancy.department || '',
      category: vacancy.category || 'scientific-research',
      location: vacancy.location || 'Colombo',
      employmentType: vacancy.employmentType || 'full-time',
      salaryRange: vacancy.salaryRange || vacancy.salary || '',
      closingDate: vacancy.closingDate || vacancy.deadline || '',
      status: vacancy.status || 'open',
      applicationUrl: vacancy.applicationUrl || vacancy.applyUrl || '',
      numberOfPositions: vacancy.numberOfPositions || vacancy.positions || 1,
      minQualification: vacancy.minQualification || 'bachelors',
      studyFields: vacancy.studyFields || [],
      qualificationsText: (vacancy.qualifications || []).join('\n'),
      requiredDocuments: vacancy.requiredDocuments || ['cv', 'educational-certificates', 'nic'],
      jobDescriptionUrl: vacancy.jobDescriptionUrl || '',
    });
    setShowForm(true);
  };

  const openApplicants = async (vacancy) => {
    setApplicantsFor(vacancy);
    setApplicantsLoading(true);
    try {
      setApplicants(await getApplicationsForVacancy(vacancy.id));
    } catch (err) {
      console.error('Error loading applicants:', err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const filteredVacancies = vacancies.filter((item) => {
    const matchesSearch =
      item.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inputCls = 'w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin/master')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin</span>
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl"><Briefcase size={32} /></div>
              <div>
                <h1 className="text-3xl font-bold">Vacancies Manager</h1>
                <p className="text-white/70">Post jobs, set required qualifications, and review applicants</p>
              </div>
            </div>
            <button
              onClick={() => { setFormData(EMPTY_FORM); setEditingVacancy(null); setShowForm(true); }}
              className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Plus size={20} /> Post New Vacancy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vacancies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
          >
            <option value="all">All Status</option>
            {statusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
          <button onClick={loadVacancies} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{vacancies.filter((v) => v.status === 'open').length}</div>
            <div className="text-sm text-gray-500">Open Positions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{vacancies.length}</div>
            <div className="text-sm text-gray-500">Total Vacancies</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{vacancies.reduce((s, v) => s + (v.applicationsCount || 0), 0)}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{vacancies.filter((v) => v.status === 'closed').length}</div>
            <div className="text-sm text-gray-500">Closed</div>
          </div>
        </div>

        {/* Vacancies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-500">Loading vacancies...</p>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No vacancies found</h3>
            <p className="text-gray-500 mt-2">Post your first job opening to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredVacancies.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'open' ? 'bg-green-100 text-green-700' :
                        item.status === 'filled' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.status?.toUpperCase()}
                      </span>
                      {item.category && (
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                          <Tag size={12} /> {categoryLabel(item.category)}
                        </span>
                      )}
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        {item.employmentType?.replace('-', ' ').toUpperCase()}
                      </span>
                      {(item.positions || item.numberOfPositions) > 1 && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                          <Users size={12} /> {item.positions || item.numberOfPositions} positions
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title?.en}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Building2 size={14} /> {item.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {item.location}</span>
                      {item.minQualification && (
                        <span className="flex items-center gap-1"><GraduationCap size={14} /> Min: {qualificationLabel(item.minQualification)}</span>
                      )}
                      {(item.closingDate || item.deadline) && (
                        <span className="flex items-center gap-1"><Calendar size={14} /> Closes: {item.closingDate || item.deadline}</span>
                      )}
                      {(item.salaryRange || item.salary) && (
                        <span className="flex items-center gap-1"><DollarSign size={14} /> {item.salaryRange || item.salary}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openApplicants(item)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm font-medium"
                      title="View applicants"
                    >
                      <Inbox size={16} /> Applicants
                      {item.applicationsCount ? <span className="ml-0.5 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[11px]">{item.applicationsCount}</span> : null}
                    </button>
                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Edit">
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-slate-900">{editingVacancy ? 'Edit Vacancy' : 'Post New Vacancy'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className={labelCls}>Job Title (English) *</label>
                  <input type="text" value={formData.title.en} required className={inputCls}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} />
                </div>

                {/* Category, Department, Location */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Job Category *</label>
                    <select value={formData.category} required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                      {JOB_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Department *</label>
                    <select value={formData.department} required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                      <option value="">Select Department</option>
                      {NARA_DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input type="text" value={formData.location} className={inputCls}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                </div>

                {/* Employment type, positions, salary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Employment Type</label>
                    <select value={formData.employmentType} className={inputCls}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}>
                      {EMPLOYMENT_TYPES.map((tp) => (<option key={tp.value} value={tp.value}>{tp.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Number of Positions</label>
                    <input type="number" min="1" value={formData.numberOfPositions} className={inputCls}
                      onChange={(e) => setFormData({ ...formData, numberOfPositions: parseInt(e.target.value) || 1 })} />
                  </div>
                  <div>
                    <label className={labelCls}>Salary Range</label>
                    <input type="text" value={formData.salaryRange} placeholder="e.g., Rs. 50,000 - 80,000" className={inputCls}
                      onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })} />
                  </div>
                </div>

                {/* Minimum qualification + study fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}><GraduationCap size={14} className="inline mr-1" /> Minimum Qualification *</label>
                    <select value={formData.minQualification} required className={inputCls}
                      onChange={(e) => setFormData({ ...formData, minQualification: e.target.value })}>
                      {QUALIFICATION_LEVELS.map((q) => (<option key={q.value} value={q.value}>{q.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Closing Date</label>
                    <input type="date" value={formData.closingDate} className={inputCls}
                      onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Relevant Fields of Study (applicants in these fields are encouraged to apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {STUDY_FIELDS.map((f) => (
                      <label key={f.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.studyFields.includes(f.value)}
                          onChange={() => toggleArrayValue('studyFields', f.value)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelCls}>Job Description (English) *</label>
                  <textarea value={formData.description.en} rows={4} required className={inputCls}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })} />
                </div>

                {/* Required qualifications (one per line) */}
                <div>
                  <label className={labelCls}>Required Qualifications (one per line — shown to applicants)</label>
                  <textarea value={formData.qualificationsText} rows={4} className={inputCls}
                    placeholder={"Bachelor's degree in Marine Science or related field\nMinimum 3 years relevant experience\nFluency in English and Sinhala"}
                    onChange={(e) => setFormData({ ...formData, qualificationsText: e.target.value })} />
                </div>

                {/* Required documents */}
                <div>
                  <label className={labelCls}><FileText size={14} className="inline mr-1" /> Documents Applicants Must Submit</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    {DOCUMENT_TYPES.map((d) => (
                      <label key={d.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.requiredDocuments.includes(d.value)}
                          onChange={() => toggleArrayValue('requiredDocuments', d.value)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        {d.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job description PDF upload + external apply link + status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}><Upload size={14} className="inline mr-1" /> Job Description Document (PDF, optional)</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleJobDescFile}
                      className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                    {uploading && <p className="text-xs text-emerald-600 mt-1">Uploading…</p>}
                    {formData.jobDescriptionUrl && !uploading && (
                      <a href={formData.jobDescriptionUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 underline mt-1 inline-block">Uploaded document ✓ (view)</a>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select value={formData.status} className={inputCls}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      {statusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>External Application Link (optional — leave blank to use the built-in apply form)</label>
                  <input type="url" value={formData.applicationUrl} placeholder="https://… (e.g. PSC portal)" className={inputCls}
                    onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={loading || uploading}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                    <Save size={18} /> {editingVacancy ? 'Update' : 'Post'} Vacancy
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applicants Modal */}
      <AnimatePresence>
        {applicantsFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setApplicantsFor(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Applicants</h2>
                  <p className="text-sm text-slate-500">{applicantsFor.title?.en}</p>
                </div>
                <button onClick={() => setApplicantsFor(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-6">
                {applicantsLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" />
                    <p className="mt-3 text-gray-500">Loading applicants…</p>
                  </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    No applications yet for this vacancy.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((a) => (
                      <div key={a.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h4 className="font-semibold text-slate-900">{a.fullName}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-600">
                              {a.email && <span className="flex items-center gap-1"><Mail size={13} /> {a.email}</span>}
                              {a.phone && <span className="flex items-center gap-1"><Phone size={13} /> {a.phone}</span>}
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700">{a.status || 'submitted'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs">
                          {a.category && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{categoryLabel(a.category)}</span>}
                          {a.studyField && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{studyFieldLabel(a.studyField)}</span>}
                          {a.qualificationLevel && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{qualificationLabel(a.qualificationLevel)}</span>}
                          {a.institution && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{a.institution}</span>}
                          {a.experienceYears ? <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">{a.experienceYears} yrs exp.</span> : null}
                        </div>
                        {a.coverNote && <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{a.coverNote}</p>}
                        {a.documents?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {a.documents.map((docu, i) => (
                              <a key={i} href={docu.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition">
                                <Download size={13} /> {documentTypeLabel(docu.type)}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VacanciesAdmin;
