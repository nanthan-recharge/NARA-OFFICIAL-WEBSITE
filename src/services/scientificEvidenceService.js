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
// Fallback Demo Data
// ============================================

const FALLBACK_DOCUMENTS = [
  {
    id: 'doc-1',
    title: 'Marine Biodiversity Assessment of Sri Lankan Coastal Waters 2024',
    abstract: 'Comprehensive assessment of marine biodiversity across Sri Lankan territorial waters, documenting over 1,200 species including 47 newly identified endemic species. This study provides crucial baseline data for conservation planning and sustainable fisheries management.',
    authors: ['Dr. Priya Fernando', 'Dr. Nimal Perera', 'Dr. Kamala Wijesekara'],
    category: 'research_paper',
    policyArea: 'marine_conservation',
    status: 'published',
    viewCount: 2847,
    downloadCount: 892,
    keywords: ['biodiversity', 'marine life', 'conservation', 'endemic species'],
    publishedDate: { toDate: () => new Date('2024-06-15') }
  },
  {
    id: 'doc-2',
    title: 'Climate Change Impacts on Sri Lankan Coral Reef Ecosystems',
    abstract: 'Analysis of temperature-induced coral bleaching events over the past decade, with predictive modeling for future scenarios. Recommendations for reef restoration and marine protected area expansion are provided.',
    authors: ['Dr. Anura Jayasuriya', 'Dr. Kumari Rajapaksa'],
    category: 'technical_report',
    policyArea: 'climate_change',
    status: 'published',
    viewCount: 1956,
    downloadCount: 623,
    keywords: ['climate change', 'coral bleaching', 'reef restoration'],
    publishedDate: { toDate: () => new Date('2024-05-22') }
  },
  {
    id: 'doc-3',
    title: 'Sustainable Fisheries Management Framework for Indian Ocean Tuna',
    abstract: 'Policy framework for sustainable tuna fishing practices, including catch quotas, seasonal restrictions, and gear specifications. Developed in collaboration with IOTC member states.',
    authors: ['Dr. Ayesha Khan', 'Dr. Ranjan De Silva', 'Dr. Maria Santos'],
    category: 'policy_analysis',
    policyArea: 'fisheries_management',
    status: 'published',
    viewCount: 1432,
    downloadCount: 456,
    keywords: ['tuna fishing', 'sustainable fisheries', 'IOTC', 'catch quotas'],
    publishedDate: { toDate: () => new Date('2024-04-10') }
  },
  {
    id: 'doc-4',
    title: 'Integrated Coastal Zone Management: Best Practices for Sri Lanka',
    abstract: 'Comprehensive review of coastal management strategies, addressing erosion control, mangrove restoration, and community-based conservation approaches.',
    authors: ['Dr. Samantha Peris', 'Dr. Lakshmi Narayanan'],
    category: 'review',
    policyArea: 'coastal_management',
    status: 'published',
    viewCount: 1287,
    downloadCount: 398,
    keywords: ['coastal management', 'erosion control', 'mangroves', 'community conservation'],
    publishedDate: { toDate: () => new Date('2024-03-28') }
  },
  {
    id: 'doc-5',
    title: 'Aquaculture Development Strategy 2024-2030',
    abstract: 'Strategic roadmap for sustainable aquaculture expansion in Sri Lanka, targeting increased production while minimizing environmental impacts and promoting rural livelihoods.',
    authors: ['Dr. Chandana Wickremasinghe', 'Dr. Priyani Gunasekara'],
    category: 'policy_analysis',
    policyArea: 'aquaculture',
    status: 'published',
    viewCount: 987,
    downloadCount: 312,
    keywords: ['aquaculture', 'sustainable development', 'rural livelihoods'],
    publishedDate: { toDate: () => new Date('2024-02-15') }
  },
  {
    id: 'doc-6',
    title: 'Annual Fish Stock Assessment Report 2023',
    abstract: 'Detailed assessment of commercially important fish stocks in Sri Lankan waters, including population estimates, recruitment patterns, and catch recommendations.',
    authors: ['NARA Fisheries Research Division'],
    category: 'data_report',
    policyArea: 'fisheries_management',
    status: 'published',
    viewCount: 2156,
    downloadCount: 876,
    keywords: ['fish stocks', 'population assessment', 'catch data'],
    publishedDate: { toDate: () => new Date('2024-01-20') }
  }
];

