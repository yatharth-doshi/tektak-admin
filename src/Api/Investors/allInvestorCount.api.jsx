import api from '../auth';


export const fetchAllInvestorsCount = async () => {
  try {
    const response = await api.get('/admin/info/investors');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
