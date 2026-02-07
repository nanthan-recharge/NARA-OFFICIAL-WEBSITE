import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical, Plus, Edit, Trash2, Search, Calendar, Clock,
  MapPin, Users, Video, CheckCircle, Save, X, ArrowLeft,
  RefreshCw, GraduationCap, Presentation, ExternalLink
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

/**
 * Scientist Session Admin Page
 * CRUD operations for managing scientific sessions and presentations
 */
const ScientistSessionAdmin = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    presenter: {
      name: '',
      designation: '',
      division: '',
      photo: ''
    },
    date: '',
    time: '',
    duration: '60',
    venue: 'NARA Auditorium',
    format: 'in-person',
    status: 'upcoming',
    topics: [],
    registrationUrl: '',
    recordingUrl: '',
    maxParticipants: 100,
    currentParticipants: 0
  });

  const divisions = [
    'Marine Biological Resources Division',
    'Fisheries & Aquaculture Division',
    'Environmental Studies Division',
    'Socio Economics & Marketing Division',
    'Inland Aquatic Resources Division',
    'National Hydrographic Office',
    'Information Technology Division'
  ];

  const formatOptions = [
    { value: 'in-person', label: 'In-Person', icon: Users },
    { value: 'virtual', label: 'Virtual (Online)', icon: Video },
    { value: 'hybrid', label: 'Hybrid', icon: Presentation }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming', color: 'blue' },
    { value: 'ongoing', label: 'Ongoing', color: 'green' },
    { value: 'completed', label: 'Completed', color: 'gray' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const sessionsRef = collection(db, 'scientist_sessions');
      const q = query(sessionsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSession) {
        await updateDoc(doc(db, 'scientist_sessions', editingSession.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'scientist_sessions'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setShowForm(false);
      setEditingSession(null);
      resetForm();
      loadSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteDoc(doc(db, 'scientist_sessions', id));
        loadSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title || { en: '', si: '', ta: '' },
      description: session.description || { en: '', si: '', ta: '' },
      presenter: session.presenter || {
        name: '',
        designation: '',
        division: '',
        photo: ''
      },
      date: session.date || '',
      time: session.time || '',
      duration: session.duration || '60',
      venue: session.venue || 'NARA Auditorium',
      format: session.format || 'in-person',
      status: session.status || 'upcoming',
      topics: session.topics || [],
      registrationUrl: session.registrationUrl || '',
      recordingUrl: session.recordingUrl || '',
      maxParticipants: session.maxParticipants || 100,
      currentParticipants: session.currentParticipants || 0
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', si: '', ta: '' },
      description: { en: '', si: '', ta: '' },
      presenter: {
        name: '',
        designation: '',
        division: '',
        photo: ''
      },
      date: '',
      time: '',
      duration: '60',
      venue: 'NARA Auditorium',
      format: 'in-person',
      status: 'upcoming',
      topics: [],
      registrationUrl: '',
      recordingUrl: '',
      maxParticipants: 100,
      currentParticipants: 0
    });
  };

  const filteredSessions = sessions.filter(item => {
    const matchesSearch = item.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.presenter?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-8 px-6">
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
                <FlaskConical size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Scientist Sessions</h1>
                <p className="text-white/70">Manage scientific presentations and seminars</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingSession(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <Plus size={20} />
              Schedule Session
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
                placeholder="Search sessions or presenters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={loadSessions}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{sessions.filter(s => s.status === 'upcoming').length}</div>
            <div className="text-sm text-gray-500">Upcoming Sessions</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{sessions.filter(s => s.status === 'ongoing').length}</div>
            <div className="text-sm text-gray-500">Ongoing</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{sessions.filter(s => s.status === 'completed').length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{sessions.length}</div>
            <div className="text-sm text-gray-500">Total Sessions</div>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <FlaskConical className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No sessions found</h3>
            <p className="text-gray-500 mt-2">Schedule your first scientist session</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSessions.map((item) => (
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
                        item.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                        item.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                        {item.format === 'virtual' && <Video size={12} />}
                        {item.format === 'in-person' && <Users size={12} />}
                        {item.format === 'hybrid' && <Presentation size={12} />}
                        {item.format?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title?.en}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <GraduationCap size={16} className="text-purple-600" />
                      <span className="text-sm text-gray-700 font-medium">{item.presenter?.name}</span>
                      <span className="text-sm text-gray-500">- {item.presenter?.division}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {item.time} ({item.duration} min)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {item.venue}
                      </span>
                      {item.maxParticipants && (
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {item.currentParticipants || 0}/{item.maxParticipants} registered
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.recordingUrl && (
                      <a
                        href={item.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-purple-50 rounded-lg transition"
                        title="View Recording"
                      >
                        <Video size={18} className="text-purple-600" />
                      </a>
                    )}
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
                  {editingSession ? 'Edit Session' : 'Schedule New Session'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Title (English) *</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData({...formData, title: {...formData.title, en: e.target.value}})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Presenter Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap size={18} />
                    Presenter Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                      <input
                        type="text"
                        value={formData.presenter.name}
                        onChange={(e) => setFormData({...formData, presenter: {...formData.presenter, name: e.target.value}})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.presenter.designation}
                        onChange={(e) => setFormData({...formData, presenter: {...formData.presenter, designation: e.target.value}})}
                        placeholder="e.g., Senior Research Officer"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Division</label>
                    <select
                      value={formData.presenter.division}
                      onChange={(e) => setFormData({...formData, presenter: {...formData.presenter, division: e.target.value}})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Division</option>
                      {divisions.map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date, Time, Duration */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                {/* Venue, Format, Status */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({...formData, venue: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({...formData, format: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {formatOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Recording URL (for completed sessions) */}
                {formData.status === 'completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recording URL</label>
                    <input
                      type="url"
                      value={formData.recordingUrl}
                      onChange={(e) => setFormData({...formData, recordingUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

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
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    <Save size={18} />
                    {editingSession ? 'Update' : 'Schedule'} Session
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

export default ScientistSessionAdmin;
