import api from './auth';

// Content Management by User APIs
export const contentAPI = {
  // Video Management
  getVideosByUser: async (userId) => {
    const response = await api.get(`/admin/video/user/${userId}`);
    return response.data;
  },

  getVideoById: async (videoId) => {
    const response = await api.get(`/admin/videos/${videoId}`);
    return response.data;
  },

  updateVideo: async (videoId, videoData) => {
    const response = await api.put(`/admin/videos/${videoId}`, videoData);
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await api.delete(`/admin/videos/${videoId}`);
    return response.data;
  },

  // Podcast Management
  getPodcastsByUser: async (userId) => {
    const response = await api.get(`/admin/podcast/user/${userId}`);
    return response.data;
  },

  getPodcastById: async (podcastId) => {
    const response = await api.get(`/admin/podcasts/${podcastId}`);
    return response.data;
  },

  updatePodcast: async (podcastId, podcastData) => {
    const response = await api.put(`/admin/podcasts/${podcastId}`, podcastData);
    return response.data;
  },

  deletePodcast: async (podcastId) => {
    const response = await api.delete(`/admin/podcasts/${podcastId}`);
    return response.data;
  },

  // Event Management
  getEventsByUser: async (userId) => {
    const response = await api.get(`/admin/event/user/${userId}`);
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}`);
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/admin/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  // Job Management
  getJobsByUser: async (userId) => {
    const response = await api.get(`/admin/job/user/${userId}`);
    return response.data;
  },

  getJobById: async (jobId) => {
    const response = await api.get(`/admin/jobs/${jobId}`);
    return response.data;
  },

  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/admin/jobs/${jobId}`, jobData);
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  },
};
