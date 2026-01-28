import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_BACK_URL;


export const fetchPaymentRequest = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/payreq`)
    const result = response.data;
    return result;
  } catch (error) {
    console.error('Error fetching daily users:', error);
    throw error;
  }
};