const FALLBACK_BRIEFS = [
  {
    id: 'brief-1',
    title: 'Urgent Policy Action Required: Coral Reef Protection',
    summary: 'Evidence synthesis for immediate policy intervention to protect threatened coral reef ecosystems. Recommends establishment of new marine protected areas and stricter fishing regulations in sensitive zones.',
    policyArea: 'marine_conservation',
    status: 'published',
    recommendations: [
      'Establish 3 new marine protected areas covering 15,000 hectares',
      'Implement seasonal fishing closures during spawning periods',
      'Increase enforcement budget by 40% for marine patrols'
    ],
    publishedDate: { toDate: () => new Date('2024-06-01') }
  },
  {
    id: 'brief-2',
    title: 'Fisheries Export Market Diversification Strategy',
    summary: 'Analysis of emerging export markets for Sri Lankan seafood products, with specific recommendations for quality certification and trade agreements.',
    policyArea: 'fisheries_management',
    status: 'published',
    recommendations: [
      'Pursue EU IUU fishing white-list certification',
      'Establish bilateral trade agreements with Middle Eastern markets',
      'Invest in cold chain infrastructure for quality assurance'
    ],
    publishedDate: { toDate: () => new Date('2024-05-15') }
  },
  {
    id: 'brief-3',
    title: 'Climate Adaptation Measures for Coastal Communities',
    summary: 'Evidence-based recommendations for protecting vulnerable coastal populations from sea-level rise and extreme weather events.',
    policyArea: 'climate_change',
    status: 'published',
    recommendations: [
      'Implement early warning systems for all coastal districts',
      'Relocate high-risk settlements to safer zones',
      'Restore 500 hectares of mangrove forest as natural barriers'
    ],
    publishedDate: { toDate: () => new Date('2024-04-20') }
  },
  {
    id: 'brief-4',
    title: 'Sustainable Aquaculture Licensing Framework',
    summary: 'Proposed regulatory framework for aquaculture licensing that balances environmental protection with economic development objectives.',
    policyArea: 'aquaculture',
    status: 'published',
    recommendations: [
      'Environmental impact assessment mandatory for all new operations',
      'Zoning regulations to prevent overcrowding',
      'Water quality monitoring requirements for all licensed facilities'
    ],
    publishedDate: { toDate: () => new Date('2024-03-10') }
  }
];

const FALLBACK_VISUALIZATIONS = [
  {
    id: 'viz-1',
    title: 'Fish Catch Trends by Species (2019-2024)',
    description: 'Interactive visualization showing annual catch trends for major commercial fish species in Sri Lankan waters.',
    dataType: 'time_series',
    embedUrl: '/data/visualizations/fish-catch-trends'
  },
  {
    id: 'viz-2',
    title: 'Marine Protected Areas Coverage Map',
    description: 'Geographic visualization of existing and proposed marine protected areas across Sri Lankan territorial waters.',
    dataType: 'geospatial',
    embedUrl: '/data/visualizations/mpa-coverage'
  },
  {
    id: 'viz-3',
    title: 'Sea Surface Temperature Anomalies',
    description: 'Monthly sea surface temperature deviations from historical averages, highlighting climate change impacts.',
    dataType: 'climate_data',
    embedUrl: '/data/visualizations/sst-anomalies'
  },
  {
    id: 'viz-4',
    title: 'Fishing Vessel Activity Heatmap',
    description: 'Real-time visualization of fishing vessel activity based on VMS tracking data.',
    dataType: 'vessel_tracking',
    embedUrl: '/data/visualizations/vessel-activity'
  },
  {
    id: 'viz-5',
    title: 'Aquaculture Production Statistics',
    description: 'Dashboard showing aquaculture production volumes by species and region.',
    dataType: 'production_data',
    embedUrl: '/data/visualizations/aquaculture-stats'
  },
  {
    id: 'viz-6',
    title: 'Export Market Analysis Dashboard',
    description: 'Interactive charts showing seafood export volumes, values, and destination markets.',
    dataType: 'trade_data',
    embedUrl: '/data/visualizations/export-analysis'
  }
];

// ============================================
// Evidence Documents Service
// ============================================

export const evidenceDocumentsService = {
  /**
   * Get all evidence documents with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'evidence_documents');
      const queryConstraints = [orderBy('publishedDate', 'desc')];

      if (filters.category) {
        queryConstraints.unshift(where('category', '==', filters.category));
      }

      if (filters.policyArea) {
        queryConstraints.unshift(where('policyArea', '==', filters.policyArea));
      }

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Return fallback data if Firebase returns empty
      if (documents.length === 0) {
        return { data: FALLBACK_DOCUMENTS, error: null };
      }

      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting evidence documents:', error);
      // Return fallback data on error
      return { data: FALLBACK_DOCUMENTS, error };
    }
  },

  /**
   * Get document by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Document not found') };
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: (docSnap.data().viewCount || 0) + 1
      });

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting document:', error);
      return { data: null, error };
    }
  },

  /**
   * Search documents by keywords
   */
  search: async (searchTerm) => {
    try {
      // In production, use a proper search service like Algolia
      // For now, we'll fetch all and filter client-side
      const { data: documents } = await evidenceDocumentsService.getAll();

      const filtered = documents.filter(doc => {
        const searchLower = searchTerm.toLowerCase();
        return (
          doc.title?.toLowerCase().includes(searchLower) ||
          doc.abstract?.toLowerCase().includes(searchLower) ||
          doc.keywords?.some(k => k.toLowerCase().includes(searchLower)) ||
          doc.authors?.some(a => a.toLowerCase().includes(searchLower))
        );
      });

      return { data: filtered, error: null };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { data: [], error };
    }
  },

  /**
   * Create new evidence document
   */
  create: async (documentData) => {
    try {
      const docRef = await addDoc(collection(db, 'evidence_documents'), {
        ...documentData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...documentData }, error: null };
    } catch (error) {
      console.error('Error creating document:', error);
      return { data: null, error };
    }
  },

  /**
   * Update evidence document
   */
  update: async (id, documentData) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      await updateDoc(docRef, {
        ...documentData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...documentData }, error: null };
    } catch (error) {
      console.error('Error updating document:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete evidence document
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { data: null, error };
    }
  },

  /**
   * Increment download count
   */
  incrementDownload: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          downloadCount: (docSnap.data().downloadCount || 0) + 1
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Policy Briefs Service
// ============================================

