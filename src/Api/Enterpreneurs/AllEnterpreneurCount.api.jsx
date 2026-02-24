import api from '../auth';


export const fetchAllEnterpreneurCount = async () => {
  try {
    const response = await api.get('/admin/info/entrepreneur');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
