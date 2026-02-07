// Stub service - Supabase removed
const stubResponse = { data: [], error: null };

const researchService = {
  metrics: {
    getOverallMetrics: async () => stubResponse
  },
  profiles: {
    search: async () => stubResponse
  },
  projects: {
    getPublic: async () => stubResponse,
    getUserProjects: async () => stubResponse,
    create: async () => stubResponse,
    update: async () => stubResponse
  },
  collaboration: {
    getOpen: async () => stubResponse
  },
  grants: {
    getUserGrants: async () => stubResponse,
    getAvailable: async () => stubResponse,
    apply: async () => stubResponse
  },
  networks: {
    getUserMemberships: async () => stubResponse,
    getActive: async () => stubResponse,
    join: async () => stubResponse
  },
  peerReview: {
    getUserReviews: async () => stubResponse,
    submitReview: async () => stubResponse
  }
};

export default researchService;
