/**
 * NARA Government Organizational Role Hierarchy
 *
 * Defines all roles, their hierarchy levels, labels (multilingual),
 * and default permissions for the National Aquatic Resources Research
 * and Development Agency (NARA).
 *
 * Level 0 = highest (system admin), Level 8 = lowest (support staff)
 * A higher-level role inherits all permissions of lower levels.
 */

// ============================================
// Permission Definitions
// ============================================

export const PERMISSIONS = {
  // Dashboard & Analytics
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ANALYTICS: 'view_analytics',

  // User Management
  MANAGE_USERS: 'manage_users',
  MANAGE_DIVISION_USERS: 'manage_division_users',

  // Content
  MANAGE_CONTENT: 'manage_content',
  CREATE_CONTENT: 'create_content',

  // Applications & Requests
  MANAGE_APPLICATIONS: 'manage_applications',
  VIEW_APPLICATIONS: 'view_applications',
  APPROVE_REQUESTS: 'approve_requests',
  APPROVE_DIVISION_REQUESTS: 'approve_division_requests',

  // Research
  MANAGE_RESEARCH_DATA: 'manage_research_data',
  MANAGE_OWN_RESEARCH: 'manage_own_research',

  // Technical
  MANAGE_LAB_DATA: 'manage_lab_data',

  // Administration
  MANAGE_RECORDS: 'manage_records',
  MANAGE_DEPARTMENTS: 'manage_departments',
  MANAGE_SYSTEM: 'manage_system',
  MANAGE_CLOUD_FUNCTIONS: 'manage_cloud_functions',

  // Logs
  VIEW_LOGS: 'view_logs',
};

// ============================================
// Role Hierarchy
// ============================================

export const ROLE_HIERARCHY = {
  system_admin: {
    level: 0,
    label: { en: 'System Administrator', si: 'පද්ධති පරිපාලක', ta: 'கணினி நிர்வாகி' },
    description: { en: 'Full system access and configuration', si: 'සම්පූර්ණ පද්ධති ප්‍රවේශය', ta: 'முழு அமைப்பு அணுகல்' },
    permissions: ['*'], // Wildcard = all permissions
    color: 'red',
  },
  director_general: {
    level: 1,
    label: { en: 'Director General', si: 'අධ්‍යක්ෂ ජනරාල්', ta: 'பணிப்பாளர் நாயகம்' },
    description: { en: 'Head of NARA - full organizational access', si: 'NARA ප්‍රධානී', ta: 'NARA தலைவர்' },
    permissions: ['*'],
    color: 'purple',
  },
  deputy_director: {
    level: 2,
    label: { en: 'Deputy Director', si: 'නියෝජ්‍ය අධ්‍යක්ෂ', ta: 'துணை இயக்குநர்' },
    description: { en: 'Senior management with broad administrative authority', si: 'ජ්‍යෙෂ්ඨ කළමනාකරණය', ta: 'மூத்த நிர்வாகம்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.APPROVE_REQUESTS,
      PERMISSIONS.MANAGE_DEPARTMENTS,
      PERMISSIONS.VIEW_LOGS,
    ],
    color: 'indigo',
  },
  division_head: {
    level: 3,
    label: { en: 'Division Head', si: 'අංශ ප්‍රධානී', ta: 'பிரிவுத் தலைவர்' },
    description: { en: 'Manages a division and its staff', si: 'අංශයක් හා එහි කාර්ය මණ්ඩලය කළමනාකරණය කරයි', ta: 'ஒரு பிரிவை நிர்வகிக்கிறார்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_DIVISION_USERS,
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.MANAGE_APPLICATIONS,
      PERMISSIONS.APPROVE_DIVISION_REQUESTS,
      PERMISSIONS.VIEW_LOGS,
    ],
    color: 'blue',
  },
  senior_researcher: {
    level: 4,
    label: { en: 'Senior Researcher', si: 'ජ්‍යෙෂ්ඨ පර්යේෂක', ta: 'மூத்த ஆராய்ச்சியாளர்' },
    description: { en: 'Leads research projects and manages research data', si: 'පර්යේෂණ ව්‍යාපෘති මෙහෙයවයි', ta: 'ஆராய்ச்சி திட்டங்களை வழிநடத்துகிறார்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_CONTENT,
      PERMISSIONS.MANAGE_RESEARCH_DATA,
      PERMISSIONS.VIEW_APPLICATIONS,
    ],
    color: 'cyan',
  },
  research_officer: {
    level: 5,
    label: { en: 'Research Officer', si: 'පර්යේෂණ නිලධාරී', ta: 'ஆராய்ச்சி அதிகாரி' },
    description: { en: 'Conducts research and publishes findings', si: 'පර්යේෂණ පවත්වයි', ta: 'ஆராய்ச்சி நடத்துகிறார்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.CREATE_CONTENT,
      PERMISSIONS.MANAGE_OWN_RESEARCH,
    ],
    color: 'teal',
  },
  technical_officer: {
    level: 6,
    label: { en: 'Technical Officer', si: 'තාක්ෂණ නිලධාරී', ta: 'தொழில்நுட்ப அதிகாரி' },
    description: { en: 'Manages laboratory and technical operations', si: 'රසායනාගාර හා තාක්ෂණ මෙහෙයුම්', ta: 'ஆய்வக நடவடிக்கைகள்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.CREATE_CONTENT,
      PERMISSIONS.MANAGE_LAB_DATA,
    ],
    color: 'green',
  },
  admin_staff: {
    level: 7,
    label: { en: 'Administrative Staff', si: 'පරිපාලන කාර්ය මණ්ඩලය', ta: 'நிர்வாக ஊழியர்கள்' },
    description: { en: 'Handles administrative records and coordination', si: 'පරිපාලන වාර්තා හා සම්බන්ධීකරණය', ta: 'நிர்வாக பதிவுகள்' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_RECORDS,
    ],
    color: 'amber',
  },
  support_staff: {
    level: 8,
    label: { en: 'Support Staff', si: 'ආධාරක කාර්ය මණ්ඩලය', ta: 'ஆதரவு ஊழியர்கள்' },
    description: { en: 'General support and operational tasks', si: 'සාමාන්‍ය ආධාරක කාර්යයන්', ta: 'பொது ஆதரவு' },
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
    ],
    color: 'slate',
  },
};

