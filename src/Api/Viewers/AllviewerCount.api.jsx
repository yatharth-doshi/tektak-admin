import api from '../auth';


export const fetchAllViewersCount = async () => {
  try {
    const response = await api.get('/admin/info/viewers');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
