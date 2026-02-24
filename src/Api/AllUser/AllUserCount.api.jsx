import api from '../auth';


export const fetchAllUserCount = async () => {
  try {
    const response = await api.get('/admin/info/users');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
