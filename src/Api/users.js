import api from './auth';

// User Management APIs
export const usersAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/allusers');
    return response.data;
  },

  // Get all investors
  getInvestors: async () => {
    const response = await api.get('/admin/investors');
    return response.data;
  },

  // Get all regular users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get all entrepreneurs
  getEntrepreneurs: async () => {
    const response = await api.get('/admin/entrepreneur');
    return response.data;
  },

  // Get all blocked users
  getBlockedUsers: async () => {
    const response = await api.get('/admin/blocked');
    return response.data;
  },

  // Get specific user details
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user information
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user and related data
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

// Sub-Admin Management APIs
export const subAdminAPI = {
  // Get all sub-admins
  getAllSubAdmins: async () => {
    const response = await api.get('/admin/subadmin');
    return response.data;
  },

  // Create new sub-admin
  createSubAdmin: async (adminData) => {
    const response = await api.post('/admin/subadmin', adminData);
    return response.data;
  },

  // Delete sub-admin
  deleteSubAdmin: async (id) => {
    const response = await api.delete(`/admin/subadmin/${id}`);
    return response.data;
  },
};
