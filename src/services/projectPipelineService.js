import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Projects Service
// ============================================

export const projectsService = {
  /**
   * Get all projects with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'research_projects');
      const queryConstraints = [orderBy('startDate', 'desc')];

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.ragStatus) {
        queryConstraints.unshift(where('ragStatus', '==', filters.ragStatus));
      }

      if (filters.division) {
        queryConstraints.unshift(where('division', '==', filters.division));
      }

      if (filters.fundingSource) {
        queryConstraints.unshift(where('fundingSource', '==', filters.fundingSource));
      }

      if (filters.visibility) {
        queryConstraints.unshift(where('visibility', '==', filters.visibility));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: projects, error: null };
    } catch (error) {
      console.error('Error getting projects:', error);
      return { data: [], error };
    }
  },

  /**
   * Get project by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'research_projects', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      // Increment view count for public projects
      if (docSnap.data().visibility === 'public') {
        await updateDoc(docRef, {
          viewCount: (docSnap.data().viewCount || 0) + 1
        });
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting project:', error);
      return { data: null, error };
    }
  },

  /**
   * Create project
   */
  create: async (projectData) => {
    try {
      const projectId = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const docRef = await addDoc(collection(db, 'research_projects'), {
        ...projectData,
        projectId,
        status: projectData.status || 'planning',
        ragStatus: projectData.ragStatus || 'green',
        visibility: projectData.visibility || 'internal',
        viewCount: 0,
        milestones: projectData.milestones || [],
        outputs: projectData.outputs || [],
        team: projectData.team || [],
        budgetSpent: 0,
        completionPercentage: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        data: {
          id: docRef.id,
          projectId,
          ...projectData
        },
        error: null
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return { data: null, error };
    }
  },

  /**
   * Update project
   */
  update: async (id, projectData) => {
    try {
      const docRef = doc(db, 'research_projects', id);
      await updateDoc(docRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });

      return { data: { id, ...projectData }, error: null };
    } catch (error) {
      console.error('Error updating project:', error);
      return { data: null, error };
    }
  },

  /**
   * Update RAG status
   */
  updateRAGStatus: async (id, ragStatus, ragNotes = '') => {
    try {
      const docRef = doc(db, 'research_projects', id);
      await updateDoc(docRef, {
        ragStatus,
        ragNotes,
        lastRAGUpdate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating RAG status:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete project
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'research_projects', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Milestones Service
// ============================================

export const milestonesService = {
  /**
   * Add milestone to project
   */
  add: async (projectId, milestoneData) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const existingMilestones = docSnap.data().milestones || [];
      const newMilestone = {
        milestoneId: `MS-${Date.now()}`,
        title: milestoneData.title,
        description: milestoneData.description,
        targetDate: milestoneData.targetDate,
        completedDate: null,
        status: 'pending',
        deliverables: milestoneData.deliverables || [],
        createdAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        milestones: [...existingMilestones, newMilestone],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, milestone: newMilestone }, error: null };
    } catch (error) {
      console.error('Error adding milestone:', error);
      return { data: null, error };
    }
  },

  /**
   * Update milestone status
   */
  updateStatus: async (projectId, milestoneId, status, completedDate = null) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const milestones = docSnap.data().milestones || [];
      const updatedMilestones = milestones.map(m => {
        if (m.milestoneId === milestoneId) {
          return {
            ...m,
            status,
            completedDate: status === 'completed' ? completedDate || new Date().toISOString() : null,
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      });

      // Calculate completion percentage
      const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
      const completionPercentage = Math.round((completedCount / updatedMilestones.length) * 100);

      await updateDoc(docRef, {
        milestones: updatedMilestones,
        completionPercentage,
        updatedAt: serverTimestamp()
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error updating milestone status:', error);
      return { data: null, error };
    }
  },

  /**
   * Get project milestones
   */
  getByProject: async (projectId) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: [], error: new Error('Project not found') };
      }

      return {
        data: docSnap.data().milestones || [],
        error: null
      };
    } catch (error) {
      console.error('Error getting milestones:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Outputs Service
// ============================================

export const outputsService = {
  /**
   * Add output to project
   */
  add: async (projectId, outputData) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const existingOutputs = docSnap.data().outputs || [];
      const newOutput = {
        outputId: `OUT-${Date.now()}`,
        type: outputData.type, // 'publication', 'report', 'dataset', 'patent', 'software', 'policy_brief'
        title: outputData.title,
        description: outputData.description,
        url: outputData.url || null,
        fileUrl: outputData.fileUrl || null,
        publishedDate: outputData.publishedDate || new Date().toISOString(),
        authors: outputData.authors || [],
        doi: outputData.doi || null,
        citations: outputData.citations || 0,
        createdAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        outputs: [...existingOutputs, newOutput],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, output: newOutput }, error: null };
    } catch (error) {
      console.error('Error adding output:', error);
      return { data: null, error };
    }
  },

  /**
   * Get project outputs
   */
  getByProject: async (projectId) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: [], error: new Error('Project not found') };
      }

      return {
        data: docSnap.data().outputs || [],
        error: null
      };
    } catch (error) {
      console.error('Error getting outputs:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Budget Tracking Service
// ============================================

export const budgetTrackingService = {
  /**
   * Update budget expenditure
   */
  updateExpenditure: async (projectId, expenditureData) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const project = docSnap.data();
      const existingExpenses = project.expenses || [];

      const newExpense = {
        expenseId: `EXP-${Date.now()}`,
        category: expenditureData.category,
        amount: expenditureData.amount,
        description: expenditureData.description,
        date: expenditureData.date || new Date().toISOString(),
        approvedBy: expenditureData.approvedBy,
        receiptUrl: expenditureData.receiptUrl || null
      };

      const updatedExpenses = [...existingExpenses, newExpense];
      const totalSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const budgetUtilization = project.totalBudget ? Math.round((totalSpent / project.totalBudget) * 100) : 0;

      await updateDoc(docRef, {
        expenses: updatedExpenses,
        budgetSpent: totalSpent,
        budgetUtilization,
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, expense: newExpense }, error: null };
    } catch (error) {
      console.error('Error updating expenditure:', error);
      return { data: null, error };
    }
  },

  /**
   * Get budget summary
   */
  getSummary: async (projectId) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const project = docSnap.data();
      const expenses = project.expenses || [];

      const summary = {
        totalBudget: project.totalBudget || 0,
        budgetSpent: project.budgetSpent || 0,
        budgetRemaining: (project.totalBudget || 0) - (project.budgetSpent || 0),
        budgetUtilization: project.budgetUtilization || 0,
        expensesByCategory: expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {}),
        totalExpenses: expenses.length
      };

      return { data: summary, error: null };
    } catch (error) {
      console.error('Error getting budget summary:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Project Timeline Service
// ============================================

export const projectTimelineService = {
  /**
   * Add timeline event
   */
  addEvent: async (projectId, eventData) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Project not found') };
      }

      const existingTimeline = docSnap.data().timeline || [];
      const newEvent = {
        eventId: `EVT-${Date.now()}`,
        type: eventData.type, // 'milestone', 'update', 'issue', 'achievement'
        title: eventData.title,
        description: eventData.description,
        date: eventData.date || new Date().toISOString(),
        createdBy: eventData.createdBy,
        attachments: eventData.attachments || []
      };

      await updateDoc(docRef, {
        timeline: [...existingTimeline, newEvent],
        updatedAt: serverTimestamp()
      });

      return { data: { success: true, event: newEvent }, error: null };
    } catch (error) {
      console.error('Error adding timeline event:', error);
      return { data: null, error };
    }
  },

  /**
   * Get project timeline
   */
  getTimeline: async (projectId) => {
    try {
      const docRef = doc(db, 'research_projects', projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: [], error: new Error('Project not found') };
      }

      const timeline = docSnap.data().timeline || [];
      return {
        data: timeline.sort((a, b) => new Date(b.date) - new Date(a.date)),
        error: null
      };
    } catch (error) {
      console.error('Error getting timeline:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Dashboard Service
// ============================================

export const projectPipelineDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async (visibility = 'all') => {
    try {
      const filters = visibility === 'public' ? { visibility: 'public' } : {};
      const { data: projects, error } = await projectsService.getAll(filters);

      if (error) return { data: null, error };

      const stats = {
        overview: {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          onHoldProjects: projects.filter(p => p.status === 'on_hold').length,
          totalBudget: projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0),
          totalSpent: projects.reduce((sum, p) => sum + (p.budgetSpent || 0), 0)
        },
        ragStatus: {
          green: projects.filter(p => p.ragStatus === 'green').length,
          amber: projects.filter(p => p.ragStatus === 'amber').length,
          red: projects.filter(p => p.ragStatus === 'red').length
        },
        byDivision: projects.reduce((acc, p) => {
          acc[p.division] = (acc[p.division] || 0) + 1;
          return acc;
        }, {}),
        byFundingSource: projects.reduce((acc, p) => {
          acc[p.fundingSource] = (acc[p.fundingSource] || 0) + 1;
          return acc;
        }, {}),
        recentProjects: projects.slice(0, 5),
        criticalProjects: projects.filter(p => p.ragStatus === 'red' && p.status === 'active').slice(0, 5),
        totalOutputs: projects.reduce((sum, p) => sum + (p.outputs?.length || 0), 0)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting dashboard statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// File Upload Service
// ============================================

export const projectFileService = {
  /**
   * Upload project document
   */
  uploadDocument: async (projectId, file, category) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `project_documents/${projectId}/${category}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading document:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete document
   */
  deleteDocument: async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { data: null, error };
    }
  }
};
