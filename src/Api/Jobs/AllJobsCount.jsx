import api from '../auth';


export const fetchAllJobsCount = async () => {
  try {
    const response = await api.get('/admin/info/jobs');
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
