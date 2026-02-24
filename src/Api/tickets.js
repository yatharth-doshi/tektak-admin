import api from './auth';

// Ticket Management APIs
export const ticketsAPI = {
  // Get all tickets for a specific event
  getTicketsByEvent: async (eventId) => {
    const response = await api.get(`/admin/tickets/event/${eventId}`);
    return response.data;
  },

  // Get all tickets purchased by a specific user
  getTicketsByUser: async (userId) => {
    const response = await api.get(`/admin/tickets/user/${userId}`);
    return response.data;
  },
};
