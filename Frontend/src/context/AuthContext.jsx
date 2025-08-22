import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced error handling utility
const handleAuthError = (error) => {
  if (error.message?.includes('timed out')) {
    return 'Connection timeout. Please check your internet connection and try again.';
  }
  if (error.message?.includes('Failed to fetch') || error.message?.includes('Network error')) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  if (error.status === 401) {
    return 'Invalid credentials. Please check your email and password.';
  }
  if (error.status === 429) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await api.get('/api/auth/me', {
            token,
            timeout: 8000, // 8 second timeout for auth check
            retries: 2
          });
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Only remove token if it's actually invalid (401), not on network errors
          if (error.status === 401) {
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function with enhanced error handling
  const login = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login',
        { email, password },
        {
          timeout: 10000, // 10 second timeout
          retries: 2 // Retry twice on network errors
        }
      );

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = handleAuthError(error);
      return { success: false, message: errorMessage };
    }
  };

  // Register function with enhanced error handling
  const register = async (username, email, password) => {
    try {
      const data = await api.post('/api/auth/register',
        { username, email, password },
        {
          timeout: 10000, // 10 second timeout
          retries: 2 // Retry twice on network errors
        }
      );

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = handleAuthError(error);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Update user profile with enhanced error handling
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await api.put('/api/users/profile',
        profileData,
        {
          token,
          timeout: 10000, // 10 second timeout
          retries: 2 // Retry twice on network errors
        }
      );

      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = handleAuthError(error);
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
