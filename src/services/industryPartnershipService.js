/**
 * Industry Partnership Dashboard Service
 *
 * Facilitates public-private partnerships in blue economy
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const partnerRegistryService = {
  register: async (partnerData) => {
    try {
      const partnerId = `PARTNER-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        partnerId,
        ...partnerData,
        status: 'active',
        projectCount: 0,
        investmentTotal: 0,
        registeredAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'industry_partners'), dataToSave);
      return { data: { id: docRef.id, partnerId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'industry_partners'), orderBy('registeredAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const proposalService = {
  submit: async (proposalData) => {
    try {
      const proposalId = `PROPOSAL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        proposalId,
        ...proposalData,
        status: 'submitted',
        approvals: [],
        submittedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'partnership_proposals'), dataToSave);
      return { data: { id: docRef.id, proposalId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'partnership_proposals'), orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  approve: async (id, approverData) => {
    try {
      const docRef = doc(db, 'partnership_proposals', id);
      await updateDoc(docRef, {
        status: 'approved',
        approvedBy: approverData.approver,
        approvedAt: serverTimestamp()
      });
      return { data: { id, status: 'approved' }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const projectManagementService = {
  create: async (projectData) => {
    try {
      const projectId = `PROJECT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        projectId,
        ...projectData,
        status: 'active',
        milestones: [],
        roi: 0,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'partnership_projects'), dataToSave);

      // Update partner project count
      await updateDoc(doc(db, 'industry_partners', projectData.partnerId), {
        projectCount: increment(1),
        investmentTotal: increment(projectData.investmentAmount || 0)
      });

      return { data: { id: docRef.id, projectId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'partnership_projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const analyticsService = {
  getStats: async () => {
    try {
      const partnersSnapshot = await getDocs(collection(db, 'industry_partners'));
      const proposalsSnapshot = await getDocs(collection(db, 'partnership_proposals'));
      const projectsSnapshot = await getDocs(collection(db, 'partnership_projects'));

      const partners = partnersSnapshot.docs.map(doc => doc.data());
      const proposals = proposalsSnapshot.docs.map(doc => doc.data());
      const projects = projectsSnapshot.docs.map(doc => doc.data());

      return {
        data: {
          totalPartners: partners.length,
          activePartners: partners.filter(p => p.status === 'active').length,
          totalProposals: proposals.length,
          approvedProposals: proposals.filter(p => p.status === 'approved').length,
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'active').length,
          totalInvestment: partners.reduce((sum, p) => sum + (p.investmentTotal || 0), 0)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export default {
  partnerRegistryService,
  proposalService,
  projectManagementService,
  analyticsService
};
