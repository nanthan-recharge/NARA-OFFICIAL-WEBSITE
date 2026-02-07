/**
 * Educational Outreach Platform Service
 *
 * Marine science education and public awareness
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

export const contentLibraryService = {
  add: async (contentData) => {
    try {
      const contentId = `CONTENT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        contentId,
        ...contentData,
        viewCount: 0,
        likes: 0,
        publishedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'educational_content'), dataToSave);
      return { data: { id: docRef.id, contentId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'educational_content');
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      q = query(q, orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  incrementView: async (id) => {
    try {
      await updateDoc(doc(db, 'educational_content', id), {
        viewCount: increment(1)
      });
      return { data: { id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const virtualTourService = {
  create: async (tourData) => {
    try {
      const tourId = `TOUR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        tourId,
        ...tourData,
        viewCount: 0,
        rating: 0,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'virtual_tours'), dataToSave);
      return { data: { id: docRef.id, tourId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'virtual_tours'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const competitionService = {
  create: async (competitionData) => {
    try {
      const competitionId = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        competitionId,
        ...competitionData,
        participants: [],
        submissions: [],
        status: 'open',
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'student_competitions'), dataToSave);
      return { data: { id: docRef.id, competitionId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'student_competitions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  submitEntry: async (competitionId, entryData) => {
    try {
      const docRef = doc(db, 'student_competitions', competitionId);
      const entryId = `ENTRY-${Date.now()}`;
      const newEntry = {
        entryId,
        ...entryData,
        submittedAt: new Date().toISOString()
      };

      await updateDoc(docRef, {
        submissions: increment(1),
        participants: increment(1)
      });

      await addDoc(collection(db, 'competition_entries'), {
        competitionId,
        ...newEntry
      });

      return { data: { entryId }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const webinarService = {
  schedule: async (webinarData) => {
    try {
      const webinarId = `WEBINAR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const dataToSave = {
        webinarId,
        ...webinarData,
        registrations: [],
        attendees: 0,
        status: 'scheduled',
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'webinar_events'), dataToSave);
      return { data: { id: docRef.id, webinarId, ...dataToSave }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  getAll: async () => {
    try {
      const q = query(collection(db, 'webinar_events'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return { data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })), error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  register: async (webinarId, participantData) => {
    try {
      await updateDoc(doc(db, 'webinar_events', webinarId), {
        attendees: increment(1)
      });

      await addDoc(collection(db, 'webinar_registrations'), {
        webinarId,
        ...participantData,
        registeredAt: serverTimestamp()
      });

      return { data: { webinarId }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const analyticsService = {
  getStats: async () => {
    try {
      const contentSnapshot = await getDocs(collection(db, 'educational_content'));
      const toursSnapshot = await getDocs(collection(db, 'virtual_tours'));
      const competitionsSnapshot = await getDocs(collection(db, 'student_competitions'));
      const webinarsSnapshot = await getDocs(collection(db, 'webinar_events'));

      const content = contentSnapshot.docs.map(doc => doc.data());
      const tours = toursSnapshot.docs.map(doc => doc.data());
      const competitions = competitionsSnapshot.docs.map(doc => doc.data());
      const webinars = webinarsSnapshot.docs.map(doc => doc.data());

      return {
        data: {
          totalContent: content.length,
          totalViews: content.reduce((sum, c) => sum + (c.viewCount || 0), 0),
          totalTours: tours.length,
          totalCompetitions: competitions.length,
          activeCompetitions: competitions.filter(c => c.status === 'open').length,
          totalParticipants: competitions.reduce((sum, c) => sum + (c.participants || 0), 0),
          totalWebinars: webinars.length,
          totalAttendees: webinars.reduce((sum, w) => sum + (w.attendees || 0), 0)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export default {
  contentLibraryService,
  virtualTourService,
  competitionService,
  webinarService,
  analyticsService
};
