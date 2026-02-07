import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, Plus, Edit, Trash2, Search, Calendar, MapPin,
  DollarSign, Clock, Users, CheckCircle, XCircle, Save, X,
  ArrowLeft, RefreshCw, FileText, Building2
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

/**
 * Vacancies Admin Page
 * CRUD operations for managing job openings
 */
const VacanciesAdmin = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    requirements: { en: '', si: '', ta: '' },
    department: '',
    location: 'Colombo',
    employmentType: 'full-time',
    salaryRange: '',
    closingDate: '',
    status: 'open',
    applicationUrl: '',
    numberOfPositions: 1
  });

  const departments = [
    'Marine Biological Resources',
    'Fisheries & Aquaculture',
    'Environmental Studies',
    'Socio Economics & Marketing',
    'Inland Aquatic Resources',
    'National Hydrographic Office',
    'Information Technology',
    'Administration',
    'Finance',
    'Library Services'
  ];

  const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'red' },
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'filled', label: 'Filled', color: 'blue' }
  ];

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    setLoading(true);
    try {
      const vacanciesRef = collection(db, 'vacancies');
      const q = query(vacanciesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const vacanciesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVacancies(vacanciesData);
    } catch (error) {
      console.error('Error loading vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingVacancy) {
        await updateDoc(doc(db, 'vacancies', editingVacancy.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'vacancies'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          applicationsCount: 0
        });
      }
      setShowForm(false);
      setEditingVacancy(null);
      resetForm();
      loadVacancies();
    } catch (error) {
      console.error('Error saving vacancy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await deleteDoc(doc(db, 'vacancies', id));
        loadVacancies();
      } catch (error) {
        console.error('Error deleting vacancy:', error);
      }
    }
  };

  const handleEdit = (vacancy) => {
    setEditingVacancy(vacancy);
    setFormData({
      title: vacancy.title || { en: '', si: '', ta: '' },
      description: vacancy.description || { en: '', si: '', ta: '' },
      requirements: vacancy.requirements || { en: '', si: '', ta: '' },
      department: vacancy.department || '',
      location: vacancy.location || 'Colombo',
      employmentType: vacancy.employmentType || 'full-time',
      salaryRange: vacancy.salaryRange || '',
      closingDate: vacancy.closingDate || '',
      status: vacancy.status || 'open',
      applicationUrl: vacancy.applicationUrl || '',
      numberOfPositions: vacancy.numberOfPositions || 1
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', si: '', ta: '' },
      description: { en: '', si: '', ta: '' },
      requirements: { en: '', si: '', ta: '' },
      department: '',
      location: 'Colombo',
      employmentType: 'full-time',
      salaryRange: '',
      closingDate: '',
      status: 'open',
      applicationUrl: '',
      numberOfPositions: 1
    });
  };

  const filteredVacancies = vacancies.filter(item => {
    const matchesSearch = item.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin/master')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Admin</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <Briefcase size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Vacancies Manager</h1>
                <p className="text-white/70">Manage job openings and recruitment</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingVacancy(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Plus size={20} />
              Post New Vacancy
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
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={loadVacancies}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{vacancies.filter(v => v.status === 'open').length}</div>
            <div className="text-sm text-gray-500">Open Positions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{vacancies.length}</div>
            <div className="text-sm text-gray-500">Total Vacancies</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{vacancies.filter(v => v.status === 'filled').length}</div>
            <div className="text-sm text-gray-500">Filled</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{vacancies.filter(v => v.status === 'closed').length}</div>
            <div className="text-sm text-gray-500">Closed</div>
          </div>
        </div>

        {/* Vacancies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
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
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'open' ? 'bg-green-100 text-green-700' :
                        item.status === 'filled' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'closed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        {item.employmentType?.replace('-', ' ').toUpperCase()}
                      </span>
                      {item.numberOfPositions > 1 && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full flex items-center gap-1">
                          <Users size={12} />
                          {item.numberOfPositions} positions
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title?.en}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 size={14} />
                        {item.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {item.location}
                      </span>
                      {item.closingDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Closes: {item.closingDate}
                        </span>
                      )}
                      {item.salaryRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} />
                          {item.salaryRange}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingVacancy ? 'Edit Vacancy' : 'Post New Vacancy'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Department & Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Employment Type, Positions, Salary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {employmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Positions</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numberOfPositions}
                      onChange={(e) => setFormData({...formData, numberOfPositions: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={formData.salaryRange}
                      onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                      placeholder="e.g., Rs. 50,000 - 80,000"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (English) *</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (English)</label>
                  <textarea
                    value={formData.requirements.en}
                    onChange={(e) => setFormData({...formData, requirements: {...formData.requirements, en: e.target.value}})}
                    rows={4}
                    placeholder="• Requirement 1&#10;• Requirement 2"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Closing Date & Status */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
                    <input
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => setFormData({...formData, closingDate: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <Save size={18} />
                    {editingVacancy ? 'Update' : 'Post'} Vacancy
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

export default VacanciesAdmin;
