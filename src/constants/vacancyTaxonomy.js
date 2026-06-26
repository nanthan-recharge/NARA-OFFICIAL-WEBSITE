/**
 * Vacancy / recruitment taxonomy for NARA.
 *
 * Central, single source of truth for the dropdowns used both when an admin
 * posts a job and when a member of the public applies. Keeping these here means
 * the "category → study field → qualification" selectors stay consistent across
 * the admin panel and the public application form.
 *
 * Each list item is { value, label } so it can drive a <select> directly and be
 * stored as a stable `value` while displaying a friendly `label`.
 */

// Broad profession/job categories used to classify a posting.
export const JOB_CATEGORIES = [
  { value: 'scientific-research', label: 'Scientific & Research' },
  { value: 'technical-engineering', label: 'Technical & Engineering' },
  { value: 'administration', label: 'Administration & Management' },
  { value: 'finance', label: 'Finance & Accounting' },
  { value: 'information-technology', label: 'Information Technology' },
  { value: 'library-information', label: 'Library & Information' },
  { value: 'support-services', label: 'Support Services' },
];

// Fields of study an applicant can hold — shown so applicants pick "what they
// studied" easily. Ordered roughly by relevance to an aquatic-research agency.
export const STUDY_FIELDS = [
  { value: 'marine-biology', label: 'Marine Biology / Marine Science' },
  { value: 'fisheries-aquaculture', label: 'Fisheries Science / Aquaculture' },
  { value: 'oceanography-hydrography', label: 'Oceanography / Hydrography' },
  { value: 'environmental-science', label: 'Environmental Science' },
  { value: 'zoology-biology', label: 'Zoology / Biology' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'food-science', label: 'Food Science & Technology' },
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'engineering', label: 'Engineering (Civil / Mechanical / Electrical)' },
  { value: 'computer-science', label: 'Computer Science / IT' },
  { value: 'statistics-mathematics', label: 'Statistics / Mathematics' },
  { value: 'economics', label: 'Economics' },
  { value: 'business-management', label: 'Business Administration / Management' },
  { value: 'accounting-finance', label: 'Accounting / Finance' },
  { value: 'law', label: 'Law' },
  { value: 'library-information-science', label: 'Library & Information Science' },
  { value: 'social-sciences', label: 'Social Sciences' },
  { value: 'other', label: 'Other' },
];

// Education / qualification levels, lowest to highest (Sri Lanka context).
export const QUALIFICATION_LEVELS = [
  { value: 'gce-ol', label: 'GCE O/L' },
  { value: 'gce-al', label: 'GCE A/L' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'hnd', label: 'Higher National Diploma (HND)' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'pg-diploma', label: 'Postgraduate Diploma' },
  { value: 'masters', label: "Master's Degree" },
  { value: 'mphil', label: 'MPhil' },
  { value: 'phd', label: 'PhD / Doctorate' },
];

// Documents an applicant may be asked to upload.
export const DOCUMENT_TYPES = [
  { value: 'cv', label: 'CV / Resume' },
  { value: 'cover-letter', label: 'Cover Letter' },
  { value: 'nic', label: 'National Identity Card (NIC)' },
  { value: 'educational-certificates', label: 'Educational Certificates' },
  { value: 'experience-letters', label: 'Experience Letters' },
  { value: 'professional-membership', label: 'Professional Membership' },
  { value: 'birth-certificate', label: 'Birth Certificate' },
  { value: 'references', label: 'References' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

export const NARA_DEPARTMENTS = [
  'Marine Biological Resources',
  'Fisheries & Aquaculture',
  'Environmental Studies',
  'Socio Economics & Marketing',
  'Inland Aquatic Resources',
  'National Hydrographic Office',
  'Oceanography',
  'Information Technology',
  'Administration',
  'Finance',
  'Library Services',
];

// --- helpers -------------------------------------------------------------

const _label = (list, value) => list.find((o) => o.value === value)?.label || value || '';
export const categoryLabel = (v) => _label(JOB_CATEGORIES, v);
export const studyFieldLabel = (v) => _label(STUDY_FIELDS, v);
export const qualificationLabel = (v) => _label(QUALIFICATION_LEVELS, v);
export const documentTypeLabel = (v) => _label(DOCUMENT_TYPES, v);

export default {
  JOB_CATEGORIES,
  STUDY_FIELDS,
  QUALIFICATION_LEVELS,
  DOCUMENT_TYPES,
  EMPLOYMENT_TYPES,
  NARA_DEPARTMENTS,
};
