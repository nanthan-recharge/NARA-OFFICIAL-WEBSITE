// NARA Procurement & Recruitment API Service
import axios from 'axios';

// API Base URL - should be configured via environment variable
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios?.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient?.interceptors?.request?.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient?.interceptors?.response?.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/procurement-recruitment-portal';
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  // User Registration
  register: async (userData) => {
    try {
      const response = await apiClient?.post('/auth/register', userData);
      if (response?.data?.token) {
        localStorage.setItem('authToken', response?.data?.token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
      }
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const response = await apiClient?.post('/auth/login', credentials);
      if (response?.data?.token) {
        localStorage.setItem('authToken', response?.data?.token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
      }
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // User Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get Current User
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Procurement Services
export const procurementService = {
  // Get all procurement notices
  getAllNotices: async (params = {}) => {
    try {
      const response = await apiClient?.get('/procurement/notices', { params });
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch procurement notices');
    }
  },

  // Get single procurement notice
  getNoticeById: async (noticeId) => {
    try {
      const response = await apiClient?.get(`/procurement/notices/${noticeId}`);
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch procurement notice');
    }
  },

  // Submit vendor application
  submitApplication: async (noticeId, applicationData) => {
    try {
      const response = await apiClient?.post(`/procurement/apply/${noticeId}`, applicationData);
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit application');
    }
  }
};

// Job/Recruitment Services
export const recruitmentService = {
  // Get all job postings
  getAllJobs: async (params = {}) => {
    try {
      const response = await apiClient?.get('/jobs/postings', { params });
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch job postings');
    }
  },

  // Get single job posting
  getJobById: async (jobId) => {
    try {
      const response = await apiClient?.get(`/jobs/postings/${jobId}`);
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch job posting');
    }
  },

  // Submit job application
  submitApplication: async (jobId, applicationData) => {
    try {
      const response = await apiClient?.post(`/jobs/apply/${jobId}`, applicationData);
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit job application');
    }
  }
};

// Vacancy Automation & Archive Services
export const vacancyIntegrationService = {
  getSyncSummary: async () => {
    try {
      const response = await apiClient?.get('/jobs/sync/summary');
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch vacancy sync summary');
    }
  },

  getArchive: async (params = {}) => {
    try {
      const response = await apiClient?.get('/jobs/archive', { params });
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch archived roles');
    }
  }
};

// File Upload Services
export const fileUploadService = {
  // Upload documents
  uploadDocuments: async (files, applicationData) => {
    try {
      const formData = new FormData();
      
      // Add files to form data
      files?.forEach((file) => {
        formData?.append('documents', file);
      });

      // Add additional data
      if (applicationData?.application_id) {
        formData?.append('application_id', applicationData?.application_id);
      }
      if (applicationData?.application_type) {
        formData?.append('application_type', applicationData?.application_type);
      }
      if (applicationData?.document_types) {
        formData?.append('document_types', JSON.stringify(applicationData?.document_types));
      }

      const response = await apiClient?.post('/upload/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for file uploads
      });

      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'File upload failed');
    }
  }
};

// Dashboard Services
export const dashboardService = {
  // Get user dashboard data
  getDashboardData: async () => {
    try {
      const response = await apiClient?.get('/dashboard');
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
};

// Admin Services (if user has admin access)
export const adminService = {
  // Get all applications
  getAllApplications: async (params = {}) => {
    try {
      const response = await apiClient?.get('/admin/applications', { params });
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch applications');
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, type, statusData) => {
    try {
      const response = await apiClient?.put(`/admin/applications/${applicationId}/${type}`, statusData);
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update application status');
    }
  },

  // Export applications as CSV
  exportApplicantsCsv: async (params = {}) => {
    try {
      const response = await apiClient?.get('/admin/applications/export', {
        params,
        responseType: 'blob'
      });
      return response?.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to export applicants');
    }
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error?.response) {
    // Server responded with error status
    return {
      message: error?.response?.data?.error || 'Server error occurred',
      status: error?.response?.status,
      type: 'server_error'
    };
  } else if (error?.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      type: 'network_error'
    };
  } else {
    // Other error
    return {
      message: error?.message || 'An unexpected error occurred',
      type: 'unknown_error'
    };
  }
};

export default {
  authService,
  procurementService,
  recruitmentService,
  fileUploadService,
  dashboardService,
  vacancyIntegrationService,
  adminService,
  handleApiError
};
