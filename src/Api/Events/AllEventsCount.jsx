import api from '../auth';


export const fetchAllEventsCount = async () => {
  try {
    const response = await api.get('/admin/info/events');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
