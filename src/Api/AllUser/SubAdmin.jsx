import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_BACK_URL;

export const handleSubAdmin = async (userId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/admin/subadmin`,
            { userId }
        );
        console.log("Sub-admin created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating sub-admin:", error.response?.data || error.message);
        throw error;
    }
};

export const handleGetSubAdmin = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/subadmin`);
        console.log("Sub-admins fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching sub-admins:", error.response?.data || error.message);
        throw error;
    }
};

export const handleDeleteSubAdmin = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/admin/subadmin/${id}`);
        console.log("Sub-admin deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting sub-admin:", error.response?.data || error.message);
        throw error;
    }
};
