/**
 * Job application service — Firestore + Firebase Storage (no backend API).
 *
 * Public applicants submit to the `jobApplications` collection; their uploaded
 * documents go to Firebase Storage under job_applications/<vacancyId>/<appId>/.
 * Admins read applications back and download the documents.
 */
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const COLLECTION = 'jobApplications';
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

const sanitize = (name) => (name || 'file').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 80);

/**
 * Submit a job application.
 * @param {object} args
 * @param {string} args.vacancyId
 * @param {string} args.vacancyTitle
 * @param {object} args.applicant - { fullName, email, phone, nic, category, studyField,
 *   qualificationLevel, institution, yearCompleted, experienceYears, coverNote }
 * @param {Array<{type:string,file:File}>} args.files
 * @param {(pct:number)=>void} [onProgress]
 */
export async function submitJobApplication({ vacancyId, vacancyTitle, applicant, files = [] }) {
  if (!vacancyId) throw new Error('Missing vacancy reference.');
  const appId = `APP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const valid = files.filter((f) => f && f.file);
  for (const { file } of valid) {
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`"${file.name}" is larger than 10 MB. Please upload a smaller file.`);
    }
  }

  const documents = [];
  for (const { type, file } of valid) {
    const path = `job_applications/${vacancyId}/${appId}/${type}_${Date.now()}_${sanitize(file.name)}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    documents.push({
      type,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
      url,
      storagePath: path,
    });
  }

  const payload = {
    applicationId: appId,
    vacancyId,
    vacancyTitle: vacancyTitle || '',
    ...applicant,
    documents,
    status: 'submitted',
    createdAt: serverTimestamp(),
  };

  const created = await addDoc(collection(db, COLLECTION), payload);

  // Best-effort applications counter on the vacancy (non-fatal if it fails).
  try {
    await updateDoc(doc(db, 'vacancies', vacancyId), { applicationsCount: increment(1) });
  } catch (e) {
    /* counter is cosmetic */
  }

  return { id: created.id, applicationId: appId, documentsUploaded: documents.length };
}

/** Fetch all applications (newest first). Filter by vacancy client-side to avoid composite indexes. */
export async function getAllApplications() {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getApplicationsForVacancy(vacancyId) {
  const all = await getAllApplications();
  return all.filter((a) => a.vacancyId === vacancyId);
}

export async function updateApplicationStatus(applicationId, status) {
  await updateDoc(doc(db, COLLECTION, applicationId), { status, statusUpdatedAt: serverTimestamp() });
}

export default {
  submitJobApplication,
  getAllApplications,
  getApplicationsForVacancy,
  updateApplicationStatus,
  MAX_FILE_BYTES,
  ACCEPTED_FILE_TYPES,
};
