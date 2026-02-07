import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

/**
 * Learning Development Academy Service
 * Handles all Firebase operations for courses, projects, submissions, and user management
 */

// ============================================
// COURSES MANAGEMENT
// ============================================

/**
 * Get all courses with optional filters
 */
export const getCourses = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_courses');

    // Build query with filters
    const constraints = [where('published', '==', true)];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.level) {
      constraints.push(where('level', '==', filters.level));
    }
    if (filters.userRole) {
      constraints.push(where('targetRoles', 'array-contains', filters.userRole));
    }

    constraints.push(orderBy('createdAt', 'desc'));

    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

/**
 * Get single course by ID
 */
export const getCourse = async (courseId) => {
  try {
    const docRef = doc(db, 'lda_courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

/**
 * Create new course (admin only)
 */
export const createCourse = async (courseData) => {
  try {
    const courseRef = doc(collection(db, 'lda_courses'));
    await setDoc(courseRef, {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledCount: 0,
      averageRating: 0,
      reviewCount: 0,
      published: false
    });

    return { success: true, id: courseRef.id };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId, updates) => {
  try {
    const docRef = doc(db, 'lda_courses', courseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, 'lda_courses', courseId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ============================================
// USER & ENROLLMENT MANAGEMENT
// ============================================

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'lda_users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Create or update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, 'lda_users', userId);
    await setDoc(docRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Enroll user in course
 */
export const enrollInCourse = async (userId, courseId) => {
  try {
    const enrollmentRef = doc(collection(db, 'lda_enrollments'));
    await setDoc(enrollmentRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      status: 'active',
      progress: 0,
      lastAccessedAt: serverTimestamp()
    });

    // Update course enrolled count
    const courseRef = doc(db, 'lda_courses', courseId);
    await updateDoc(courseRef, {
      enrolledCount: increment(1)
    });

    // Update user's enrolled courses
    const userRef = doc(db, 'lda_users', userId);
    await updateDoc(userRef, {
      enrolledCourses: arrayUnion(courseId)
    });

    return { success: true, enrollmentId: enrollmentRef.id };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

/**
 * Get user enrollments
 */
export const getUserEnrollments = async (userId) => {
  try {
    const q = query(
      collection(db, 'lda_enrollments'),
      where('userId', '==', userId),
      orderBy('enrolledAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
};

// ============================================
// PROJECT SUBMISSION
// ============================================

/**
 * Submit project
 */
export const submitProject = async (projectData, files = []) => {
  try {
    const projectRef = doc(collection(db, 'lda_projects'));

    // Upload files if any
    const uploadedFiles = [];
    for (const file of files) {
      const fileUrl = await uploadFile(file, `projects/${projectRef.id}`);
      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size
      });
    }

    await setDoc(projectRef, {
      ...projectData,
      files: uploadedFiles,
      status: 'pending',
      submittedAt: serverTimestamp(),
      reviewedAt: null,
      reviewerId: null,
      reviewComments: null
    });

    return { success: true, projectId: projectRef.id };
  } catch (error) {
    console.error('Error submitting project:', error);
    throw error;
  }
};

/**
 * Get projects (with filters)
 */
export const getProjects = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_projects');
    const constraints = [];

    if (filters.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    constraints.push(orderBy('submittedAt', 'desc'));

    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

/**
 * Update project status (admin/professor)
 */
export const reviewProject = async (projectId, reviewData) => {
  try {
    const docRef = doc(db, 'lda_projects', projectId);
    await updateDoc(docRef, {
      status: reviewData.status,
      reviewedAt: serverTimestamp(),
      reviewerId: reviewData.reviewerId,
      reviewComments: reviewData.comments,
      grade: reviewData.grade || null
    });

    return { success: true };
  } catch (error) {
    console.error('Error reviewing project:', error);
    throw error;
  }
};

// ============================================
// RESEARCH PAPERS
// ============================================

/**
 * Upload research paper
 */
export const uploadPaper = async (paperData, file) => {
  try {
    const paperRef = doc(collection(db, 'lda_papers'));

    // Upload PDF file
    const fileUrl = await uploadFile(file, `papers/${paperRef.id}`);

    await setDoc(paperRef, {
      ...paperData,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: serverTimestamp(),
      downloadCount: 0,
      viewCount: 0,
      status: 'pending_review'
    });

    return { success: true, paperId: paperRef.id };
  } catch (error) {
    console.error('Error uploading paper:', error);
    throw error;
  }
};

/**
 * Get papers with filters
 */
export const getPapers = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_papers');
    const constraints = [where('status', '==', 'published')];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.authorId) {
      constraints.push(where('authorId', '==', filters.authorId));
    }

    constraints.push(orderBy('uploadedAt', 'desc'));

    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
};

/**
 * Increment paper view/download count
 */
export const incrementPaperStats = async (paperId, type = 'view') => {
  try {
    const docRef = doc(db, 'lda_papers', paperId);
    const field = type === 'download' ? 'downloadCount' : 'viewCount';

    await updateDoc(docRef, {
      [field]: increment(1)
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating paper stats:', error);
    throw error;
  }
};

// ============================================
// TRAINING EVENTS
// ============================================

export const getTrainingEvents = async (filters = {}) => {
  try {
    const eventsCollection = collection(db, 'lda_training_events');
    const constraints = [];

    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.audience) {
      constraints.push(where('audience', 'array-contains', filters.audience));
    }

    if (filters.focusArea) {
      constraints.push(where('focusAreas', 'array-contains', filters.focusArea));
    }

    constraints.push(orderBy('startDate', 'asc'));

    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    if (filters.startAfter) {
      constraints.push(startAfter(filters.startAfter));
    }

    const eventsQuery = query(eventsCollection, ...constraints);
    const snapshot = await getDocs(eventsQuery);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
        endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate
      };
    });
  } catch (error) {
    console.error('Error fetching training events:', error);
    return [];
  }
};

export const createTrainingEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'lda_training_events'), {
      ...eventData,
      status: eventData.status || 'scheduled',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      registrations: [],
      seatsRemaining:
        typeof eventData.capacity === 'number' ? eventData.capacity : eventData.seatsRemaining ?? null
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating training event:', error);
    throw error;
  }
};

export const updateTrainingEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, 'lda_training_events', eventId);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    if (typeof updates.capacity === 'number') {
      payload.seatsRemaining = Math.max(
        typeof updates.seatsRemaining === 'number' ? updates.seatsRemaining : updates.capacity,
        0
      );
    }

    await updateDoc(eventRef, payload);
    return { success: true };
  } catch (error) {
    console.error('Error updating training event:', error);
    throw error;
  }
};

export const registerForTrainingEvent = async (eventId, registrationData) => {
  try {
    const eventRef = doc(db, 'lda_training_events', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return { success: false, error: new Error('Training event not found') };
    }

    const event = eventSnap.data();
    const registrations = event.registrations || [];

    if (registrationData?.email) {
      const alreadyRegistered = registrations.some(
        (entry) => entry.email && entry.email === registrationData.email
      );
      if (alreadyRegistered) {
        return { success: false, error: new Error('You have already registered for this session.') };
      }
    }

    if (typeof event.capacity === 'number' && registrations.length >= event.capacity) {
      return { success: false, error: new Error('This session is already fully booked.') };
    }

    const registrationRecord = {
      ...registrationData,
      registeredAt: serverTimestamp()
    };

    const updatePayload = {
      registrations: arrayUnion(registrationRecord),
      updatedAt: serverTimestamp()
    };

    if (typeof event.capacity === 'number') {
      const seatsRemaining = Math.max(
        (typeof event.seatsRemaining === 'number' ? event.seatsRemaining : event.capacity) - 1,
        0
      );
      updatePayload.seatsRemaining = seatsRemaining;
    }

    await updateDoc(eventRef, updatePayload);
    return { success: true };
  } catch (error) {
    console.error('Error registering for training event:', error);
    return { success: false, error };
  }
};

// ============================================
// TRAINING MATERIALS
// ============================================

/**
 * Upload training material
 */
export const uploadTrainingMaterial = async (materialData, files = []) => {
  try {
    const materialRef = doc(collection(db, 'lda_training_materials'));

    // Upload files
    const uploadedFiles = [];
    for (const file of files) {
      const fileUrl = await uploadFile(file, `training/${materialRef.id}`);
      uploadedFiles.push({
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size
      });
    }

    await setDoc(materialRef, {
      ...materialData,
      files: uploadedFiles,
      uploadedAt: serverTimestamp(),
      downloadCount: 0,
      status: 'published'
    });

    return { success: true, materialId: materialRef.id };
  } catch (error) {
    console.error('Error uploading training material:', error);
    throw error;
  }
};

/**
 * Get training materials
 */
export const getTrainingMaterials = async (filters = {}) => {
  try {
    let q = collection(db, 'lda_training_materials');
    const constraints = [where('status', '==', 'published')];

    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    constraints.push(orderBy('uploadedAt', 'desc'));

    if (filters.limitTo) {
      constraints.push(limit(filters.limitTo));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching training materials:', error);
    return [];
  }
};

// ============================================
// PROGRESS TRACKING
// ============================================

/**
 * Update lesson progress
 */
export const updateLessonProgress = async (userId, courseId, lessonId, completed = true) => {
  try {
    const progressRef = doc(db, 'lda_user_progress', `${userId}_${courseId}`);

    await setDoc(progressRef, {
      userId,
      courseId,
      [`lessons.${lessonId}`]: {
        completed,
        completedAt: completed ? serverTimestamp() : null
      },
      lastAccessedAt: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

/**
 * Get user progress for a course
 */
export const getCourseProgress = async (userId, courseId) => {
  try {
    const docRef = doc(db, 'lda_user_progress', `${userId}_${courseId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
};

// ============================================
// CATEGORIES
// ============================================

/**
 * Get all categories
 */
export const getCategories = async () => {
  try {
    const q = query(
      collection(db, 'lda_categories'),
      orderBy('order', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Create category (admin only)
 */
export const createCategory = async (categoryData) => {
  try {
    const categoryRef = doc(collection(db, 'lda_categories'));
    await setDoc(categoryRef, {
      ...categoryData,
      createdAt: serverTimestamp(),
      courseCount: 0
    });

    return { success: true, id: categoryRef.id };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// ============================================
// SEARCH & FILTERING
// ============================================

/**
 * Search across courses, papers, and materials
 */
export const searchContent = async (searchQuery, contentType = 'all') => {
  try {
    const results = {
      courses: [],
      papers: [],
      materials: []
    };

    const lowerQuery = searchQuery.toLowerCase();

    // Search courses
    if (contentType === 'all' || contentType === 'courses') {
      const coursesSnap = await getDocs(collection(db, 'lda_courses'));
      results.courses = coursesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(course =>
          course.title?.en?.toLowerCase().includes(lowerQuery) ||
          course.title?.si?.toLowerCase().includes(lowerQuery) ||
          course.title?.ta?.toLowerCase().includes(lowerQuery) ||
          course.description?.en?.toLowerCase().includes(lowerQuery) ||
          course.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    // Search papers
    if (contentType === 'all' || contentType === 'papers') {
      const papersSnap = await getDocs(
        query(collection(db, 'lda_papers'), where('status', '==', 'published'))
      );
      results.papers = papersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(paper =>
          paper.title?.en?.toLowerCase().includes(lowerQuery) ||
          paper.title?.si?.toLowerCase().includes(lowerQuery) ||
          paper.title?.ta?.toLowerCase().includes(lowerQuery) ||
          paper.abstract?.en?.toLowerCase().includes(lowerQuery)
        );
    }

    // Search training materials
    if (contentType === 'all' || contentType === 'materials') {
      const materialsSnap = await getDocs(
        query(collection(db, 'lda_training_materials'), where('status', '==', 'published'))
      );
      results.materials = materialsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(material =>
          material.title?.en?.toLowerCase().includes(lowerQuery) ||
          material.title?.si?.toLowerCase().includes(lowerQuery) ||
          material.title?.ta?.toLowerCase().includes(lowerQuery)
        );
    }

    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return { courses: [], papers: [], materials: [] };
  }
};

// ============================================
// FILE UPLOAD UTILITY
// ============================================

/**
 * Upload file to Firebase Storage
 */
export const uploadFile = async (file, path) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `lda/${path}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// ============================================
// ANALYTICS
// ============================================

/**
 * Track user activity
 */
export const trackActivity = async (userId, activityType, metadata = {}) => {
  try {
    const activityRef = doc(collection(db, 'lda_analytics'));
    await setDoc(activityRef, {
      userId,
      activityType,
      metadata,
      timestamp: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking activity:', error);
    // Don't throw - analytics failures shouldn't break functionality
    return { success: false };
  }
};

export default {
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,

  // Users & Enrollment
  getUserProfile,
  updateUserProfile,
  enrollInCourse,
  getUserEnrollments,

  // Projects
  submitProject,
  getProjects,
  reviewProject,

  // Papers
  uploadPaper,
  getPapers,
  incrementPaperStats,

// Training Materials
uploadTrainingMaterial,
getTrainingMaterials,

// Training Events
getTrainingEvents,
registerForTrainingEvent,
createTrainingEvent,
updateTrainingEvent,

// Progress
updateLessonProgress,
getCourseProgress,

  // Categories
  getCategories,
  createCategory,

  // Search
  searchContent,

  // Files
  uploadFile,
  deleteFile,

  // Analytics
  trackActivity
};
