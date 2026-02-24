import api from '../auth';


export const fetchAllPodcastsCount = async () => {
  try {
    const response = await api.get('/admin/info/podcasts');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
