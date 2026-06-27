import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from '../firebase';

const createReferenceId = (collectionName) => {
  const prefixMap = {
    emergency_incidents: 'ERN-EMG',
    environmental_incidents: 'ERN-ENV',
    non_emergency_support: 'ERN-SUP'
  };
  const prefix = prefixMap[collectionName] ?? 'ERN';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${date}-${suffix}`;
};

const sanitizeFileName = (name = 'attachment') => {
  const cleaned = String(name)
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || 'attachment';
};

const buildStoragePath = (category, referenceId) => {
  return `${category}/${referenceId}`;
};

const uploadAttachments = async (files = [], category, referenceId) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = files.map(async (file) => {
    const storagePath = buildStoragePath(category, referenceId);
    const safeName = sanitizeFileName(file.name);
    const fileRef = ref(storage, `${storagePath}/${Date.now()}-${safeName}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      name: safeName,
      originalName: file.name,
      size: file.size,
      contentType: file.type,
      url: downloadURL,
      storagePath: fileRef.fullPath,
      uploadedAt: new Date().toISOString()
    };
  });

  return Promise.all(uploads);
};

const createReport = async (collectionName, data = {}, files = []) => {
  const referenceId = createReferenceId(collectionName);
  const attachments = await uploadAttachments(files, collectionName, referenceId);

  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    attachments,
    referenceId,
    collectionName,
    source: 'emergency-response-network',
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    id: docRef.id,
    referenceId
  };
};

export const submitEmergencyIncident = async (payload, files = []) => {
  return createReport('emergency_incidents', payload, files);
};

export const submitNonEmergencyRequest = async (payload, files = []) => {
  return createReport('non_emergency_support', payload, files);
};

export const submitEnvironmentalIncident = async (payload, files = []) => {
  return createReport('environmental_incidents', payload, files);
};

export default {
  submitEmergencyIncident,
  submitNonEmergencyRequest,
  submitEnvironmentalIncident
};
