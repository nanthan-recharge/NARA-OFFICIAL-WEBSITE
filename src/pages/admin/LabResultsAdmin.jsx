import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import {
  labResultsService,
  sampleTrackingService,
  testMethodologiesService,
  labResultsDashboardService
} from '../../services/labResultsService';

const LabResultsAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [results, setResults] = useState([]);
  const [samples, setSamples] = useState([]);
  const [methodologies, setMethodologies] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, resultsResult, samplesResult, methodologiesResult] = await Promise.all([
        labResultsDashboardService.getStatistics(),
        labResultsService.getAll({ limit: 100 }),
        sampleTrackingService.getAll({ limit: 100 }),
        testMethodologiesService.getAll()
      ]);

      if (statsResult.data) setStatistics(statsResult.data);
      if (resultsResult.data) setResults(resultsResult.data);
      if (samplesResult.data) setSamples(samplesResult.data);
      if (methodologiesResult.data) setMethodologies(methodologiesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let result;

      if (modalType === 'result') {
        const resultData = {
          testType: data.testType,
          sampleType: data.sampleType,
          sampleId: data.sampleId,
          parameters: data.parameters,
          results: data.results,
          methodology: data.methodology,
          status: data.status,
          testDate: data.testDate ? Timestamp.fromDate(new Date(data.testDate)) : Timestamp.now(),
          completedDate: data.completedDate ? Timestamp.fromDate(new Date(data.completedDate)) : null,
          userId: data.userId || '',
          projectId: data.projectId || '',
          location: data.location || '',
          notes: data.notes || ''
        };

        if (editingItem) {
          result = await labResultsService.update(editingItem.id, resultData);
        } else {
          result = await labResultsService.create(resultData);
        }
      } else if (modalType === 'sample') {
        const sampleData = {
          sampleType: data.sampleType,
          location: data.location,
          submittedBy: data.submittedBy,
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          requestedTests: data.requestedTests ? data.requestedTests.split(',').map(t => t.trim()) : [],
          priority: data.priority || 'normal',
          status: data.status,
          notes: data.notes || ''
        };

        if (editingItem) {
          result = await sampleTrackingService.updateStatus(editingItem.id, data.status, data.notes || '');
        } else {
          result = await sampleTrackingService.create(sampleData);
        }
      } else if (modalType === 'methodology') {
        const methodologyData = {
          name: { en: data.name, si: data.name_si || '', ta: data.name_ta || '' },
          description: { en: data.description, si: data.description_si || '', ta: data.description_ta || '' },
          category: data.category,
          procedures: data.procedures ? data.procedures.split('\n').filter(p => p.trim()) : [],
          equipment: data.equipment ? data.equipment.split(',').map(e => e.trim()) : [],
          reagents: data.reagents ? data.reagents.split(',').map(r => r.trim()) : [],
          standards: data.standards ? data.standards.split(',').map(s => s.trim()) : [],
          turnAroundTime: data.turnAroundTime || '',
          accredited: data.accredited === 'true'
        };

        if (editingItem) {
          result = await testMethodologiesService.update(editingItem.id, methodologyData);
        } else {
          result = await testMethodologiesService.create(methodologyData);
        }
      }

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} ${editingItem ? 'updated' : 'created'} successfully!`);
        closeModal();
        loadData();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      let result;
      if (type === 'result') {
        result = await labResultsService.delete(id);
      } else if (type === 'sample') {
        result = await sampleTrackingService.delete(id);
      } else if (type === 'methodology') {
        result = await testMethodologiesService.delete(id);
      }

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
        loadData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      submitted: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      received: 'bg-purple-100 text-purple-800 border-purple-300',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { id: 'results', label: 'Lab Results', icon: Icons.FlaskConical },
    { id: 'samples', label: 'Samples', icon: Icons.TestTube },
    { id: 'methodologies', label: 'Methodologies', icon: Icons.BookOpen }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-slate-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Icons.FlaskConical className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Lab Results Admin</h1>
              <p className="text-blue-100 mt-2">Manage laboratory results, samples, and methodologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#0066CC] border-b-4 border-[#0066CC] bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Statistics Cards */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.FlaskConical className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.results?.total || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Total Results</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.CheckCircle className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.results?.completed || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Completed</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.Clock className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.results?.pending || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Pending</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.TestTube className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.samples?.total || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Total Samples</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Results */}
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Icons.Activity className="w-6 h-6 text-[#0066CC]" />
                    Recent Results
                  </h3>
                  <div className="space-y-3">
                    {statistics?.recentResults?.slice(0, 5).map((result, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-slate-900 font-medium">{result.testType}</div>
                            <div className="text-sm text-slate-500 mt-1">{result.sampleId}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!statistics?.recentResults || statistics.recentResults.length === 0) && (
                      <div className="text-slate-500 text-center py-8">No recent results</div>
                    )}
                  </div>
                </div>

                {/* Recent Samples */}
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Icons.TestTube className="w-6 h-6 text-purple-400" />
                    Recent Samples
                  </h3>
                  <div className="space-y-3">
                    {statistics?.recentSamples?.slice(0, 5).map((sample, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-slate-900 font-medium">{sample.sampleId}</div>
                            <div className="text-sm text-slate-500 mt-1">{sample.sampleType}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(sample.status)}`}>
                            {sample.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!statistics?.recentSamples || statistics.recentSamples.length === 0) && (
                      <div className="text-slate-500 text-center py-8">No recent samples</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results View */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Lab Results</h2>
                <button
                  onClick={() => openModal('result')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Icons.Plus className="w-5 h-5" />
                  Add Result
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sample ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Test Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sample Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Test Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {results.map((result) => (
                        <tr key={result.id} className="hover:bg-slate-100/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-900">{result.sampleId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{result.testType}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{result.sampleType}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(result.status)}`}>
                              {result.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {result.testDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openModal('result', result)}
                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              >
                                <Icons.Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('result', result.id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <Icons.Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {results.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                            No results found. Click "Add Result" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Samples View */}
          {activeTab === 'samples' && (
            <motion.div
              key="samples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Sample Tracking</h2>
                <button
                  onClick={() => openModal('sample')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Icons.Plus className="w-5 h-5" />
                  Add Sample
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sample ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Sample Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Submitted By</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Submission Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {samples.map((sample) => (
                        <tr key={sample.id} className="hover:bg-slate-100/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-900 font-mono">{sample.sampleId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{sample.sampleType}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{sample.location}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{sample.submittedBy}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(sample.status)}`}>
                              {sample.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {sample.submissionDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openModal('sample', sample)}
                                className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                              >
                                <Icons.Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('sample', sample.id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <Icons.Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {samples.length === 0 && (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                            No samples found. Click "Add Sample" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Methodologies View */}
          {activeTab === 'methodologies' && (
            <motion.div
              key="methodologies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Test Methodologies</h2>
                <button
                  onClick={() => openModal('methodology')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Icons.Plus className="w-5 h-5" />
                  Add Methodology
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methodologies.map((methodology) => (
                  <div key={methodology.id} className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <Icons.BookOpen className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{methodology.name?.en || 'Unnamed'}</h3>
                          <div className="text-sm text-slate-500 mt-1">{methodology.category}</div>
                        </div>
                      </div>
                      {methodology.accredited && (
                        <div className="px-3 py-1 bg-green-50 text-green-400 text-xs font-medium rounded-full">
                          Accredited
                        </div>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {methodology.description?.en || 'No description'}
                    </p>

                    <div className="space-y-2 mb-4">
                      {methodology.turnAroundTime && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Icons.Clock className="w-4 h-4" />
                          <span>TAT: {methodology.turnAroundTime}</span>
                        </div>
                      )}
                      {methodology.equipment && methodology.equipment.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Icons.Wrench className="w-4 h-4" />
                          <span>{methodology.equipment.length} equipment</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => openModal('methodology', methodology)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('methodology', methodology.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {methodologies.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    No methodologies found. Click "Add Methodology" to create one.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </h3>
                <button onClick={closeModal} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Result Form */}
                {modalType === 'result' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Test Type *</label>
                        <input
                          type="text"
                          name="testType"
                          defaultValue={editingItem?.testType || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., Water Quality Analysis"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Sample Type *</label>
                        <input
                          type="text"
                          name="sampleType"
                          defaultValue={editingItem?.sampleType || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., Seawater"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Sample ID *</label>
                        <input
                          type="text"
                          name="sampleId"
                          defaultValue={editingItem?.sampleId || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., SMP-2025-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Status *</label>
                        <select
                          name="status"
                          defaultValue={editingItem?.status || 'pending'}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Parameters *</label>
                      <input
                        type="text"
                        name="parameters"
                        defaultValue={editingItem?.parameters || ''}
                        required
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g., pH, Temperature, Salinity"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Results *</label>
                      <textarea
                        name="results"
                        defaultValue={editingItem?.results || ''}
                        required
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter test results..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Test Date</label>
                        <input
                          type="date"
                          name="testDate"
                          defaultValue={editingItem?.testDate?.toDate?.()?.toISOString().split('T')[0] || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Completed Date</label>
                        <input
                          type="date"
                          name="completedDate"
                          defaultValue={editingItem?.completedDate?.toDate?.()?.toISOString().split('T')[0] || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          defaultValue={editingItem?.location || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="e.g., Negombo Lagoon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Methodology</label>
                        <input
                          type="text"
                          name="methodology"
                          defaultValue={editingItem?.methodology || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Test methodology used"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Notes</label>
                      <textarea
                        name="notes"
                        defaultValue={editingItem?.notes || ''}
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Additional notes..."
                      />
                    </div>
                  </>
                )}

                {/* Sample Form */}
                {modalType === 'sample' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Sample Type *</label>
                        <input
                          type="text"
                          name="sampleType"
                          defaultValue={editingItem?.sampleType || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="e.g., Seawater, Fish Tissue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Location *</label>
                        <input
                          type="text"
                          name="location"
                          defaultValue={editingItem?.location || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="Sample collection location"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Submitted By *</label>
                        <input
                          type="text"
                          name="submittedBy"
                          defaultValue={editingItem?.submittedBy || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="Researcher/Organization name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Priority</label>
                        <select
                          name="priority"
                          defaultValue={editingItem?.priority || 'normal'}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          defaultValue={editingItem?.contactEmail || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          defaultValue={editingItem?.contactPhone || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Status *</label>
                      <select
                        name="status"
                        defaultValue={editingItem?.status || 'submitted'}
                        required
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="received">Received</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Requested Tests</label>
                      <input
                        type="text"
                        name="requestedTests"
                        defaultValue={editingItem?.requestedTests?.join(', ') || ''}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="Comma-separated test names"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Notes</label>
                      <textarea
                        name="notes"
                        defaultValue={editingItem?.notes || ''}
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="Additional notes or special instructions..."
                      />
                    </div>
                  </>
                )}

                {/* Methodology Form */}
                {modalType === 'methodology' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Name (English) *</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingItem?.name?.en || ''}
                        required
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Methodology name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Name (Sinhala)</label>
                        <input
                          type="text"
                          name="name_si"
                          defaultValue={editingItem?.name?.si || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="නම සිංහලෙන්"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Name (Tamil)</label>
                        <input
                          type="text"
                          name="name_ta"
                          defaultValue={editingItem?.name?.ta || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="பெயர் தமிழில்"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Description (English) *</label>
                      <textarea
                        name="description"
                        defaultValue={editingItem?.description?.en || ''}
                        required
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Methodology description"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Description (Sinhala)</label>
                        <textarea
                          name="description_si"
                          defaultValue={editingItem?.description?.si || ''}
                          rows="3"
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="විස්තරය සිංහලෙන්"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Description (Tamil)</label>
                        <textarea
                          name="description_ta"
                          defaultValue={editingItem?.description?.ta || ''}
                          rows="3"
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="விளக்கம் தமிழில்"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Category *</label>
                        <input
                          type="text"
                          name="category"
                          defaultValue={editingItem?.category || ''}
                          required
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="e.g., Chemical Analysis"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Turn Around Time</label>
                        <input
                          type="text"
                          name="turnAroundTime"
                          defaultValue={editingItem?.turnAroundTime || ''}
                          className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          placeholder="e.g., 3-5 business days"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Procedures (one per line)</label>
                      <textarea
                        name="procedures"
                        defaultValue={editingItem?.procedures?.join('\n') || ''}
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Step 1&#10;Step 2&#10;Step 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Equipment (comma-separated)</label>
                      <input
                        type="text"
                        name="equipment"
                        defaultValue={editingItem?.equipment?.join(', ') || ''}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Spectrophotometer, Centrifuge, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Reagents (comma-separated)</label>
                      <input
                        type="text"
                        name="reagents"
                        defaultValue={editingItem?.reagents?.join(', ') || ''}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Buffer solution, NaCl, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Standards (comma-separated)</label>
                      <input
                        type="text"
                        name="standards"
                        defaultValue={editingItem?.standards?.join(', ') || ''}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="ISO 17025, EPA Method, etc."
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-slate-600">
                        <input
                          type="checkbox"
                          name="accredited"
                          value="true"
                          defaultChecked={editingItem?.accredited || false}
                          className="w-5 h-5 rounded bg-slate-100 border-slate-300 text-green-600 focus:ring-2 focus:ring-green-500"
                        />
                        <span className="font-medium">Accredited Methodology</span>
                      </label>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingItem ? 'Update' : 'Create'}
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

export default LabResultsAdmin;
