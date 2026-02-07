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

const buildStoragePath = (category) => {
  const timestamp = Date.now();
  return `${category}/${timestamp}_${Math.random().toString(36).slice(2, 8)}`;
};

const uploadAttachments = async (files = [], category) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = files.map(async (file) => {
    const storagePath = buildStoragePath(category);
    const fileRef = ref(storage, `${storagePath}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      name: file.name,
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
  const attachments = await uploadAttachments(files, collectionName);

  await addDoc(collection(db, collectionName), {
    ...data,
    attachments,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const submitEmergencyIncident = async (payload, files = []) => {
  await createReport('emergency_incidents', payload, files);
};

export const submitNonEmergencyRequest = async (payload, files = []) => {
  await createReport('non_emergency_support', payload, files);
};

export const submitEnvironmentalIncident = async (payload, files = []) => {
  await createReport('environmental_incidents', payload, files);
};

export default {
  submitEmergencyIncident,
  submitNonEmergencyRequest,
  submitEnvironmentalIncident
};
