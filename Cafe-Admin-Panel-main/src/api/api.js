import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/admin";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("tushar-admin-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && !error.config?.url?.includes("/auth/login")) {
        sessionStorage.removeItem("tushar-admin-token");
        window.dispatchEvent(new Event("tushar-admin-session-expired"));
      }
      console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received. Backend may not be running.");
      console.error("Requested URL:", error.config?.baseURL + error.config?.url);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
