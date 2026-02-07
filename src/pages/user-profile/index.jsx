import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateUserProfile, signOut } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    organization: user?.organization || '',
    bio: user?.bio || ''
  });

  // Role configuration
  const roleConfig = {
    student: {
      icon: Icons.GraduationCap,
      title: 'Student',
      color: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-100 text-blue-700'
    },
    researcher: {
      icon: Icons.Microscope,
      title: 'Researcher / Faculty',
      color: 'from-purple-500 to-pink-500',
      badge: 'bg-purple-100 text-purple-700'
    },
    professor: {
      icon: Icons.Award,
      title: 'Professor / Senior Researcher',
      color: 'from-amber-500 to-orange-500',
      badge: 'bg-amber-100 text-amber-700'
    },
    public: {
      icon: Icons.Users,
      title: 'Public Member',
      color: 'from-green-500 to-teal-500',
      badge: 'bg-green-100 text-green-700'
    },
    institution: {
      icon: Icons.Building2,
      title: 'Institution / Organization',
      color: 'from-indigo-500 to-purple-500',
      badge: 'bg-indigo-100 text-indigo-700'
    }
  };

  const currentRole = roleConfig[user?.role] || roleConfig.public;
  const RoleIcon = currentRole.icon;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      organization: user?.organization || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  // Service access based on role
  const getServiceAccess = () => {
    const services = user?.services || [];
    const serviceIcons = {
      library: { icon: Icons.BookOpen, label: 'Library System', path: '/library' },
      ecommerce: { icon: Icons.ShoppingBag, label: 'Book Sales', path: '/nara-digital-marketplace' },
      images: { icon: Icons.Image, label: 'Image Sales', path: '/digital-product-library' },
      data: { icon: Icons.Database, label: 'Data Access', path: '/open-data-portal' },
      collaboration: { icon: Icons.Users, label: 'Collaboration', path: '/research-collaboration-platform' },
      bulk: { icon: Icons.Package, label: 'Bulk Licensing', path: '/nara-digital-marketplace' }
    };

    return services.map(service => serviceIcons[service]).filter(Boolean);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.User },
    { id: 'services', label: 'My Services', icon: Icons.Grid3x3 },
    { id: 'activity', label: 'Activity', icon: Icons.Activity },
    { id: 'settings', label: 'Settings', icon: Icons.Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
            <Icons.ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentRole.color} flex items-center justify-center flex-shrink-0`}>
                <RoleIcon className="w-12 h-12 text-white" />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentRole.badge}`}>
                    {currentRole.title}
                  </span>
                </div>
                <p className="text-slate-600 mb-2">{user?.email}</p>
                {user?.organization && (
                  <p className="text-slate-500 flex items-center gap-2">
                    <Icons.Building className="w-4 h-4" />
                    {user.organization}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Icons.Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
                >
                  <Icons.LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <TabIcon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Icons.Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Icons.Save className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Email</p>
                          <p className="text-slate-900">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Phone</p>
                          <p className="text-slate-900">{user?.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Organization</p>
                          <p className="text-slate-900">{user?.organization || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Member Since</p>
                          <p className="text-slate-900">
                            {user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {user?.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Bio</h3>
                        <p className="text-slate-700">{user.bio}</p>
                      </div>
                    )}

                    {/* Library Access Info */}
                    {user?.libraryAccess && (
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Library Privileges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <Icons.BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                            <p className="text-sm text-slate-600">Borrow Limit</p>
                            <p className="text-2xl font-bold text-slate-900">{user.libraryAccess.borrowLimit}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <Icons.Calendar className="w-8 h-8 text-purple-600 mb-2" />
                            <p className="text-sm text-slate-600">Loan Period</p>
                            <p className="text-2xl font-bold text-slate-900">{user.libraryAccess.loanPeriod}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <Icons.CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                            <p className="text-sm text-slate-600">Premium Access</p>
                            <p className="text-2xl font-bold text-slate-900">
                              {user.libraryAccess.canAccessPremium ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Your NARA Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getServiceAccess().map((service, index) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Link
                        key={index}
                        to={service.path}
                        className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
                      >
                        <ServiceIcon className="w-12 h-12 text-blue-600 mb-4" />
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">{service.label}</h4>
                        <p className="text-sm text-slate-600">Access your {service.label.toLowerCase()}</p>
                        <div className="mt-4 flex items-center text-blue-600 font-medium">
                          Open <Icons.ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="text-center py-12">
                  <Icons.Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No recent activity to display</p>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Email Notifications</h4>
                    <p className="text-slate-600 mb-4">Manage your email notification preferences</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Password</h4>
                    <p className="text-slate-600 mb-4">Change your account password</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h4 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h4>
                    <p className="text-red-700 mb-4">Permanently delete your account and all associated data</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
