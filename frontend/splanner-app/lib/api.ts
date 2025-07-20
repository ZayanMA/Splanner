import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",  // To update when setting up cloud deployment
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
