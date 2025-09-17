import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://your-api-base-url.com/api", // Change to your API base
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
