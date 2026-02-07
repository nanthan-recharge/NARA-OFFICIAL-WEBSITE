import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// VESSEL TRACKING & MANAGEMENT
// ============================================

export const getVessels = async (filters = {}) => {
  try {
    let q = collection(db, 'maritime_vessels');
    const constraints = [];

    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    constraints.push(orderBy('lastUpdate', 'desc'));

    if (filters.limit) {
      constraints.push(firestoreLimit(filters.limit));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching vessels:', error);
    return [];
  }
};

// Real-time vessel tracking
export const subscribeToVessels = (callback, filters = {}) => {
  let q = collection(db, 'maritime_vessels');
  const constraints = [orderBy('lastUpdate', 'desc')];

  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }

  q = query(q, ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const vessels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(vessels);
  });
};

export const updateVesselPosition = async (vesselId, position) => {
  try {
    const vesselRef = doc(db, 'maritime_vessels', vesselId);
    await updateDoc(vesselRef, {
      position,
      lastUpdate: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating vessel position:', error);
    throw error;
  }
};

// ============================================
// PORT OPERATIONS
// ============================================

export const getPorts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'maritime_ports'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching ports:', error);
    return [];
  }
};

export const getPortStatus = async (portId) => {
  try {
    const portRef = doc(db, 'maritime_ports', portId);
    const portSnap = await getDoc(portRef);
    if (portSnap.exists()) {
      return { id: portSnap.id, ...portSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching port status:', error);
    throw error;
  }
};

export const updatePortStatus = async (portId, statusData) => {
  try {
    const portRef = doc(db, 'maritime_ports', portId);
    await updateDoc(portRef, {
      ...statusData,
      lastUpdate: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating port status:', error);
    throw error;
  }
};

// ============================================
// MARITIME SERVICES
// ============================================

export const getMaritimeServices = async (language = 'en') => {
  try {
    const snapshot = await getDocs(collection(db, 'maritime_services'));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        title: data.title?.[language] || data.title?.en || '',
        description: data.description?.[language] || data.description?.en || ''
      };
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createMaritimeService = async (serviceData) => {
  try {
    const serviceRef = doc(collection(db, 'maritime_services'));
    await setDoc(serviceRef, {
      ...serviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    });
    return { id: serviceRef.id, success: true };
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateMaritimeService = async (serviceId, updateData) => {
  try {
    const serviceRef = doc(db, 'maritime_services', serviceId);
    await updateDoc(serviceRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteMaritimeService = async (serviceId) => {
  try {
    await deleteDoc(doc(db, 'maritime_services', serviceId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// ============================================
// HYDROGRAPHY & CHARTS
// ============================================

export const getChartCatalog = async (filters = {}) => {
  try {
    const chartsCollection = collection(db, 'hydro_charts');
    const constraints = [];

    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }

    if (filters.region) {
      constraints.push(where('regions', 'array-contains', filters.region));
    }

    constraints.push(orderBy('updatedAt', 'desc'));

    if (filters.limit) {
      constraints.push(firestoreLimit(filters.limit));
    }

    const chartsQuery = query(chartsCollection, ...constraints);
    const snapshot = await getDocs(chartsQuery);

    let charts = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    if (filters.search) {
      const term = filters.search.toLowerCase();
      charts = charts.filter((chart) => {
        const title =
          typeof chart.title === 'string'
            ? chart.title
            : chart.title?.en || '';
        return (
          title.toLowerCase().includes(term) ||
          (chart.chartNumber || '').toLowerCase().includes(term) ||
          (chart.scale || '').toString().toLowerCase().includes(term)
        );
      });
    }

    return charts;
  } catch (error) {
    console.error('Error fetching hydrographic chart catalog:', error);
    return [];
  }
};

export const submitChartRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'hydro_chart_requests'), {
      ...requestData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting chart request:', error);
    throw error;
  }
};

export const submitHydroSurveyRequest = async (surveyData) => {
  try {
    const docRef = await addDoc(collection(db, 'hydro_survey_requests'), {
      ...surveyData,
      status: 'review',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting hydrographic survey request:', error);
    throw error;
  }
};

export const submitHydroDataRequest = async (requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'hydro_data_requests'), {
      ...requestData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting hydrographic data request:', error);
    throw error;
  }
};

export const submitBathymetryContribution = async (contributionData) => {
  try {
    const docRef = await addDoc(collection(db, 'hydro_crowd_bathymetry'), {
      ...contributionData,
      qcStatus: 'pending_review',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting bathymetry contribution:', error);
    throw error;
  }
};

// ============================================
// PERMITS & LICENSES
// ============================================

export const submitPermitApplication = async (applicationData) => {
  try {
    const applicationRef = doc(collection(db, 'maritime_permits'));
    await setDoc(applicationRef, {
      ...applicationData,
      status: 'pending',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: applicationRef.id, success: true };
  } catch (error) {
    console.error('Error submitting permit application:', error);
    throw error;
  }
};

export const getPermitApplications = async (userId) => {
  try {
    const q = query(
      collection(db, 'maritime_permits'),
      where('userId', '==', userId),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching permit applications:', error);
    return [];
  }
};

export const updatePermitStatus = async (permitId, status, notes) => {
  try {
    const permitRef = doc(db, 'maritime_permits', permitId);
    await updateDoc(permitRef, {
      status,
      notes,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating permit status:', error);
    throw error;
  }
};

// ============================================
// WEATHER & SEA CONDITIONS
// ============================================

export const getWeatherData = async () => {
  try {
    const weatherRef = doc(db, 'maritime_data', 'current_weather');
    const weatherSnap = await getDoc(weatherRef);
    if (weatherSnap.exists()) {
      return weatherSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const updateWeatherData = async (weatherData) => {
  try {
    const weatherRef = doc(db, 'maritime_data', 'current_weather');
    await setDoc(weatherRef, {
      ...weatherData,
      lastUpdate: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating weather data:', error);
    throw error;
  }
};

// Subscribe to real-time weather updates
export const subscribeToWeather = (callback) => {
  const weatherRef = doc(db, 'maritime_data', 'current_weather');
  return onSnapshot(weatherRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// ============================================
// MARITIME ALERTS & NOTICES
// ============================================

export const getMaritimeAlerts = async (active = true) => {
  try {
    let q = collection(db, 'maritime_alerts');
    const constraints = [orderBy('createdAt', 'desc')];
    
    if (active) {
      constraints.push(where('status', '==', 'active'));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching maritime alerts:', error);
    return [];
  }
};

export const createMaritimeAlert = async (alertData) => {
  try {
    const alertRef = doc(collection(db, 'maritime_alerts'));
    await setDoc(alertRef, {
      ...alertData,
      status: 'active',
      createdAt: serverTimestamp()
    });
    return { id: alertRef.id, success: true };
  } catch (error) {
    console.error('Error creating maritime alert:', error);
    throw error;
  }
};

// ============================================
// SAFETY & COMPLIANCE REPORTS
// ============================================

export const submitSafetyReport = async (reportData) => {
  try {
    const reportRef = doc(collection(db, 'maritime_safety_reports'));
    await setDoc(reportRef, {
      ...reportData,
      status: 'submitted',
      submittedAt: serverTimestamp()
    });
    return { id: reportRef.id, success: true };
  } catch (error) {
    console.error('Error submitting safety report:', error);
    throw error;
  }
};

// ============================================
// BOOKING & RESERVATIONS
// ============================================

export const createServiceBooking = async (bookingData) => {
  try {
    const bookingRef = doc(collection(db, 'maritime_bookings'));
    await setDoc(bookingRef, {
      ...bookingData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: bookingRef.id, success: true };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, 'maritime_bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

export default {
  // Vessels
  getVessels,
  subscribeToVessels,
  updateVesselPosition,
  
  // Ports
  getPorts,
  getPortStatus,
  updatePortStatus,
  
  // Services
  getMaritimeServices,
  createMaritimeService,
  updateMaritimeService,
  deleteMaritimeService,
  getChartCatalog,
  submitChartRequest,
  submitHydroSurveyRequest,
  submitHydroDataRequest,
  submitBathymetryContribution,
  
  // Permits
  submitPermitApplication,
  getPermitApplications,
  updatePermitStatus,
  
  // Weather
  getWeatherData,
  updateWeatherData,
  subscribeToWeather,
  
  // Alerts
  getMaritimeAlerts,
  createMaritimeAlert,
  
  // Safety
  submitSafetyReport,
  
  // Bookings
  createServiceBooking,
  getUserBookings
};
