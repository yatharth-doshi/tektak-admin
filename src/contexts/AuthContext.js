import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, fetchAdminProfile } from '../Api/adminApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper function to set auth token in cookies
  const setAuthToken = (token) => {
    document.cookie = `teqtak-admin-token=${token}; path=/; max-age=86400`; // 24 hours
  };

  // Helper function to remove auth token from cookies
  const removeAuthToken = () => {
    document.cookie = 'teqtak-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  // Helper function to get auth token from cookies
  const getAuthToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'teqtak-admin-token') {
        return value;
      }
    }
    return null;
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const profile = await fetchAdminProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await adminLogin(credentials);
      
      // Log the response to debug the structure
      console.log('Login response:', response);
      
      // Handle different possible token field names
      const token = response.token || response.authtoken || response.authToken;
      
      if (token) {
        setAuthToken(token);
        setUser(response.admin || response.user || response);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        console.error('No token found in response:', response);
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUserProfile = (profileData) => {
    setUser(prevUser => ({ ...prevUser, ...profileData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
