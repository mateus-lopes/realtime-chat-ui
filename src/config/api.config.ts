export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,

  ENDPOINTS: {
    AUTH: {
      SIGNUP: "/auth/signup",
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
      PROFILE: "/auth/me",
      UPDATE: "/auth/update",
      REFRESH: "/auth/refresh",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    CHAT: {
      MESSAGES: "/messages",
      USERS: "/messages/users",
    },
    USER: {
      PROFILE: "/user/profile",
      CONTACTS: "/user/contacts",
      SETTINGS: "/user/settings",
    },
  },

  TIMEOUTS: {
    DEFAULT: 10000,
    UPLOAD: 30000,
    AUTH: 15000,
  },

  HEADERS: {
    CONTENT_TYPE: "application/json",
    ACCEPT: "application/json",
  },
};

export const getApiConfig = () => {
  const baseUrl = import.meta.env.VITE_API_URL;

  return {
    ...API_CONFIG,
    BASE_URL: baseUrl,
  };
};

export default getApiConfig();
