import api from './auth';

// Meeting Management APIs
export const meetingsAPI = {
  // Get all meetings hosted by a specific user
  getMeetingsByUser: async (userId) => {
    const response = await api.get(`/admin/meetings/user/${userId}`);
    return response.data;
  },

  // Get all meetings linked to a specific chat room
  getMeetingsByChat: async (chatId) => {
    const response = await api.get(`/admin/meetings/chat/${chatId}`);
    return response.data;
  },
};
