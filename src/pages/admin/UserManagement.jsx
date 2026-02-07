import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { userManagementService } from '../../services/userManagementService';
import { ROLE_HIERARCHY, DEPARTMENTS, USER_STATUSES, getRolesSortedByLevel, getDepartmentByCode } from '../../constants/roles';
import { AdminPageHeader, AdminStatsCard, AdminDataTable, AdminModal, AdminStatusBadge } from '../../components/admin';
import UserForm from '../../components/admin/UserForm';
import {
  Users, UserPlus, Search, Filter, Download, Upload, Building2,
  UserCheck, Clock, MoreHorizontal, Edit, Eye, UserX, UserCog, Loader2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser, profile: currentProfile } = useFirebaseAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {}, byRole: {}, byDepartment: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const roles = getRolesSortedByLevel();

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResult, statsResult] = await Promise.all([
        userManagementService.getUsers({
          department: filterDepartment || undefined,
          role: filterRole || undefined,
          status: filterStatus || undefined,
          search: searchQuery || undefined,
        }),
        userManagementService.getUserStats(),
      ]);

      setUsers(usersResult.data?.users || []);
      setStats(statsResult.data || { total: 0, byStatus: {}, byRole: {}, byDepartment: {} });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [filterDepartment, filterRole, filterStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create / Update user
  const handleSaveUser = async (formData) => {
    setSaving(true);
    try {
      const { photoFile, ...userData } = formData;

      if (editingUser) {
        const result = await userManagementService.updateUser(editingUser.id, userData, currentUser.uid);
        if (result.error) throw result.error;
        if (photoFile) {
          await userManagementService.uploadProfilePhoto(editingUser.id, photoFile);
        }
        toast.success('User updated successfully');
      } else {
        const result = await userManagementService.createUser(userData, currentUser.uid);
        if (result.error) throw result.error;
        if (photoFile && result.data?.id) {
          await userManagementService.uploadProfilePhoto(result.data.id, photoFile);
        }
        toast.success('User created successfully');
      }

      setShowCreateModal(false);
      setEditingUser(null);
      await loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  // Deactivate user
  const handleDeactivate = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to suspend ${userName}?`)) return;
    try {
      await userManagementService.deactivateUser(userId, 'Suspended by admin', currentUser.uid);
      toast.success('User suspended');
      await loadData();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  // Reactivate user
  const handleReactivate = async (userId) => {
    try {
      await userManagementService.reactivateUser(userId, currentUser.uid);
      toast.success('User reactivated');
      await loadData();
    } catch (error) {
      toast.error('Failed to reactivate user');
    }
  };

  // Export CSV
  const handleExport = async () => {
    try {
      const result = await userManagementService.exportUsersCSV({
        department: filterDepartment || undefined,
        role: filterRole || undefined,
        status: filterStatus || undefined,
      });
      if (result.data) {
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nara-users-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Export downloaded');
      }
    } catch (error) {
      toast.error('Export failed');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'displayName',
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {row.photoURL ? (
              <img src={row.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-slate-500">
                {(val || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{val || '—'}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      label: 'Employee ID',
      render: (val) => <span className="font-mono text-xs text-slate-600">{val || '—'}</span>,
    },
    {
      key: 'department',
      label: 'Department',
      render: (val) => {
        const dept = getDepartmentByCode(val);
        return <span className="text-sm">{dept?.name?.en || val || '—'}</span>;
      },
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => {
        const role = ROLE_HIERARCHY[val];
        return role ? (
          <AdminStatusBadge label={role.label.en} color={role.color} showDot={false} size="xs" />
        ) : (
          <span className="text-sm text-slate-500">{val || '—'}</span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <AdminStatusBadge status={val} size="xs" />,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${row.id}`); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setEditingUser(row); setShowCreateModal(true); }}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'active' ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleDeactivate(row.id, row.displayName); }}
              className="p-1.5 hover:bg-red-50 rounded-lg transition text-slate-400 hover:text-red-600"
              title="Suspend"
            >
              <UserX className="w-4 h-4" />
            </button>
          ) : row.status === 'suspended' ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleReactivate(row.id); }}
              className="p-1.5 hover:bg-green-50 rounded-lg transition text-slate-400 hover:text-green-600"
              title="Reactivate"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="User Management"
        description="Manage NARA staff accounts, roles, and permissions"
        breadcrumbs={[
          { label: 'Admin', path: '/admin/master' },
          { label: 'User Management' },
        ]}
        actions={
          <>
            <button
              onClick={handleExport}
              className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => { setEditingUser(null); setShowCreateModal(true); }}
              className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard title="Total Users" value={stats.total} icon={Users} color="navy" />
        <AdminStatsCard title="Active" value={stats.byStatus?.active || 0} icon={UserCheck} color="green" />
        <AdminStatsCard title="On Leave" value={stats.byStatus?.on_leave || 0} icon={Clock} color="amber" />
        <AdminStatsCard title="Departments" value={Object.keys(stats.byDepartment).length} icon={Building2} color="blue" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
              placeholder="Search by name, email, or employee ID..."
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.name.en}</option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            <option value="">All Roles</option>
            {roles.map(r => (
              <option key={r.key} value={r.key}>{r.label.en}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            <option value="">All Statuses</option>
            {Object.values(USER_STATUSES).map(s => (
              <option key={s.value} value={s.value}>{s.label.en}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(filterDepartment || filterRole || filterStatus || searchQuery) && (
            <button
              onClick={() => { setFilterDepartment(''); setFilterRole(''); setFilterStatus(''); setSearchQuery(''); }}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <AdminDataTable
        columns={columns}
        data={users}
        pageSize={10}
        loading={loading}
        emptyMessage="No users found. Create your first user to get started."
        emptyIcon={Users}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditingUser(null); }}
        title={editingUser ? 'Edit User' : 'Create New User'}
        subtitle={editingUser ? `Editing ${editingUser.displayName}` : 'Add a new staff member to the NARA directory'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => { setShowCreateModal(false); setEditingUser(null); }}
          loading={saving}
        />
      </AdminModal>
    </div>
  );
};

export default UserManagement;
