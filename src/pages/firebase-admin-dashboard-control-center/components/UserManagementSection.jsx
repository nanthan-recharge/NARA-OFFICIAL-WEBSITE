import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Eye, Edit, Trash2, UserPlus, Mail, Phone, Calendar, Building, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import GlassMorphismCard from '../../../components/shared/GlassMorphismCard';
import firebaseAdminService from '../../../services/firebaseAdminService';

const UserManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = selectedRole !== 'all' ? { role: selectedRole } : {};
      const userData = await firebaseAdminService?.getAllUsers(filters);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId, data = {}) => {
    try {
      switch (action) {
        case 'deactivate':
          await firebaseAdminService?.deactivateUser(userId);
          break;
        case 'update':
          await firebaseAdminService?.updateUser(userId, data);
          break;
        case 'view':
          const user = users?.find(u => u?.id === userId);
          setSelectedUser(user);
          setShowUserModal(true);
          break;
      }
      
      if (action !== 'view') {
        await loadUsers();
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
  };

  const filteredUsers = users?.filter(user => 
    user?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    user?.department?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      senior_researcher: 'bg-blue-100 text-blue-800',
      researcher: 'bg-green-100 text-green-800',
      postdoc: 'bg-purple-100 text-purple-800',
      phd_student: 'bg-orange-100 text-orange-800',
      collaborator: 'bg-gray-100 text-gray-800'
    };
    return colors?.[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-space-grotesk">User Management</h2>
          <p className="text-gray-600">Manage system users, roles, and permissions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>
      {/* Search and Filters */}
      <GlassMorphismCard className="p-6" onClick={() => {}}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e?.target?.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="senior_researcher">Senior Researcher</option>
              <option value="researcher">Researcher</option>
              <option value="postdoc">Postdoc</option>
              <option value="phd_student">PhD Student</option>
              <option value="collaborator">Collaborator</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </GlassMorphismCard>
      {/* Users Table */}
      <GlassMorphismCard className="overflow-hidden" onClick={() => {}}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Users ({filteredUsers?.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{users?.filter(u => u?.is_active)?.length} active</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Last Active</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <motion.tr
                    key={user?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input 
                        type="checkbox"
                        checked={selectedUsers?.includes(user?.id)}
                        onChange={(e) => {
                          if (e?.target?.checked) {
                            setSelectedUsers([...selectedUsers, user?.id]);
                          } else {
                            setSelectedUsers(selectedUsers?.filter(id => id !== user?.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user?.full_name}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                        {user?.role?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building className="w-3 h-3" />
                        {user?.department || 'Not specified'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {user?.is_active ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.updated_at)?.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUserAction('view', user?.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user?.id)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('deactivate', user?.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedUsers?.length} user{selectedUsers?.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Export Selected
                </button>
                <button className="px-3 py-2 text-sm bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
                  Bulk Actions
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassMorphismCard>
      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{selectedUser?.full_name}</h4>
                  <p className="text-gray-600">{selectedUser?.position_title}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(selectedUser?.role)}`}>
                    {selectedUser?.role?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Contact Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser?.email}</span>
                  </div>
                  {selectedUser?.contact_info?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedUser?.contact_info?.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span>{selectedUser?.department || selectedUser?.institution || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              {selectedUser?.research_interests?.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-3">Research Interests</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser?.research_interests?.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Status */}
              <div>
                <h5 className="font-medium text-gray-800 mb-3">Account Status</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser?.is_active ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Member Since:</span>
                    <div className="mt-1 font-medium">
                      {new Date(selectedUser.created_at)?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleUserAction('update', selectedUser?.id, { is_active: !selectedUser?.is_active })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedUser?.is_active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' :'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {selectedUser?.is_active ? 'Deactivate' : 'Activate'} User
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                  Reset Password
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSection;