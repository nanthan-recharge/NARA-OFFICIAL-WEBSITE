// NARA Portal Data Service
// Unified service for managing Jobs (Recruitment) and Tenders (Procurement) with Firebase

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ==================== JOBS (RECRUITMENT) SERVICE ====================

export const jobsService = {
  // Get all published jobs
  getAllPublished: async (filters = {}) => {
    try {
      let queryConstraints = [
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      ];

      if (filters.department) {
        queryConstraints.unshift(where('department', '==', filters.department));
      }

      if (filters.limit) {
        queryConstraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, 'recruitment_vacancies'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const jobs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
          publishedAt: data.publishedAt?.toDate?.().toISOString() || new Date().toISOString(),
          closingDate: data.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      return { data: jobs, error: null };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { data: [], error };
    }
  },

  // Get job by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Job not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching job:', error);
      return { data: null, error };
    }
  },

  // Submit job application
  submitApplication: async (jobId, applicationData) => {
    try {
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...applicationData,
        vacancyId: jobId,
        applicationId,
        applicationType: 'job',
        status: 'submitted',
        workflowStage: 'initial_review',
        reviewers: [],
        scores: {},
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'recruitment_applications'), dataToSave);

      // Update vacancy application count
      const vacancyRef = doc(db, 'recruitment_vacancies', jobId);
      const vacancySnap = await getDoc(vacancyRef);
      if (vacancySnap.exists()) {
        const currentCount = vacancySnap.data().applicationCount || 0;
        await updateDoc(vacancyRef, {
          applicationCount: currentCount + 1,
          updatedAt: serverTimestamp()
        });
      }

      return { data: { id: docRef.id, applicationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting job application:', error);
      return { data: null, error };
    }
  },

  // Create new job (admin only)
  create: async (jobData) => {
    try {
      const vacancyId = `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...jobData,
        vacancyId,
        status: jobData.status || 'draft',
        applicationCount: 0,
        shortlistedCount: 0,
        interviewedCount: 0,
        selectedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'recruitment_vacancies'), dataToSave);
      return { data: { id: docRef.id, vacancyId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating job:', error);
      return { data: null, error };
    }
  },

  // Update job (admin only)
  update: async (id, updateData) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating job:', error);
      return { data: null, error };
    }
  },

  // Delete job (admin only)
  delete: async (id) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await deleteDoc(docRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting job:', error);
      return { data: null, error };
    }
  }
};

// ==================== TENDERS (PROCUREMENT) SERVICE ====================

export const tendersService = {
  // Get all published tenders
  getAllPublished: async (filters = {}) => {
    try {
      let queryConstraints = [
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      ];

      if (filters.department) {
        queryConstraints.unshift(where('department', '==', filters.department));
      }

      if (filters.category) {
        queryConstraints.unshift(where('category', '==', filters.category));
      }

      if (filters.limit) {
        queryConstraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, 'procurement_tenders'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const tenders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
          publishedAt: data.publishedAt?.toDate?.().toISOString() || new Date().toISOString(),
          closingDate: data.closingDate || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          bidOpeningDate: data.bidOpeningDate || new Date(Date.now() + 46 * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      return { data: tenders, error: null };
    } catch (error) {
      console.error('Error fetching tenders:', error);
      return { data: [], error };
    }
  },

  // Get tender by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'procurement_tenders', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Tender not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching tender:', error);
      return { data: null, error };
    }
  },

  // Submit bid
  submitBid: async (tenderId, bidData) => {
    try {
      const bidId = `BID-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...bidData,
        tenderId,
        bidId,
        applicationType: 'tender',
        status: 'submitted',
        workflowStage: 'initial_review',
        reviewers: [],
        evaluationScores: {},
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'procurement_bids'), dataToSave);

      // Update tender bid count
      const tenderRef = doc(db, 'procurement_tenders', tenderId);
      const tenderSnap = await getDoc(tenderRef);
      if (tenderSnap.exists()) {
        const currentCount = tenderSnap.data().bidCount || 0;
        await updateDoc(tenderRef, {
          bidCount: currentCount + 1,
          updatedAt: serverTimestamp()
        });
      }

      return { data: { id: docRef.id, bidId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting bid:', error);
      return { data: null, error };
    }
  },

  // Create new tender (admin only)
  create: async (tenderData) => {
    try {
      const tenderId = `TND-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...tenderData,
        tenderId,
        status: tenderData.status || 'draft',
        bidCount: 0,
        shortlistedCount: 0,
        evaluatedCount: 0,
        awardedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'procurement_tenders'), dataToSave);
      return { data: { id: docRef.id, tenderId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating tender:', error);
      return { data: null, error };
    }
  },

  // Update tender (admin only)
  update: async (id, updateData) => {
    try {
      const docRef = doc(db, 'procurement_tenders', id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating tender:', error);
      return { data: null, error };
    }
  },

  // Delete tender (admin only)
  delete: async (id) => {
    try {
      const docRef = doc(db, 'procurement_tenders', id);
      await deleteDoc(docRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting tender:', error);
      return { data: null, error };
    }
  }
};

// ==================== USER APPLICATIONS SERVICE ====================

export const userApplicationsService = {
  // Get user's applications (both jobs and tenders)
  getUserApplications: async (userId) => {
    try {
      // Get job applications
      const jobAppsQuery = query(
        collection(db, 'recruitment_applications'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );

      // Get tender bids
      const bidAppsQuery = query(
        collection(db, 'procurement_bids'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );

      const [jobAppsSnapshot, bidAppsSnapshot] = await Promise.all([
        getDocs(jobAppsQuery),
        getDocs(bidAppsQuery)
      ]);

      const jobApplications = jobAppsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'job',
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate?.().toISOString()
      }));

      const tenderApplications = bidAppsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'tender',
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate?.().toISOString()
      }));

      return {
        data: {
          jobs: jobApplications,
          tenders: tenderApplications,
          all: [...jobApplications, ...tenderApplications].sort((a, b) =>
            new Date(b.submittedAt) - new Date(a.submittedAt)
          )
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching user applications:', error);
      return { data: { jobs: [], tenders: [], all: [] }, error };
    }
  }
};

// ==================== DASHBOARD STATS SERVICE ====================

export const dashboardStatsService = {
  // Get portal statistics
  getStats: async () => {
    try {
      const [jobsSnapshot, tendersSnapshot, jobAppsSnapshot, bidsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'recruitment_vacancies'), where('status', '==', 'published'))),
        getDocs(query(collection(db, 'procurement_tenders'), where('status', '==', 'published'))),
        getDocs(collection(db, 'recruitment_applications')),
        getDocs(collection(db, 'procurement_bids'))
      ]);

      const stats = {
        activeJobs: jobsSnapshot.size,
        openTenders: tendersSnapshot.size,
        totalApplications: jobAppsSnapshot.size + bidsSnapshot.size,
        successRate: 87 // This could be calculated based on selected/awarded applications
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        data: {
          activeJobs: 0,
          openTenders: 0,
          totalApplications: 0,
          successRate: 0
        },
        error
      };
    }
  }
};

// ==================== DOCUMENT UPLOAD SERVICE ====================

export const documentUploadService = {
  // Upload document to Firebase Storage
  uploadDocument: async (file, userId, documentType, additionalPath = '') => {
    try {
      const fileName = `${documentType}_${Date.now()}_${file.name}`;
      const path = additionalPath
        ? `users/${userId}/${additionalPath}/${fileName}`
        : `users/${userId}/${documentType}/${fileName}`;

      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const documentMetadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType,
        downloadURL,
        storagePath: path,
        uploadedAt: new Date().toISOString()
      };

      return { data: documentMetadata, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { data: null, error };
    }
  },

  // Delete document from Firebase Storage
  deleteDocument: async (storagePath) => {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { data: null, error };
    }
  }
};

// ==================== SEED DATA (FOR INITIAL SETUP) ====================

export const seedPortalData = async () => {
  try {
    console.log('Starting to seed portal data...');

    // Seed sample jobs
    const sampleJobs = [
      {
        vacancyId: `JOB-${Date.now()}-001`,
        jobTitle: 'Senior Marine Biologist',
        department: 'Research & Development',
        location: 'Colombo',
        employmentType: 'Full-time',
        salaryRange: 'Rs. 150,000 - 200,000',
        description: 'We are seeking an experienced Marine Biologist to lead our marine ecosystem research projects.',
        qualifications: [
          'Ph.D. in Marine Biology or related field',
          'Minimum 5 years of research experience',
          'Strong publication record in peer-reviewed journals'
        ],
        responsibilities: [
          'Lead marine research projects',
          'Supervise research team',
          'Publish research findings',
          'Collaborate with international partners'
        ],
        numberOfPositions: 2,
        status: 'published',
        publicationStatus: 'published',
        applicationCount: 15,
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        vacancyId: `JOB-${Date.now()}-002`,
        jobTitle: 'Fisheries Extension Officer',
        department: 'Community Outreach',
        location: 'Multiple Locations',
        employmentType: 'Full-time',
        salaryRange: 'Rs. 80,000 - 100,000',
        description: 'Join our team to work directly with fishing communities and promote sustainable practices.',
        qualifications: [
          'Bachelor\'s degree in Fisheries Science or related field',
          'Experience working with fishing communities',
          'Fluent in Sinhala, Tamil, and English'
        ],
        responsibilities: [
          'Conduct community outreach programs',
          'Provide technical guidance to fishermen',
          'Organize training workshops',
          'Monitor fisheries practices'
        ],
        numberOfPositions: 5,
        status: 'published',
        publicationStatus: 'published',
        applicationCount: 28,
        closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        vacancyId: `JOB-${Date.now()}-003`,
        jobTitle: 'Data Analyst (Aquatic Resources)',
        department: 'Information Technology',
        location: 'Colombo',
        employmentType: 'Full-time',
        salaryRange: 'Rs. 100,000 - 130,000',
        description: 'Analyze aquatic resource data and develop insights to support research and policy decisions.',
        qualifications: [
          'Bachelor\'s degree in Statistics, Data Science, or related field',
          'Proficiency in R, Python, and data visualization tools',
          'Experience with GIS software is a plus'
        ],
        responsibilities: [
          'Analyze fisheries and marine data',
          'Create data visualizations and reports',
          'Develop predictive models',
          'Support research teams with statistical analysis'
        ],
        numberOfPositions: 1,
        status: 'published',
        publicationStatus: 'published',
        applicationCount: 22,
        closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // Seed sample tenders
    const sampleTenders = [
      {
        tenderId: `TND-${Date.now()}-001`,
        title: 'Supply of Research Vessel Equipment',
        department: 'Procurement',
        category: 'Equipment',
        tenderValue: 'Rs. 25,000,000',
        description: 'NARA invites bids for the supply and installation of advanced research equipment for our marine research vessel.',
        requiredDocuments: [
          'Valid business registration certificate',
          'Tax compliance certificate',
          'Technical specifications compliance',
          'Previous project references',
          'Financial statements (last 3 years)'
        ],
        specifications: [
          'CTD (Conductivity, Temperature, Depth) profiler',
          'Multi-beam echo sounder',
          'Water sampling equipment',
          'Laboratory analysis equipment'
        ],
        eligibilityCriteria: [
          'Registered company with minimum 5 years experience',
          'Previous experience in marine equipment supply',
          'Authorized dealer/distributor of equipment manufacturers',
          'Technical support capability in Sri Lanka'
        ],
        status: 'published',
        publicationStatus: 'published',
        bidCount: 8,
        closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        bidOpeningDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        tenderId: `TND-${Date.now()}-002`,
        title: 'Construction of Coastal Laboratory Facility',
        department: 'Infrastructure',
        category: 'Construction',
        tenderValue: 'Rs. 150,000,000',
        description: 'NARA seeks qualified contractors for the construction of a modern coastal research laboratory facility in Galle.',
        requiredDocuments: [
          'CIDA/ICTAD registration certificate (Grade C1 or above)',
          'Valid business registration',
          'Tax compliance certificate',
          'Bank guarantee capability letter',
          'Similar project portfolio',
          'Technical and financial proposals'
        ],
        specifications: [
          'Two-story laboratory building (15,000 sq ft)',
          'Specialized wet lab facilities',
          'Seawater circulation systems',
          'Climate-controlled storage',
          'Office and administrative spaces'
        ],
        eligibilityCriteria: [
          'CIDA/ICTAD Grade C1 or above',
          'Minimum 10 years construction experience',
          'Completed at least 3 similar projects',
          'Annual turnover minimum Rs. 100 million',
          'No ongoing litigation'
        ],
        status: 'published',
        publicationStatus: 'published',
        bidCount: 5,
        closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        bidOpeningDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        tenderId: `TND-${Date.now()}-003`,
        title: 'Supply of Laboratory Consumables (Annual)',
        department: 'Procurement',
        category: 'Supplies',
        tenderValue: 'Rs. 8,000,000',
        description: 'Supply of laboratory consumables and chemicals for marine research activities for one year period.',
        requiredDocuments: [
          'Valid business registration',
          'Import/distribution licenses',
          'Product catalogs with specifications',
          'Price quotations',
          'Delivery capability confirmation'
        ],
        specifications: [
          'High-quality laboratory chemicals and reagents',
          'Consumables (pipettes, tubes, plates, etc.)',
          'Sample collection materials',
          'Safety equipment and supplies'
        ],
        eligibilityCriteria: [
          'Authorized distributor of reputed brands',
          'Minimum 3 years in laboratory supply business',
          'Local stock availability',
          'Delivery within 2 weeks of order',
          'After-sales support'
        ],
        status: 'published',
        publicationStatus: 'published',
        bidCount: 12,
        closingDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        bidOpeningDate: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000).toISOString(),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // Add jobs to Firestore
    for (const job of sampleJobs) {
      await addDoc(collection(db, 'recruitment_vacancies'), job);
      console.log(`Added job: ${job.jobTitle}`);
    }

    // Add tenders to Firestore
    for (const tender of sampleTenders) {
      await addDoc(collection(db, 'procurement_tenders'), tender);
      console.log(`Added tender: ${tender.title}`);
    }

    console.log('Portal data seeded successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding portal data:', error);
    return { success: false, error };
  }
};

export default {
  jobsService,
  tendersService,
  userApplicationsService,
  dashboardStatsService,
  documentUploadService,
  seedPortalData
};
