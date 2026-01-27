import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL || 'http://3.231.197.106:5000';

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/notifications`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};
