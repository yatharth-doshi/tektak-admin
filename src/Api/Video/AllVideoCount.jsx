import api from '../auth';


export const fetchAllVideoCount = async () => {
  try {
    const response = await api.get('/admin/info/videos');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
