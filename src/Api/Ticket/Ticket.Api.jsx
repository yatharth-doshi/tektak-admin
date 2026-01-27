import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL || 'http://3.231.197.106:5000';


export const fetchTickets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/tickets`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};

export const fetchTicketAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/info/tickets`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching ticket analytics:', error);
    throw error;
  }
};
