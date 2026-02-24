import api from './auth';

// Analytics APIs
export const analyticsAPI = {
  // Get users by date
  getUsersByDate: async () => {
    const response = await api.get('/admin/info/users');
    return response.data;
  },

  // Get viewers by date
  getViewersByDate: async () => {
    const response = await api.get('/admin/info/viewers');
    return response.data;
  },

  // Get investors by date
  getInvestorsByDate: async () => {
    const response = await api.get('/admin/info/investors');
    return response.data;
  },

  // Get entrepreneurs by date
  getEntrepreneursByDate: async () => {
    const response = await api.get('/admin/info/entrepreneur');
    return response.data;
  },

  // Get tickets by date
  getTicketsByDate: async () => {
    const response = await api.get('/admin/info/tickets');
    return response.data;
  },

  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/admin/info/jobs');
    return response.data;
  },

  // Get all events
  getAllEvents: async () => {
    const response = await api.get('/admin/info/events');
    return response.data;
  },

  // Get all podcasts
  getAllPodcasts: async () => {
    const response = await api.get('/admin/info/podcasts');
    return response.data;
  },

  // Get all videos
  getAllVideos: async () => {
    const response = await api.get('/admin/info/videos');
    return response.data;
  },

  // Get all meetings
  getAllMeetings: async () => {
    const response = await api.get('/admin/info/meetings');
    return response.data;
  },
};
