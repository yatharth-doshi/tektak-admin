import api from '../auth';


export const fetchAdminData = async () => {
  try {
    const response = await api.get('/admin/profile/');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