export const policyBriefsService = {
  /**
   * Get all policy briefs
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'policy_briefs');
      const queryConstraints = [orderBy('publishedDate', 'desc')];

      if (filters.policyArea) {
        queryConstraints.unshift(where('policyArea', '==', filters.policyArea));
      }

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const briefs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Return fallback data if Firebase returns empty
      if (briefs.length === 0) {
        return { data: FALLBACK_BRIEFS, error: null };
      }

      return { data: briefs, error: null };
    } catch (error) {
      console.error('Error getting policy briefs:', error);
      // Return fallback data on error
      return { data: FALLBACK_BRIEFS, error };
    }
  },

  /**
   * Get policy brief by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Policy brief not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Create policy brief
   */
  create: async (briefData) => {
    try {
      const docRef = await addDoc(collection(db, 'policy_briefs'), {
        ...briefData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...briefData }, error: null };
    } catch (error) {
      console.error('Error creating policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Update policy brief
   */
  update: async (id, briefData) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      await updateDoc(docRef, {
        ...briefData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...briefData }, error: null };
    } catch (error) {
      console.error('Error updating policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete policy brief
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting policy brief:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Data Visualizations Service
// ============================================

export const dataVisualizationsService = {
  /**
   * Get all data visualizations
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'data_visualizations');
      const queryConstraints = [orderBy('createdAt', 'desc')];

      if (filters.dataType) {
        queryConstraints.unshift(where('dataType', '==', filters.dataType));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const visualizations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Return fallback data if Firebase returns empty
      if (visualizations.length === 0) {
        return { data: FALLBACK_VISUALIZATIONS, error: null };
      }

      return { data: visualizations, error: null };
    } catch (error) {
      console.error('Error getting visualizations:', error);
      // Return fallback data on error
      return { data: FALLBACK_VISUALIZATIONS, error };
    }
  },

  /**
   * Get visualization by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Visualization not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Create visualization
   */
  create: async (vizData) => {
    try {
      const docRef = await addDoc(collection(db, 'data_visualizations'), {
        ...vizData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...vizData }, error: null };
    } catch (error) {
      console.error('Error creating visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Update visualization
   */
  update: async (id, vizData) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      await updateDoc(docRef, {
        ...vizData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...vizData }, error: null };
    } catch (error) {
      console.error('Error updating visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete visualization
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting visualization:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Statistics Service
// ============================================

export const evidenceDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async () => {
    try {
      const [documentsResult, briefsResult, vizResult] = await Promise.all([
        evidenceDocumentsService.getAll(),
        policyBriefsService.getAll(),
        dataVisualizationsService.getAll()
      ]);

      const documents = documentsResult.data || [];
      const briefs = briefsResult.data || [];
      const visualizations = vizResult.data || [];

      // Calculate statistics
      const stats = {
        documents: {
          total: documents.length,
          published: documents.filter(d => d.status === 'published').length,
          draft: documents.filter(d => d.status === 'draft').length,
          totalViews: documents.reduce((sum, d) => sum + (d.viewCount || 0), 0),
          totalDownloads: documents.reduce((sum, d) => sum + (d.downloadCount || 0), 0)
        },
        briefs: {
          total: briefs.length,
          published: briefs.filter(b => b.status === 'published').length,
          draft: briefs.filter(b => b.status === 'draft').length
        },
        visualizations: {
          total: visualizations.length
        },
        recentDocuments: documents.slice(0, 5),
        recentBriefs: briefs.slice(0, 5),
        popularDocuments: documents
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// File Upload Service
// ============================================

export const evidenceFileService = {
  /**
   * Upload document file to Firebase Storage
   */
  uploadFile: async (file, category) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `evidence/${category}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete file from Firebase Storage
   */
  deleteFile: async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { data: null, error };
    }
  }
};
