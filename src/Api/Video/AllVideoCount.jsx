import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL || 'http://localhost:5000';


export const fetchAllVideoCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/info/videos`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
