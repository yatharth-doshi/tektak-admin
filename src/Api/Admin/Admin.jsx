import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL || 'http://3.231.197.106:5000';


export const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/profile`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/profile/update`, profileData);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};
