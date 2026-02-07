import React, { useState, useEffect } from 'react';
import { ROLE_HIERARCHY, DEPARTMENTS, PAY_GRADES, USER_STATUSES, getRolesSortedByLevel } from '../../constants/roles';
import { userManagementService } from '../../services/userManagementService';
import { Upload, X, Loader2 } from 'lucide-react';

const emptyForm = {
  employeeId: '',
  firstName: { en: '', si: '', ta: '' },
  lastName: { en: '', si: '', ta: '' },
  displayName: '',
  email: '',
  phone: '',
  mobile: '',
  designation: { en: '', si: '', ta: '' },
  role: 'support_staff',
  department: '',
  reportingTo: '',
  grade: '',
  status: 'active',
  notes: '',
};

const langTabs = [
  { key: 'en', label: 'English' },
  { key: 'si', label: 'Sinhala' },
  { key: 'ta', label: 'Tamil' },
];

const UserForm = ({ user, onSave, onCancel, loading: externalLoading }) => {
  const [form, setForm] = useState(emptyForm);
  const [activeLang, setActiveLang] = useState('en');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const roles = getRolesSortedByLevel();

  useEffect(() => {
    if (user) {
      setForm({
        employeeId: user.employeeId || '',
        firstName: user.firstName || { en: '', si: '', ta: '' },
        lastName: user.lastName || { en: '', si: '', ta: '' },
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        mobile: user.mobile || '',
        designation: user.designation || { en: '', si: '', ta: '' },
        role: user.role || 'support_staff',
        department: user.department || '',
        reportingTo: user.reportingTo || '',
        grade: user.grade || '',
        status: user.status || 'active',
        notes: user.notes || '',
      });
      if (user.photoURL) setPhotoPreview(user.photoURL);
    }
  }, [user]);

  // Auto-generate display name from English first/last name
  useEffect(() => {
    if (form.firstName.en || form.lastName.en) {
      setForm(prev => ({
        ...prev,
        displayName: `${prev.firstName.en} ${prev.lastName.en}`.trim()
      }));
    }
  }, [form.firstName.en, form.lastName.en]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updateMultilingual = (field, lang, value) => {
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.en) errs.firstName = 'First name (English) is required';
    if (!form.lastName.en) errs.lastName = 'Last name (English) is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.employeeId) errs.employeeId = 'Employee ID is required';
    if (!form.department) errs.department = 'Department is required';
    if (!form.role) errs.role = 'Role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, photoFile });
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 bg-slate-50 border rounded-lg text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-slate-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section: Profile Photo */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-6 h-6 text-slate-400" />
            )}
          </div>
          {photoPreview && (
            <button
              type="button"
              onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div>
          <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition text-sm text-slate-600">
            <Upload className="w-4 h-4" />
            Upload Photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 2MB</p>
        </div>
      </div>

      {/* Section: Personal Information */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">Personal Information</h4>

        {/* Language Tabs */}
        <div className="flex gap-1 mb-3">
          {langTabs.map(lt => (
            <button
              key={lt.key}
              type="button"
              onClick={() => setActiveLang(lt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeLang === lt.key
                  ? 'bg-[#003366] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">First Name ({activeLang.toUpperCase()})*</label>
            <input
              value={form.firstName[activeLang]}
              onChange={(e) => updateMultilingual('firstName', activeLang, e.target.value)}
              className={inputClass('firstName')}
              placeholder="Enter first name"
            />
            {errors.firstName && activeLang === 'en' && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Last Name ({activeLang.toUpperCase()})*</label>
            <input
              value={form.lastName[activeLang]}
              onChange={(e) => updateMultilingual('lastName', activeLang, e.target.value)}
              className={inputClass('lastName')}
              placeholder="Enter last name"
            />
            {errors.lastName && activeLang === 'en' && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email*</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass('email')}
              placeholder="name@nara.gov.lk"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Employee ID*</label>
            <input
              value={form.employeeId}
              onChange={(e) => updateField('employeeId', e.target.value)}
              className={inputClass('employeeId')}
              placeholder="NARA-2026-0001"
            />
            {errors.employeeId && <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Office Phone</label>
            <input
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClass()}
              placeholder="+94 11 XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Mobile</label>
            <input
              value={form.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              className={inputClass()}
              placeholder="+94 7X XXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Section: Organizational Details */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">Organizational Details</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Designation ({activeLang.toUpperCase()})</label>
            <input
              value={form.designation[activeLang]}
              onChange={(e) => updateMultilingual('designation', activeLang, e.target.value)}
              className={inputClass()}
              placeholder="Enter job title"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Department*</label>
            <select
              value={form.department}
              onChange={(e) => updateField('department', e.target.value)}
              className={inputClass('department')}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.name.en}</option>
              ))}
            </select>
            {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Pay Grade</label>
            <select
              value={form.grade}
              onChange={(e) => updateField('grade', e.target.value)}
              className={inputClass()}
            >
              <option value="">Select Grade</option>
              {PAY_GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reports To</label>
            <input
              value={form.reportingTo}
              onChange={(e) => updateField('reportingTo', e.target.value)}
              className={inputClass()}
              placeholder="Supervisor name or ID"
            />
          </div>
        </div>
      </div>

      {/* Section: Access & Role */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">Access & Role</h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">System Role*</label>
            <select
              value={form.role}
              onChange={(e) => updateField('role', e.target.value)}
              className={inputClass('role')}
            >
              {roles.map(r => (
                <option key={r.key} value={r.key}>
                  {r.label.en} (Level {r.level})
                </option>
              ))}
            </select>
            {form.role && ROLE_HIERARCHY[form.role] && (
              <p className="text-xs text-slate-500 mt-1">{ROLE_HIERARCHY[form.role].description.en}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
              className={inputClass()}
            >
              {Object.values(USER_STATUSES).map(s => (
                <option key={s.value} value={s.value}>{s.label.en}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section: Notes */}
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">Internal Notes</h4>
        <textarea
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          className={`${inputClass()} min-h-[80px] resize-none`}
          placeholder="Optional notes visible only to administrators..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={externalLoading}
          className="px-5 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {externalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
