import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL;


export const fetchTotalCOunt = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/allusers`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};

export const fetchInvestorCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/investors`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};

export const fetchEnterpreneurCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/entrepreneur`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};

export const fetchViewerCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`);
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