// ============================================
// User Account Statuses
// ============================================

export const USER_STATUSES = {
  ACTIVE: { value: 'active', label: { en: 'Active', si: 'ක්‍රියාකාරී', ta: 'செயலில்' }, color: 'green' },
  SUSPENDED: { value: 'suspended', label: { en: 'Suspended', si: 'අත්හිටුවා ඇත', ta: 'இடைநிறுத்தப்பட்டது' }, color: 'red' },
  ON_LEAVE: { value: 'on_leave', label: { en: 'On Leave', si: 'නිවාඩුවේ', ta: 'விடுப்பில்' }, color: 'amber' },
  RETIRED: { value: 'retired', label: { en: 'Retired', si: 'විශ්‍රාමික', ta: 'ஓய்வு பெற்றவர்' }, color: 'slate' },
  TERMINATED: { value: 'terminated', label: { en: 'Terminated', si: 'අවසන් කරන ලදී', ta: 'நிறுத்தப்பட்டது' }, color: 'gray' },
};

// ============================================
// NARA Departments / Divisions
// ============================================

export const DEPARTMENTS = [
  { code: 'ENV', name: { en: 'Environmental Studies Division', si: 'පරිසර අධ්‍යයන අංශය', ta: 'சுற்றுச்சூழல் ஆய்வுப் பிரிவு' }, order: 1 },
  { code: 'IAR', name: { en: 'Inland Aquatic Resources Development Division', si: 'අභ්‍යන්තර ජලජ සම්පත් සංවර්ධන අංශය', ta: 'உள்நாட்டு நீர்வாழ் வளம் பிரிவு' }, order: 2 },
  { code: 'MBR', name: { en: 'Marine Biological Resources Division', si: 'මුහුදු ජීව විද්‍යා සම්පත් අංශය', ta: 'கடல் உயிரியல் வளப் பிரிவு' }, order: 3 },
  { code: 'FTD', name: { en: 'Fishing Technology Division', si: 'ධීවර තාක්ෂණ අංශය', ta: 'மீன்பிடி தொழில்நுட்பப் பிரிவு' }, order: 4 },
  { code: 'SEM', name: { en: 'Socio-Economics & Marketing Division', si: 'සමාජ ආර්ථික හා අලෙවිකරණ අංශය', ta: 'சமூக பொருளாதார பிரிவு' }, order: 5 },
  { code: 'NHO', name: { en: 'National Hydrographic Office', si: 'ජාතික ජල මැනීම් කාර්යාලය', ta: 'தேசிய நீர்நிலை அலுவலகம்' }, order: 6 },
  { code: 'QAL', name: { en: 'Quality Assurance & Laboratory Division', si: 'ගුණාත්මක සහතික හා රසායනාගාර අංශය', ta: 'தர உத்தரவாத பிரிவு' }, order: 7 },
  { code: 'AQD', name: { en: 'Aquaculture Development Division', si: 'ජලජ වගා සංවර්ධන අංශය', ta: 'நீர்வாழ் வளர்ப்புப் பிரிவு' }, order: 8 },
  { code: 'ITD', name: { en: 'Information Technology Division', si: 'තොරතුරු තාක්ෂණ අංශය', ta: 'தகவல் தொழில்நுட்பப் பிரிவு' }, order: 9 },
  { code: 'FIN', name: { en: 'Finance Division', si: 'මුදල් අංශය', ta: 'நிதிப் பிரிவு' }, order: 10 },
  { code: 'AHR', name: { en: 'Administration & Human Resources Division', si: 'පරිපාලන හා මානව සම්පත් අංශය', ta: 'நிர்வாக மற்றும் மனித வளப் பிரிவு' }, order: 11 },
  { code: 'LIB', name: { en: 'Library & Documentation Division', si: 'පුස්තකාල හා ප්‍රලේඛන අංශය', ta: 'நூலக ஆவணப் பிரிவு' }, order: 12 },
  { code: 'PPD', name: { en: 'Planning & Projects Division', si: 'සැලසුම් හා ව්‍යාපෘති අංශය', ta: 'திட்டமிடல் பிரிவு' }, order: 13 },
  { code: 'RRC', name: { en: 'Regional Research Centers', si: 'ප්‍රාදේශීය පර්යේෂණ මධ්‍යස්ථාන', ta: 'பிராந்திய ஆராய்ச்சி மையங்கள்' }, order: 14 },
];

