import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, CheckCircle, Loader2, GraduationCap, Briefcase, FileText } from 'lucide-react';
import {
  JOB_CATEGORIES, STUDY_FIELDS, QUALIFICATION_LEVELS, DOCUMENT_TYPES, documentTypeLabel,
} from '../../constants/vacancyTaxonomy';
import { submitJobApplication, ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from '../../services/jobApplicationService';

/**
 * Built-in job application form. Lets a member of the public apply directly:
 * pick their profession category, field of study and qualification from
 * auto-displayed dropdowns, fill basic details, upload the required documents,
 * and submit — saved to Firestore + Firebase Storage (no external site needed).
 */
const JobApplicationModal = ({ vacancy, onClose }) => {
  const requiredDocs = useMemo(() => {
    const codes = vacancy?.requiredDocuments?.length ? vacancy.requiredDocuments : ['cv', 'educational-certificates'];
    return DOCUMENT_TYPES.filter((d) => codes.includes(d.value));
  }, [vacancy]);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', nic: '',
    category: vacancy?.category || JOB_CATEGORIES[0].value,
    studyField: '', qualificationLevel: '', institution: '', yearCompleted: '', experienceYears: '',
    coverNote: '',
  });
  const [files, setFiles] = useState({}); // docType -> File
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null); // success result
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onFile = (docType, file) => {
    if (file && file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" is larger than 10 MB.`);
      return;
    }
    setError('');
    setFiles((p) => ({ ...p, [docType]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.phone) {
      setError('Please fill in your name, email and phone number.');
      return;
    }
    if (!form.studyField || !form.qualificationLevel) {
      setError('Please select your field of study and qualification.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitJobApplication({
        vacancyId: vacancy.id,
        vacancyTitle: vacancy?.title?.en || vacancy?.title || '',
        applicant: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          nic: form.nic.trim(),
          category: form.category,
          studyField: form.studyField,
          qualificationLevel: form.qualificationLevel,
          institution: form.institution.trim(),
          yearCompleted: form.yearCompleted,
          experienceYears: form.experienceYears,
          coverNote: form.coverNote.trim(),
        },
        files: Object.entries(files).map(([type, file]) => ({ type, file })),
      });
      setDone(result);
    } catch (err) {
      console.error('Application failed:', err);
      setError(err.message || 'Something went wrong submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none';
  const label = 'block text-sm font-semibold text-slate-700 mb-1';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={onClose} role="dialog" aria-modal="true" aria-label="Job application form"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Apply for this position</h2>
            <p className="text-sm text-slate-500">{vacancy?.title?.en || vacancy?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg" aria-label="Close">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900">Application submitted!</h3>
            <p className="text-slate-600 mt-2">
              Thank you, {form.fullName}. Your reference is <span className="font-mono font-semibold">{done.applicationId}</span>.
              <br />NARA HR will review your application and contact you by email.
            </p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Personal details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-2"><Briefcase size={15} /> Your details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Full name *</label>
                  <input className={field} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
                </div>
                <div>
                  <label className={label}>NIC number</label>
                  <input className={field} value={form.nic} onChange={(e) => set('nic', e.target.value)} placeholder="e.g. 199012345678" />
                </div>
                <div>
                  <label className={label}>Email *</label>
                  <input type="email" className={field} value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className={label}>Phone *</label>
                  <input type="tel" className={field} value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Qualification — easy auto-display dropdowns */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-2"><GraduationCap size={15} /> Your qualification</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Profession area *</label>
                  <select className={field} value={form.category} onChange={(e) => set('category', e.target.value)} required>
                    {JOB_CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className={label}>Field of study *</label>
                  <select className={field} value={form.studyField} onChange={(e) => set('studyField', e.target.value)} required>
                    <option value="">Select your field of study…</option>
                    {STUDY_FIELDS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className={label}>Highest qualification *</label>
                  <select className={field} value={form.qualificationLevel} onChange={(e) => set('qualificationLevel', e.target.value)} required>
                    <option value="">Select your qualification…</option>
                    {QUALIFICATION_LEVELS.map((q) => (<option key={q.value} value={q.value}>{q.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className={label}>Institution / University</label>
                  <input className={field} value={form.institution} onChange={(e) => set('institution', e.target.value)} placeholder="e.g. University of Colombo" />
                </div>
                <div>
                  <label className={label}>Year completed</label>
                  <input type="number" className={field} value={form.yearCompleted} onChange={(e) => set('yearCompleted', e.target.value)} placeholder="e.g. 2021" />
                </div>
                <div>
                  <label className={label}>Years of experience</label>
                  <input type="number" min="0" className={field} value={form.experienceYears} onChange={(e) => set('experienceYears', e.target.value)} placeholder="e.g. 3" />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-2"><FileText size={15} /> Upload documents</h3>
              <p className="text-xs text-slate-500 mb-3">Accepted: PDF, JPG, PNG, DOC (max 10 MB each).</p>
              <div className="space-y-2">
                {requiredDocs.map((d) => (
                  <div key={d.value} className="flex items-center justify-between gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <span className="text-sm font-medium text-slate-700">{d.label}</span>
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 cursor-pointer hover:border-cyan-400">
                      <Upload size={15} />
                      {files[d.value] ? <span className="max-w-[160px] truncate text-emerald-700">{files[d.value].name}</span> : 'Choose file'}
                      <input type="file" accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={(e) => onFile(d.value, e.target.files?.[0] || null)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover note */}
            <div>
              <label className={label}>Why are you a good fit? (optional)</label>
              <textarea className={field} rows={3} value={form.coverNote} onChange={(e) => set('coverNote', e.target.value)} placeholder="A short note about your experience and motivation…" />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60">
                {submitting ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : 'Submit application'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default JobApplicationModal;
