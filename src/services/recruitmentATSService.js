// NARA Recruitment ATS (Applicant Tracking System) Service
// Firebase Firestore-based service for enhanced HR operations

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

// ==================== VACANCY MANAGEMENT SERVICE ====================
// Complete vacancy lifecycle from creation to closure

export const vacancyService = {
  // Create new vacancy
  create: async (vacancyData) => {
    try {
      const vacancyId = `VAC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...vacancyData,
        vacancyId,
        status: 'draft', // 'draft' | 'pending_approval' | 'approved' | 'published' | 'closed' | 'cancelled'
        workflowStatus: 'created',
        approvals: [],
        publicationStatus: 'unpublished',
        applicationCount: 0,
        shortlistedCount: 0,
        interviewedCount: 0,
        selectedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Auto-close date calculation
      if (vacancyData.closingDate) {
        dataToSave.closingDate = new Date(vacancyData.closingDate).toISOString();
        dataToSave.autoCloseScheduled = true;
      }

      const docRef = await addDoc(collection(db, 'recruitment_vacancies'), dataToSave);
      return { data: { id: docRef.id, vacancyId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error creating vacancy:', error);
      return { data: null, error };
    }
  },

  // Update vacancy
  update: async (id, updateData) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating vacancy:', error);
      return { data: null, error };
    }
  },

  // Submit for approval
  submitForApproval: async (id, submittedBy) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        status: 'pending_approval',
        workflowStatus: 'pending_approval',
        submittedBy,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error submitting vacancy for approval:', error);
      return { data: null, error };
    }
  },

  // Approve vacancy (supports multi-level approval)
  approve: async (id, approvalData) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Vacancy not found') };
      }

      const vacancy = docSnap.data();
      const existingApprovals = vacancy.approvals || [];

      const newApproval = {
        approver: approvalData.approver,
        approverRole: approvalData.approverRole,
        approvalLevel: approvalData.approvalLevel || existingApprovals.length + 1,
        status: 'approved',
        comments: approvalData.comments || '',
        approvedAt: new Date().toISOString()
      };

      const updatedApprovals = [...existingApprovals, newApproval];

      // Check if all required approvals are met (e.g., 2 levels)
      const requiredApprovalLevels = vacancy.requiredApprovalLevels || 2;
      const allApproved = updatedApprovals.length >= requiredApprovalLevels;

      await updateDoc(docRef, {
        approvals: updatedApprovals,
        status: allApproved ? 'approved' : 'pending_approval',
        workflowStatus: allApproved ? 'approved' : 'pending_approval',
        ...(allApproved && { approvedAt: serverTimestamp() }),
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, allApproved }, error: null };
    } catch (error) {
      console.error('Error approving vacancy:', error);
      return { data: null, error };
    }
  },

  // Reject vacancy
  reject: async (id, rejectionData) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        status: 'draft',
        workflowStatus: 'rejected',
        rejectedBy: rejectionData.rejectedBy,
        rejectionReason: rejectionData.reason,
        rejectionComments: rejectionData.comments,
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error rejecting vacancy:', error);
      return { data: null, error };
    }
  },

  // Publish vacancy
  publish: async (id, publicationChannels = []) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        status: 'published',
        publicationStatus: 'published',
        publicationChannels, // ['website', 'psc', 'gazette', 'newspapers']
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error publishing vacancy:', error);
      return { data: null, error };
    }
  },

  // Close vacancy (manual or auto-close on deadline)
  close: async (id, closureReason = 'deadline_reached') => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      await updateDoc(docRef, {
        status: 'closed',
        publicationStatus: 'closed',
        closureReason,
        closedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error closing vacancy:', error);
      return { data: null, error };
    }
  },

  // Get all vacancies with filters
  getAll: async (filters = {}) => {
    try {
      let queryConstraints = [orderBy('createdAt', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.department) {
        queryConstraints.unshift(where('department', '==', filters.department));
      }

      if (filters.limit) {
        queryConstraints.push(firestoreLimit(filters.limit));
      }

      const q = query(collection(db, 'recruitment_vacancies'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const vacancies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString()
      }));

      return { data: vacancies, error: null };
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      return { data: [], error };
    }
  },

  // Get vacancy by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'recruitment_vacancies', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Vacancy not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching vacancy:', error);
      return { data: null, error };
    }
  },

  // Check and auto-close vacancies past deadline
  checkAutoClose: async () => {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'recruitment_vacancies'),
        where('status', '==', 'published'),
        where('autoCloseScheduled', '==', true)
      );

      const snapshot = await getDocs(q);
      const closedVacancies = [];

      for (const docSnap of snapshot.docs) {
        const vacancy = docSnap.data();
        const closingDate = new Date(vacancy.closingDate);

        if (closingDate <= now) {
          await vacancyService.close(docSnap.id, 'deadline_reached');
          closedVacancies.push(vacancy.vacancyId);
        }
      }

      return { data: { closedCount: closedVacancies.length, closedVacancies }, error: null };
    } catch (error) {
      console.error('Error in auto-close check:', error);
      return { data: null, error };
    }
  }
};

// ==================== APPLICATION MANAGEMENT SERVICE ====================
// Handle job applications with routing and approval workflows

export const applicationService = {
  // Submit application
  submit: async (applicationData) => {
    try {
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...applicationData,
        applicationId,
        status: 'submitted', // 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected'
        workflowStage: 'initial_review',
        reviewers: [],
        scores: {},
        interviewSchedules: [],
        documents: applicationData.documents || [],
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'recruitment_applications'), dataToSave);

      // Update vacancy application count
      const vacancyRef = doc(db, 'recruitment_vacancies', applicationData.vacancyId);
      const vacancySnap = await getDoc(vacancyRef);
      if (vacancySnap.exists()) {
        const currentCount = vacancySnap.data().applicationCount || 0;
        await updateDoc(vacancyRef, { applicationCount: currentCount + 1 });
      }

      return { data: { id: docRef.id, applicationId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error submitting application:', error);
      return { data: null, error };
    }
  },

  // Update application status
  updateStatus: async (id, status, notes = '') => {
    try {
      const docRef = doc(db, 'recruitment_applications', id);
      await updateDoc(docRef, {
        status,
        statusNotes: notes,
        statusUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { data: null, error };
    }
  },

  // Route application to reviewer
  routeToReviewer: async (id, reviewerData) => {
    try {
      const docRef = doc(db, 'recruitment_applications', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Application not found') };
      }

      const application = docSnap.data();
      const existingReviewers = application.reviewers || [];

      const newReviewer = {
        reviewerId: reviewerData.reviewerId,
        reviewerName: reviewerData.reviewerName,
        reviewerRole: reviewerData.reviewerRole,
        assignedAt: new Date().toISOString(),
        reviewStatus: 'pending' // 'pending' | 'in_progress' | 'completed'
      };

      await updateDoc(docRef, {
        reviewers: [...existingReviewers, newReviewer],
        status: 'under_review',
        workflowStage: 'review',
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error routing application:', error);
      return { data: null, error };
    }
  },

  // Shortlist application
  shortlist: async (id, shortlistedBy, notes = '') => {
    try {
      const docRef = doc(db, 'recruitment_applications', id);
      await updateDoc(docRef, {
        status: 'shortlisted',
        workflowStage: 'shortlisted',
        shortlistedBy,
        shortlistedNotes: notes,
        shortlistedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update vacancy shortlisted count
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const application = docSnap.data();
        const vacancyRef = doc(db, 'recruitment_vacancies', application.vacancyId);
        const vacancySnap = await getDoc(vacancyRef);
        if (vacancySnap.exists()) {
          const currentCount = vacancySnap.data().shortlistedCount || 0;
          await updateDoc(vacancyRef, { shortlistedCount: currentCount + 1 });
        }
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error shortlisting application:', error);
      return { data: null, error };
    }
  },

  // Get all applications for a vacancy
  getByVacancy: async (vacancyId, filters = {}) => {
    try {
      let queryConstraints = [
        where('vacancyId', '==', vacancyId),
        orderBy('submittedAt', 'desc')
      ];

      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }

      const q = query(collection(db, 'recruitment_applications'), ...queryConstraints);
      const snapshot = await getDocs(q);

      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate().toISOString(),
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }));

      return { data: applications, error: null };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { data: [], error };
    }
  },

  // Get application by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, 'recruitment_applications', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Application not found') };
      }

      const data = docSnap.data();
      return {
        data: {
          id: docSnap.id,
          ...data,
          submittedAt: data.submittedAt?.toDate().toISOString(),
          createdAt: data.createdAt?.toDate().toISOString()
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching application:', error);
      return { data: null, error };
    }
  }
};

// ==================== INTERVIEW TRACKING SERVICE ====================
// Multi-stage interview management with scheduling

export const interviewService = {
  // Schedule interview
  schedule: async (interviewData) => {
    try {
      const interviewId = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const dataToSave = {
        ...interviewData,
        interviewId,
        status: 'scheduled', // 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
        stage: interviewData.stage || 1, // Interview stage/round
        type: interviewData.type || 'technical', // 'technical' | 'hr' | 'panel' | 'practical'
        interviewers: interviewData.interviewers || [],
        scores: {},
        feedback: [],
        scheduledDate: new Date(interviewData.scheduledDate).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'recruitment_interviews'), dataToSave);

      // Update application with interview schedule
      const applicationRef = doc(db, 'recruitment_applications', interviewData.applicationId);
      const applicationSnap = await getDoc(applicationRef);
      if (applicationSnap.exists()) {
        const application = applicationSnap.data();
        const existingSchedules = application.interviewSchedules || [];
        await updateDoc(applicationRef, {
          status: 'interviewed',
          workflowStage: 'interview',
          interviewSchedules: [...existingSchedules, { interviewId, stage: dataToSave.stage, scheduledDate: dataToSave.scheduledDate }]
        });

        // Update vacancy interviewed count
        const vacancyRef = doc(db, 'recruitment_vacancies', application.vacancyId);
        const vacancySnap = await getDoc(vacancyRef);
        if (vacancySnap.exists()) {
          const currentCount = vacancySnap.data().interviewedCount || 0;
          await updateDoc(vacancyRef, { interviewedCount: currentCount + 1 });
        }
      }

      return { data: { id: docRef.id, interviewId, ...dataToSave }, error: null };
    } catch (error) {
      console.error('Error scheduling interview:', error);
      return { data: null, error };
    }
  },

  // Add interviewer feedback
  addFeedback: async (interviewId, feedbackData) => {
    try {
      const docRef = doc(db, 'recruitment_interviews', interviewId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Interview not found') };
      }

      const interview = docSnap.data();
      const existingFeedback = interview.feedback || [];

      const newFeedback = {
        interviewerId: feedbackData.interviewerId,
        interviewerName: feedbackData.interviewerName,
        comments: feedbackData.comments,
        recommendation: feedbackData.recommendation, // 'recommend' | 'strong_recommend' | 'neutral' | 'not_recommend'
        submittedAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        feedback: [...existingFeedback, newFeedback],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error adding interview feedback:', error);
      return { data: null, error };
    }
  },

  // Complete interview with overall result
  complete: async (interviewId, completionData) => {
    try {
      const docRef = doc(db, 'recruitment_interviews', interviewId);
      await updateDoc(docRef, {
        status: 'completed',
        overallResult: completionData.result, // 'pass' | 'fail'
        overallComments: completionData.comments,
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error completing interview:', error);
      return { data: null, error };
    }
  },

  // Get interviews for an application
  getByApplication: async (applicationId) => {
    try {
      const q = query(
        collection(db, 'recruitment_interviews'),
        where('applicationId', '==', applicationId),
        orderBy('stage', 'asc')
      );

      const snapshot = await getDocs(q);
      const interviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate,
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }));

      return { data: interviews, error: null };
    } catch (error) {
      console.error('Error fetching interviews:', error);
      return { data: [], error };
    }
  }
};

// ==================== CANDIDATE SCORING/RANKING SERVICE ====================
// Evaluate and rank candidates

export const scoringService = {
  // Add/Update candidate score
  scoreCandidate: async (applicationId, scoreData) => {
    try {
      const docRef = doc(db, 'recruitment_applications', applicationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Application not found') };
      }

      const application = docSnap.data();
      const existingScores = application.scores || {};

      // Score categories: education, experience, skills, interview, overall
      const newScore = {
        ...existingScores,
        [scoreData.category]: {
          score: scoreData.score,
          maxScore: scoreData.maxScore || 100,
          scoredBy: scoreData.scoredBy,
          comments: scoreData.comments || '',
          scoredAt: new Date().toISOString()
        }
      };

      // Calculate total score
      const totalScore = Object.values(newScore).reduce((sum, item) => sum + (item.score || 0), 0);
      const maxTotalScore = Object.values(newScore).reduce((sum, item) => sum + (item.maxScore || 100), 0);
      const percentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

      await updateDoc(docRef, {
        scores: newScore,
        totalScore,
        scorePercentage: percentage,
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, totalScore, scorePercentage: percentage }, error: null };
    } catch (error) {
      console.error('Error scoring candidate:', error);
      return { data: null, error };
    }
  },

  // Get ranked candidates for a vacancy
  getRankedCandidates: async (vacancyId, minScorePercentage = 0) => {
    try {
      const q = query(
        collection(db, 'recruitment_applications'),
        where('vacancyId', '==', vacancyId),
        where('status', 'in', ['shortlisted', 'interviewed', 'selected'])
      );

      const snapshot = await getDocs(q);
      let candidates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by minimum score
      candidates = candidates.filter(c => (c.scorePercentage || 0) >= minScorePercentage);

      // Sort by score percentage (descending)
      candidates.sort((a, b) => (b.scorePercentage || 0) - (a.scorePercentage || 0));

      // Add ranking
      candidates = candidates.map((candidate, index) => ({
        ...candidate,
        rank: index + 1
      }));

      return { data: candidates, error: null };
    } catch (error) {
      console.error('Error fetching ranked candidates:', error);
      return { data: [], error };
    }
  }
};

// ==================== PSC/GAZETTE EXPORT SERVICE ====================
// Generate export templates for Public Service Commission and Gazette publication

export const exportService = {
  // Generate PSC template
  generatePSCTemplate: async (vacancyId) => {
    try {
      const vacancyRef = doc(db, 'recruitment_vacancies', vacancyId);
      const vacancySnap = await getDoc(vacancyRef);

      if (!vacancySnap.exists()) {
        return { data: null, error: new Error('Vacancy not found') };
      }

      const vacancy = vacancySnap.data();

      const pscTemplate = {
        organization: 'National Aquatic Resources Research and Development Agency (NARA)',
        vacancyReference: vacancy.vacancyId,
        position: vacancy.jobTitle,
        grade: vacancy.grade || '',
        salary: vacancy.salaryRange || '',
        numberOfVacancies: vacancy.numberOfPositions || 1,
        qualifications: vacancy.qualifications || [],
        duties: vacancy.duties || '',
        closingDate: vacancy.closingDate,
        applicationMethod: vacancy.applicationMethod || 'Online via NARA Careers Portal',
        contactInfo: vacancy.contactInfo || '',
        generatedAt: new Date().toISOString(),
        generatedFor: 'Public Service Commission',
        format: 'PSC Standard Format'
      };

      return { data: pscTemplate, error: null };
    } catch (error) {
      console.error('Error generating PSC template:', error);
      return { data: null, error };
    }
  },

  // Generate Gazette template
  generateGazetteTemplate: async (vacancyId) => {
    try {
      const vacancyRef = doc(db, 'recruitment_vacancies', vacancyId);
      const vacancySnap = await getDoc(vacancyRef);

      if (!vacancySnap.exists()) {
        return { data: null, error: new Error('Vacancy not found') };
      }

      const vacancy = vacancySnap.data();

      const gazetteTemplate = {
        header: 'GOVERNMENT OF SRI LANKA - GOVERNMENT GAZETTE',
        section: 'APPOINTMENTS, TRANSFERS, AND RESIGNATIONS',
        organization: 'National Aquatic Resources Research and Development Agency (NARA)',
        ministry: vacancy.ministry || 'Ministry of Fisheries',
        vacancyReference: vacancy.vacancyId,
        position: vacancy.jobTitle,
        department: vacancy.department || '',
        serviceCategory: vacancy.serviceCategory || 'Public Service',
        grade: vacancy.grade || '',
        salary: vacancy.salaryRange || '',
        numberOfVacancies: vacancy.numberOfPositions || 1,
        essentialQualifications: vacancy.qualifications || [],
        desirableQualifications: vacancy.desirableQualifications || [],
        dutiesAndResponsibilities: vacancy.duties || '',
        closingDate: vacancy.closingDate,
        applicationProcedure: vacancy.applicationMethod || 'Applications should be submitted online through the NARA Careers Portal',
        contactPerson: vacancy.contactPerson || 'Director - Human Resources',
        contactAddress: vacancy.contactAddress || 'NARA, Crow Island, Colombo 15, Sri Lanka',
        contactPhone: vacancy.contactPhone || '',
        contactEmail: vacancy.contactEmail || '',
        generatedAt: new Date().toISOString(),
        generatedFor: 'Government Gazette',
        format: 'Gazette Notice Format'
      };

      return { data: gazetteTemplate, error: null };
    } catch (error) {
      console.error('Error generating Gazette template:', error);
      return { data: null, error };
    }
  },

  // Export vacancy as JSON
  exportVacancyJSON: async (vacancyId) => {
    try {
      const vacancyRef = doc(db, 'recruitment_vacancies', vacancyId);
      const vacancySnap = await getDoc(vacancyRef);

      if (!vacancySnap.exists()) {
        return { data: null, error: new Error('Vacancy not found') };
      }

      const vacancy = vacancySnap.data();
      const jsonData = JSON.stringify(vacancy, null, 2);

      return { data: { json: jsonData, vacancy }, error: null };
    } catch (error) {
      console.error('Error exporting vacancy:', error);
      return { data: null, error };
    }
  }
};

// ==================== DOCUMENT MANAGEMENT SERVICE ====================
// Handle application documents upload/download

export const documentService = {
  // Upload application document
  uploadDocument: async (file, applicationId, documentType) => {
    try {
      const fileName = `${documentType}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `recruitment_documents/${applicationId}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const documentMetadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType,
        downloadURL,
        storagePath: `recruitment_documents/${applicationId}/${fileName}`,
        uploadedAt: new Date().toISOString()
      };

      // Update application with document reference
      const applicationRef = doc(db, 'recruitment_applications', applicationId);
      const applicationSnap = await getDoc(applicationRef);
      if (applicationSnap.exists()) {
        const application = applicationSnap.data();
        const existingDocuments = application.documents || [];
        await updateDoc(applicationRef, {
          documents: [...existingDocuments, documentMetadata]
        });
      }

      return { data: documentMetadata, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { data: null, error };
    }
  },

  // Delete document
  deleteDocument: async (applicationId, storagePath) => {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      // Remove from application documents array
      const applicationRef = doc(db, 'recruitment_applications', applicationId);
      const applicationSnap = await getDoc(applicationRef);
      if (applicationSnap.exists()) {
        const application = applicationSnap.data();
        const updatedDocuments = (application.documents || []).filter(d => d.storagePath !== storagePath);
        await updateDoc(applicationRef, { documents: updatedDocuments });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { data: null, error };
    }
  }
};

// ==================== DASHBOARD/ANALYTICS SERVICE ====================
// Recruitment statistics and insights

export const recruitmentDashboardService = {
  getStatistics: async (filters = {}) => {
    try {
      const vacanciesQuery = query(collection(db, 'recruitment_vacancies'));
      const applicationsQuery = query(collection(db, 'recruitment_applications'));

      const [vacanciesSnapshot, applicationsSnapshot] = await Promise.all([
        getDocs(vacanciesQuery),
        getDocs(applicationsQuery)
      ]);

      const vacancies = vacanciesSnapshot.docs.map(doc => doc.data());
      const applications = applicationsSnapshot.docs.map(doc => doc.data());

      const stats = {
        vacancies: {
          total: vacancies.length,
          draft: vacancies.filter(v => v.status === 'draft').length,
          pending_approval: vacancies.filter(v => v.status === 'pending_approval').length,
          published: vacancies.filter(v => v.status === 'published').length,
          closed: vacancies.filter(v => v.status === 'closed').length
        },
        applications: {
          total: applications.length,
          submitted: applications.filter(a => a.status === 'submitted').length,
          under_review: applications.filter(a => a.status === 'under_review').length,
          shortlisted: applications.filter(a => a.status === 'shortlisted').length,
          interviewed: applications.filter(a => a.status === 'interviewed').length,
          selected: applications.filter(a => a.status === 'selected').length,
          rejected: applications.filter(a => a.status === 'rejected').length
        },
        insights: {
          averageApplicationsPerVacancy: vacancies.length > 0 ? Math.round(applications.length / vacancies.length) : 0,
          totalShortlistedRate: applications.length > 0
            ? Math.round((applications.filter(a => a.status === 'shortlisted').length / applications.length) * 100)
            : 0,
          totalSelectionRate: applications.length > 0
            ? Math.round((applications.filter(a => a.status === 'selected').length / applications.length) * 100)
            : 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching recruitment statistics:', error);
      return { data: null, error };
    }
  }
};

export default {
  vacancyService,
  applicationService,
  interviewService,
  scoringService,
  exportService,
  documentService,
  recruitmentDashboardService
};