// ============================================
// Government Pay Grades
// ============================================

export const PAY_GRADES = [
  'Special Grade',
  'Grade I',
  'Grade II',
  'Grade III',
  'Supra Grade',
  'Class I',
  'Class II',
  'Class III',
];

// ============================================
// Activity Log Action Types
// ============================================

export const ACTIVITY_ACTIONS = {
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  ROLE_CHANGED: 'role_changed',
  STATUS_CHANGED: 'status_changed',
  PERMISSION_CHANGED: 'permission_changed',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_PHOTO_UPDATED: 'profile_photo_updated',
  BULK_IMPORT: 'bulk_import',
};

// ============================================
// Helpers
// ============================================

/**
 * Get role config by role key
 */
export const getRoleConfig = (roleKey) => {
  return ROLE_HIERARCHY[roleKey] || null;
};

/**
 * Get all permissions for a given role (including wildcard resolution)
 */
export const getRolePermissions = (roleKey) => {
  const role = ROLE_HIERARCHY[roleKey];
  if (!role) return [];
  if (role.permissions.includes('*')) {
    return Object.values(PERMISSIONS);
  }
  return role.permissions;
};

/**
 * Check if a role has a specific permission
 */
export const roleHasPermission = (roleKey, permission) => {
  const permissions = getRolePermissions(roleKey);
  return permissions.includes(permission);
};

/**
 * Get all role keys sorted by hierarchy level (highest first)
 */
export const getRolesSortedByLevel = () => {
  return Object.entries(ROLE_HIERARCHY)
    .sort(([, a], [, b]) => a.level - b.level)
    .map(([key, config]) => ({ key, ...config }));
};

/**
 * Check if roleA outranks roleB (lower level = higher rank)
 */
export const isHigherRank = (roleKeyA, roleKeyB) => {
  const a = ROLE_HIERARCHY[roleKeyA];
  const b = ROLE_HIERARCHY[roleKeyB];
  if (!a || !b) return false;
  return a.level < b.level;
};

/**
 * Get department by code
 */
export const getDepartmentByCode = (code) => {
  return DEPARTMENTS.find(d => d.code === code) || null;
};

/**
 * Get status config by value
 */
export const getStatusConfig = (statusValue) => {
  return Object.values(USER_STATUSES).find(s => s.value === statusValue) || null;
};
