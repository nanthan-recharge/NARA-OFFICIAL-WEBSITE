import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { userManagementService } from '../../services/userManagementService';
import { ROLE_HIERARCHY, getDepartmentByCode } from '../../constants/roles';
import { AdminPageHeader, AdminCard, AdminStatusBadge, AdminModal } from '../../components/admin';
import UserForm from '../../components/admin/UserForm';
import ActivityLog from '../../components/admin/ActivityLog';
import {
  Mail, Phone, Smartphone, Building2, Shield, Calendar, MapPin, Hash,
  Edit, UserX, UserCheck, ArrowLeft, Loader2, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useFirebaseAuth();
  const [userData, setUserData] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
    loadLogs();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    const result = await userManagementService.getUserById(userId);
    if (result.data) {
      setUserData(result.data);
    }
    setLoading(false);
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    const result = await userManagementService.getUserActivityLogs(userId, 30);
    setActivityLogs(result.data || []);
    setLogsLoading(false);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const { photoFile, ...data } = formData;
      await userManagementService.updateUser(userId, data, currentUser.uid);
      if (photoFile) {
        await userManagementService.uploadProfilePhoto(userId, photoFile);
      }
      toast.success('User updated');
      setShowEditModal(false);
      await loadUser();
      await loadLogs();
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async () => {
    if (userData.status === 'active') {
      if (!window.confirm(`Suspend ${userData.displayName}?`)) return;
      await userManagementService.deactivateUser(userId, 'Suspended by admin', currentUser.uid);
      toast.success('User suspended');
    } else {
      await userManagementService.reactivateUser(userId, currentUser.uid);
      toast.success('User reactivated');
    }
    await loadUser();
    await loadLogs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">User not found</p>
        <button onClick={() => navigate('/admin/users')} className="mt-4 text-[#0066CC] hover:underline text-sm">
          Back to User Management
        </button>
      </div>
    );
  }

  const roleConfig = ROLE_HIERARCHY[userData.role];
  const department = getDepartmentByCode(userData.department);
  const initials = (userData.displayName || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'activity', label: 'Activity Log' },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title=""
        breadcrumbs={[
          { label: 'Admin', path: '/admin/master' },
          { label: 'User Management', path: '/admin/users' },
          { label: userData.displayName },
        ]}
        actions={
          <>
            <button
              onClick={() => navigate('/admin/users')}
              className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleStatusToggle}
              className={`px-3 py-2 rounded-lg transition text-sm font-medium flex items-center gap-2 ${
                userData.status === 'active'
                  ? 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
                  : 'bg-white border border-green-300 text-green-600 hover:bg-green-50'
              }`}
            >
              {userData.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {userData.status === 'active' ? 'Suspend' : 'Reactivate'}
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </>
        }
      />

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="" className="w-20 h-20 object-cover" />
            ) : (
              <span className="text-2xl font-bold text-slate-400">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{userData.displayName}</h2>
            <p className="text-slate-500">{userData.designation?.en || 'No designation set'}</p>
            <div className="flex items-center gap-2 mt-2">
              <AdminStatusBadge status={userData.status} />
              {roleConfig && <AdminStatusBadge label={roleConfig.label.en} color={roleConfig.color} showDot={false} />}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? 'border-[#003366] text-[#003366]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard title="Contact Information" icon={Mail}>
            <InfoRow icon={Mail} label="Email" value={userData.email} />
            <InfoRow icon={Phone} label="Office Phone" value={userData.phone} />
            <InfoRow icon={Smartphone} label="Mobile" value={userData.mobile} />
          </AdminCard>

          <AdminCard title="Organizational Details" icon={Building2}>
            <InfoRow icon={Building2} label="Department" value={department?.name?.en || userData.department} />
            <InfoRow icon={Hash} label="Employee ID" value={userData.employeeId} />
            <InfoRow icon={Shield} label="Pay Grade" value={userData.grade} />
            <InfoRow icon={Calendar} label="Date Joined" value={
              userData.dateOfJoining?.toDate
                ? userData.dateOfJoining.toDate().toLocaleDateString()
                : userData.dateOfJoining || '—'
            } />
          </AdminCard>
        </div>
      )}

      {activeTab === 'permissions' && (
        <AdminCard title="Role & Permissions" icon={Shield}>
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Current Role</p>
            <div className="flex items-center gap-3">
              {roleConfig && (
                <AdminStatusBadge label={roleConfig.label.en} color={roleConfig.color} showDot={false} size="md" />
              )}
              <span className="text-sm text-slate-500">{roleConfig?.description?.en}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {(userData.permissions || []).map(perm => (
                <span key={perm} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  {perm.replace(/_/g, ' ')}
                </span>
              ))}
              {(userData.customPermissions || []).map(perm => (
                <span key={perm} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                  {perm.replace(/_/g, ' ')} (custom)
                </span>
              ))}
            </div>
          </div>
        </AdminCard>
      )}

      {activeTab === 'activity' && (
        <AdminCard title="Activity History" icon={Calendar}>
          <ActivityLog logs={activityLogs} loading={logsLoading} />
        </AdminCard>
      )}

      {/* Edit Modal */}
      <AdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        subtitle={`Editing ${userData.displayName}`}
        size="lg"
      >
        <UserForm
          user={userData}
          onSave={handleSave}
          onCancel={() => setShowEditModal(false)}
          loading={saving}
        />
      </AdminModal>
    </div>
  );
};

export default UserDetail;
