import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, BarChart3, Bell, Search, Filter, Download, Database, Cloud, Activity, CheckCircle, Eye, Edit, Trash2, RefreshCw, LogOut, Globe, Waves, Fish, UserCheck, Mail, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import ParticleSystem from '../../components/shared/ParticleSystem';
import GlassMorphismCard from '../../components/shared/GlassMorphismCard';
import RealTimeCounter from '../../components/shared/RealTimeCounter';
import firebaseAdminService from '../../services/firebaseAdminService';
import Icon from '../../components/AppIcon';


const FirebaseAdminDashboardControlCenter = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isAdmin, getAdminPermissions } = useFirebaseAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, active: 0, admins: 0 },
    content: { articles: 0, published: 0, drafts: 0 },
    applications: { total: 0, pending: 0, approved: 0 },
    system: { uptime: '99.9%', health: 'excellent', lastBackup: null }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // Check admin permissions
  useEffect(() => {
    if (!user) {
      navigate('/firebase-admin-authentication-portal');
      return;
    }

    if (!isAdmin()) {
      navigate('/firebase-admin-authentication-portal');
      return;
    }

    loadDashboardData();
  }, [user, navigate, isAdmin]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load system analytics
      const analytics = await firebaseAdminService?.getSystemAnalytics();
      
      // Load users
      const users = await firebaseAdminService?.getAllUsers();
      
      // Load applications
      const applications = await firebaseAdminService?.getApplications();
      
      // Load system logs
      const logs = await firebaseAdminService?.getSystemLogs(50);

      setDashboardData({
        users: {
          total: analytics?.combined?.totalUsers || 0,
          active: analytics?.combined?.activeUsers || 0,
          admins: users?.filter(u => u?.role === 'admin')?.length || 0
        },
        content: {
          articles: analytics?.supabase?.totalProjects || 0,
          published: analytics?.supabase?.activeProjects || 0,
          drafts: (analytics?.supabase?.totalProjects || 0) - (analytics?.supabase?.activeProjects || 0)
        },
        applications: {
          total: applications?.length || 0,
          pending: applications?.filter(app => app?.status === 'submitted' || app?.status === 'under_review')?.length || 0,
          approved: applications?.filter(app => app?.status === 'approved')?.length || 0
        },
        system: {
          uptime: '99.9%',
          health: 'excellent',
          lastBackup: new Date()?.toISOString()
        }
      });

      setAllUsers(users || []);
      setAllApplications(applications || []);
      setSystemLogs(logs || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user management actions
  const handleUserAction = async (action, userId, data = {}) => {
    try {
      switch (action) {
        case 'deactivate':
          await firebaseAdminService?.deactivateUser(userId);
          break;
        case 'update':
          await firebaseAdminService?.updateUser(userId, data);
          break;
      }
      
      // Reload data
      await loadDashboardData();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  // Handle application status updates
  const handleApplicationAction = async (applicationId, type, status, comments = '') => {
    try {
      await firebaseAdminService?.updateApplicationStatus(applicationId, type, status, comments);
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/firebase-admin-authentication-portal');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Filter users based on search
  const filteredUsers = allUsers?.filter(user => 
    user?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.role?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  // Filter applications based on search
  const filteredApplications = allApplications?.filter(app => 
    app?.user_profiles?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.user_profiles?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    app?.status?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-ocean-600">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-ocean-100 to-cyan-50 relative">
      {/* Particle System Background */}
      <ParticleSystem 
        particleCount={100}
        colors={['#0891b2', '#0e7490', '#155e75']}
        maxSize={3}
        speed={0.3}
      />
      {/* Ocean-themed decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-32 text-ocean-200/10"
        >
          <Fish className="w-24 h-24" />
        </motion.div>
        
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-40 left-20 text-cyan-200/10"
        >
          <Waves className="w-28 h-28" />
        </motion.div>
      </div>
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-ocean-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Back + Home + Logo and Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/'); }}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ocean-200 text-ocean-700 hover:bg-ocean-50"
                  aria-label="Go back"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Back
                </button>
                <a href="/" className="inline-flex items-center" aria-label="Home">
                  <img src="/assets/nara-logo.png" alt="NARA logo" className="w-8 h-8 object-contain mr-2" />
                </a>
                <div className="w-10 h-10 bg-gradient-to-br from-ocean-600 to-ocean-800 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 font-space-grotesk">Admin Control Center</h1>
                  <p className="text-sm text-ocean-600">Firebase & Supabase Management</p>
                </div>
              </div>

              {/* User Info and Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">{profile?.full_name}</span>
                  <span className="px-2 py-1 bg-ocean-100 text-ocean-800 rounded-full text-xs font-medium">
                    {profile?.role}
                  </span>
                </div>
                
                <button className="relative p-2 text-gray-600 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Statistics */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Users Statistics */}
              <GlassMorphismCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <RealTimeCounter
                      end={dashboardData?.users?.total}
                      duration={2000}
                      className="text-2xl font-bold text-gray-800"
                    />
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active: {dashboardData?.users?.active}</span>
                  <span className="text-gray-600">Admins: {dashboardData?.users?.admins}</span>
                </div>
              </GlassMorphismCard>

              {/* Content Statistics */}
              <GlassMorphismCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <RealTimeCounter
                      end={dashboardData?.content?.articles}
                      duration={2000}
                      className="text-2xl font-bold text-gray-800"
                    />
                    <p className="text-sm text-gray-600">Projects</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active: {dashboardData?.content?.published}</span>
                  <span className="text-gray-600">Inactive: {dashboardData?.content?.drafts}</span>
                </div>
              </GlassMorphismCard>

              {/* Applications Statistics */}
              <GlassMorphismCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <RealTimeCounter
                      end={dashboardData?.applications?.total}
                      duration={2000}
                      className="text-2xl font-bold text-gray-800"
                    />
                    <p className="text-sm text-gray-600">Applications</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending: {dashboardData?.applications?.pending}</span>
                  <span className="text-gray-600">Approved: {dashboardData?.applications?.approved}</span>
                </div>
              </GlassMorphismCard>

              {/* System Health */}
              <GlassMorphismCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">
                      {dashboardData?.system?.uptime}
                    </div>
                    <p className="text-sm text-gray-600">System Uptime</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status: {dashboardData?.system?.health}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Online</span>
                  </div>
                </div>
              </GlassMorphismCard>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-1 bg-white/50 rounded-lg backdrop-blur-sm">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'content', label: 'Content Management', icon: FileText },
                { id: 'applications', label: 'Applications', icon: Target },
                { id: 'system', label: 'System Analytics', icon: Activity },
                { id: 'cloud-functions', label: 'Cloud Functions', icon: Cloud }
              ]?.map((tab) => {
                const Icon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab?.id
                        ? 'bg-ocean-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-ocean-600 hover:bg-ocean-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab?.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <GlassMorphismCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                        <Database className="w-6 h-6 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium text-blue-800">Backup Data</div>
                          <div className="text-sm text-blue-600">Create system backup</div>
                        </div>
                      </button>
                      
                      <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200">
                        <Mail className="w-6 h-6 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium text-green-800">Send Notification</div>
                          <div className="text-sm text-green-600">Broadcast to users</div>
                        </div>
                      </button>
                      
                      <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
                        <Download className="w-6 h-6 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium text-purple-800">Export Reports</div>
                          <div className="text-sm text-purple-600">Generate analytics</div>
                        </div>
                      </button>
                    </div>
                  </GlassMorphismCard>

                  {/* Recent Activity */}
                  <GlassMorphismCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent System Activity</h3>
                      <button className="text-sm text-ocean-600 hover:text-ocean-800 font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {systemLogs?.slice(0, 5)?.map((log, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-ocean-500 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{log?.action}</div>
                            <div className="text-sm text-gray-600">
                              {log?.timestamp?.toDate?.()?.toLocaleString() || 'Recent'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassMorphismCard>
                </div>
              )}

              {activeTab === 'users' && (
                <GlassMorphismCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e?.target?.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers?.slice(0, 10)?.map((user) => (
                          <tr key={user?.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-800">{user?.full_name}</div>
                                <div className="text-sm text-gray-600">{user?.email}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user?.role === 'admin' ?'bg-red-100 text-red-800'
                                  : user?.role === 'senior_researcher' ?'bg-blue-100 text-blue-800' :'bg-gray-100 text-gray-800'
                              }`}>
                                {user?.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  user?.is_active ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                <span className="text-sm">
                                  {user?.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(user.created_at)?.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleUserAction('deactivate', user?.id)}
                                  className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassMorphismCard>
              )}

              {activeTab === 'applications' && (
                <GlassMorphismCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Application Management</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search applications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e?.target?.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications?.slice(0, 10)?.map((application) => (
                          <tr key={application?.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-800">
                                  {application?.user_profiles?.full_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {application?.user_profiles?.email}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application?.type === 'collaboration' ?'bg-blue-100 text-blue-800' :'bg-green-100 text-green-800'
                              }`}>
                                {application?.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                application?.status === 'approved' ?'bg-green-100 text-green-800'
                                  : application?.status === 'rejected' ?'bg-red-100 text-red-800' :'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application?.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(application.created_at)?.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleApplicationAction(application?.id, application?.type, 'approved')}
                                  className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassMorphismCard>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <GlassMorphismCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health Monitoring</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">99.9%</div>
                        <div className="text-sm text-gray-600">System Uptime</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Database className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">Active</div>
                        <div className="text-sm text-gray-600">Database Status</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Cloud className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">Optimal</div>
                        <div className="text-sm text-gray-600">Cloud Functions</div>
                      </div>
                    </div>
                  </GlassMorphismCard>
                </div>
              )}

              {activeTab === 'cloud-functions' && (
                <GlassMorphismCard className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Cloud Functions Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">Email Notifications</h4>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Handles automated email notifications to users</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          Test
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          Logs
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800">Data Backup</h4>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Creates automated backups of system data</p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          Execute
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassMorphismCard>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default FirebaseAdminDashboardControlCenter;