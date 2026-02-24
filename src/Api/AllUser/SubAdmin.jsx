import api from '../auth';

export const handleSubAdmin = async (userId) => {
    try {
        const response = await api.post(
            '/admin/subadmin',
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
        const response = await api.get('/admin/subadmin');
        console.log("Sub-admin created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating sub-admin:", error.response?.data || error.message);
        throw error;
    }
};
