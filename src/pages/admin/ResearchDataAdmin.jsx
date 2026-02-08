import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Save, X, LogOut, FileText, Users, Target,
  Globe, CheckCircle, AlertCircle, Search, Download, Upload
} from 'lucide-react';
import { auth, db } from '../../firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy 
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PublicationForm from './forms/PublicationForm';
import ProjectForm from './forms/ProjectForm';
import PartnerForm from './forms/PartnerForm';
import TeamForm from './forms/TeamForm';

const ResearchDataAdmin = () => {
  const [activeTab, setActiveTab] = useState('publications');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Data states
  const [publications, setPublications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [teams, setTeams] = useState([]);

  const tabs = [
    { id: 'publications', label: 'Publications', icon: FileText, color: 'cyan', collection: 'publications' },
    { id: 'projects', label: 'Projects', icon: Target, color: 'blue', collection: 'projects' },
    { id: 'partners', label: 'Partners', icon: Globe, color: 'purple', collection: 'partners' },
    { id: 'teams', label: 'Teams', icon: Users, color: 'green', collection: 'teams' }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      const q = query(collection(db, currentTab.collection), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      switch(activeTab) {
        case 'publications':
          setPublications(data);
          break;
        case 'projects':
          setProjects(data);
          break;
        case 'partners':
          setPartners(data);
          break;
        case 'teams':
          setTeams(data);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorMessage('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async (data) => {
    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        await updateDoc(doc(db, currentTab.collection, editingItem.id), dataWithTimestamp);
        setSuccessMessage(`${currentTab.label.slice(0, -1)} updated successfully!`);
      } else {
        await addDoc(collection(db, currentTab.collection), {
          ...dataWithTimestamp,
          createdAt: new Date().toISOString()
        });
        setSuccessMessage(`${currentTab.label.slice(0, -1)} added successfully!`);
      }

      setShowAddForm(false);
      setEditingItem(null);
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setErrorMessage('Failed to save. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const currentTab = tabs.find(t => t.id === activeTab);
      await deleteDoc(doc(db, currentTab.collection, id));
      setSuccessMessage('Item deleted successfully!');
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting:', error);
      setErrorMessage('Failed to delete. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const getCurrentData = () => {
    let data;
    switch(activeTab) {
      case 'publications': data = publications; break;
      case 'projects': data = projects; break;
      case 'partners': data = partners; break;
      case 'teams': data = teams; break;
      default: data = [];
    }

    if (searchTerm) {
      return data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  };

  const renderForm = () => {
    const formProps = {
      initialData: editingItem,
      onSave: handleSave,
      onCancel: () => {
        setShowAddForm(false);
        setEditingItem(null);
      },
      loading
    };

    switch(activeTab) {
      case 'publications':
        return <PublicationForm {...formProps} />;
      case 'projects':
        return <ProjectForm {...formProps} />;
      case 'partners':
        return <PartnerForm {...formProps} />;
      case 'teams':
        return <TeamForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-white/95 to-blue-50/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Research Data Admin</h1>
              <p className="text-sm text-slate-500">Manage NARA research information</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-green-50 border border-green-500/50 text-green-700 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-500/50 text-red-700 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowAddForm(false);
                setEditingItem(null);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-${tab.color}-500/20 border-${tab.color}-500/50 text-${tab.color}-300 border`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-xs">
                {getCurrentData().length}
              </span>
            </button>
          ))}
        </div>

        {/* Add/Search Bar */}
        {!showAddForm && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#003366] to-[#0066CC] text-white font-semibold hover:shadow-lg shadow-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
            </button>
            
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
              />
            </div>
          </div>
        )}

        {/* Form */}
        <AnimatePresence mode="wait">
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              {renderForm()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data List */}
        {!showAddForm && (
          <div className="space-y-4">
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : getCurrentData().length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No {activeTab} found. Click "Add New" to create one.</p>
              </div>
            ) : (
              getCurrentData().map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-xl bg-white backdrop-blur-xl border border-slate-200 hover:border-[#0066CC]/30 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {item.title || item.name}
                      </h3>
                      <div className="text-sm text-slate-500 space-y-1">
                        {activeTab === 'publications' && (
                          <>
                            <p>Authors: {Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</p>
                            <p>Journal: {item.journal} | Year: {item.year}</p>
                            <p>Citations: {item.citations || 0} | Downloads: {item.downloads || 0}</p>
                          </>
                        )}
                        {activeTab === 'projects' && (
                          <>
                            <p>PI: {item.pi} | Category: {item.category}</p>
                            <p>Status: {item.status} | Progress: {item.progress}%</p>
                            <p>Budget: {item.budget} | Team: {item.team} members</p>
                          </>
                        )}
                        {activeTab === 'partners' && (
                          <>
                            <p>Country: {item.country} | Region: {item.region}</p>
                            <p>Joint Publications: {item.jointPublications} | Active Projects: {item.activeProjects}</p>
                            <p>Contact: {item.contactName} | {item.contactEmail}</p>
                          </>
                        )}
                        {activeTab === 'teams' && (
                          <>
                            <p>Leader: {item.lead} | Members: {item.members}</p>
                            <p>Projects: {item.projects} | Publications: {item.publications}</p>
                            <p>Funding: {item.funding}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDataAdmin;
