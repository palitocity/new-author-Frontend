import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_DEVE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const isAdminRequest = config.url?.startsWith("/admin");
  const token = isAdminRequest
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
