// API Configuration for ChatApp

export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: 'http://localhost:5001/api',
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      UPDATE: '/auth/update',
      REFRESH: '/auth/refresh', // Not implemented yet
      FORGOT_PASSWORD: '/auth/forgot-password', // Not implemented yet
      RESET_PASSWORD: '/auth/reset-password', // Not implemented yet
    },
    CHAT: {
      MESSAGES: '/chat/messages', // Not implemented yet
      ROOMS: '/chat/rooms', // Not implemented yet
      UPLOAD: '/chat/upload', // Not implemented yet
    },
    USER: {
      PROFILE: '/user/profile', // Not implemented yet
      CONTACTS: '/user/contacts', // Not implemented yet
      SETTINGS: '/user/settings', // Not implemented yet
    }
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds for file uploads
    AUTH: 15000,    // 15 seconds for auth requests
  },
  
  // Headers
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    ACCEPT: 'application/json',
  }
};

// Environment-specific configurations
export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...API_CONFIG,
        BASE_URL: process.env.VITE_API_URL || 'https://your-production-api.com/api'
      };
    case 'staging':
      return {
        ...API_CONFIG,
        BASE_URL: process.env.VITE_API_URL || 'https://your-staging-api.com/api'
      };
    default:
      return API_CONFIG;
  }
};

export default getApiConfig();
