import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL || 'http://3.231.197.106:5000';

export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};
