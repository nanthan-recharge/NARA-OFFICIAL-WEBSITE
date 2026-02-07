import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  X,
  Database,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  FileSpreadsheet
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SchoolAdminPanel = ({ isOpen, onClose, databases }) => {
  const { t } = useTranslation('aquaSchool');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingDatabase, setEditingDatabase] = useState(null);
  const [newDatabaseUrl, setNewDatabaseUrl] = useState('');

  const handleClose = () => {
    setActiveTab('overview');
    setEditingDatabase(null);
    setNewDatabaseUrl('');
    onClose();
  };

  const handleEditDatabase = (dbKey) => {
    setEditingDatabase(dbKey);
    setNewDatabaseUrl(databases[dbKey].url || '');
  };

  const handleSaveDatabase = () => {
    // Here you would save the new URL to your backend/database
    console.log('Saving database URL:', editingDatabase, newDatabaseUrl);
    // For now, we'll just close the edit mode
    setEditingDatabase(null);
    setNewDatabaseUrl('');
  };

  const handleDeleteDatabase = (dbKey) => {
    if (confirm(t('admin.confirmDelete', 'Are you sure you want to delete this database?'))) {
      console.log('Deleting database:', dbKey);
      // Implement delete logic
    }
  };

  const handleRefreshDatabase = (dbKey) => {
    console.log('Refreshing database:', dbKey);
    // Implement refresh logic
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[80vh] bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t('admin.title', 'School Database Admin')}</h2>
              <p className="text-sm text-slate-400">{t('admin.subtitle', 'Manage school databases and configurations')}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/50">
          {[
            { key: 'overview', label: t('admin.tabs.overview', 'Overview'), icon: Eye },
            { key: 'databases', label: t('admin.tabs.databases', 'Databases'), icon: Database },
            { key: 'settings', label: t('admin.tabs.settings', 'Settings'), icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">{t('admin.overview.title', 'System Overview')}</h3>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: t('admin.stats.totalDatabases', 'Total Databases'), value: Object.keys(databases).length, color: 'from-blue-500 to-purple-500' },
                  { label: t('admin.stats.activeDatabases', 'Active Databases'), value: Object.values(databases).filter(db => db.url).length, color: 'from-green-500 to-teal-500' },
                  { label: t('admin.stats.pendingDatabases', 'Pending Databases'), value: Object.values(databases).filter(db => !db.url).length, color: 'from-orange-500 to-red-500' }
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white font-space">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-base font-bold text-white mb-3">{t('admin.recentActivity', 'Recent Activity')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('admin.activity.uploadSuccess', 'Aqua School database updated successfully')}</span>
                    <span className="text-slate-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span>{t('admin.activity.pendingUpload', '11th Grade Schools database pending upload')}</span>
                    <span className="text-slate-500">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{t('admin.activity.systemUpdate', 'System configuration updated')}</span>
                    <span className="text-slate-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'databases' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t('admin.databases.title', 'Database Management')}</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.addDatabase', 'Add Database')}</span>
                </button>
              </div>

              {/* Database List */}
              <div className="space-y-4">
                {Object.entries(databases).map(([key, db]) => {
                  const Icon = db.icon;
                  const isEditing = editingDatabase === key;
                  
                  return (
                    <div key={key} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${db.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{db.name}</h4>
                            <p className="text-sm text-slate-400">{db.description}</p>
                            {isEditing ? (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="url"
                                  value={newDatabaseUrl}
                                  onChange={(e) => setNewDatabaseUrl(e.target.value)}
                                  placeholder={t('admin.enterUrl', 'Enter database URL...')}
                                  className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm focus:border-cyan-500 focus:outline-none"
                                />
                                <button
                                  onClick={handleSaveDatabase}
                                  className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                                >
                                  {t('actions.save', 'Save')}
                                </button>
                                <button
                                  onClick={() => setEditingDatabase(null)}
                                  className="px-3 py-1 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors"
                                >
                                  {t('actions.cancel', 'Cancel')}
                                </button>
                              </div>
                            ) : (
                              <div className="mt-1 flex items-center gap-2">
                                {db.url ? (
                                  <div className="flex items-center gap-1 text-xs text-green-400">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{t('admin.status.active', 'Active')}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{t('admin.status.pending', 'Pending')}</span>
                                  </div>
                                )}
                                {db.url && (
                                  <a
                                    href={db.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                                  >
                                    <Globe className="w-3 h-3" />
                                    <span>{t('admin.viewSource', 'View Source')}</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditDatabase(key)}
                              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                              title={t('admin.edit', 'Edit')}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {db.url && (
                              <button
                                onClick={() => handleRefreshDatabase(key)}
                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                title={t('admin.refresh', 'Refresh')}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDatabase(key)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                              title={t('admin.delete', 'Delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">{t('admin.settings.title', 'System Settings')}</h3>
              
              {/* Settings Sections */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h4 className="font-bold text-white mb-3">{t('admin.settings.cache', 'Cache Settings')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{t('admin.settings.cacheDuration', 'Cache Duration')}</span>
                      <select className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm">
                        <option value="1">1 hour</option>
                        <option value="24" selected>24 hours</option>
                        <option value="168">1 week</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{t('admin.settings.autoRefresh', 'Auto Refresh')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <h4 className="font-bold text-white mb-3">{t('admin.settings.notifications', 'Notifications')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{t('admin.settings.emailAlerts', 'Email Alerts')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{t('admin.settings.systemAlerts', 'System Alerts')}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/50">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {t('actions.close', 'Close')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolAdminPanel;
