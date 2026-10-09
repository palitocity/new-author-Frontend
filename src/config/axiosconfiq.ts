import axios from "axios";
import { clearAdminSession, clearUserSession } from "../utils/session";

const api = axios.create({
  baseURL: import.meta.env.VITE_DEVE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Respect an Authorization header set by the caller (admin pages pass
  // the admin token explicitly).
  if (config.headers.Authorization) return config;

  const isAdminRequest = config.url?.startsWith("/admin");
  const token = isAdminRequest
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A 401 on an authenticated request means the session is no longer valid
// (expired, revoked, or the account was removed): clear it and send the
// user back to sign in instead of leaving them on a broken page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const config = error?.config;
    const sentAuth = String(config?.headers?.Authorization || "");
    const isAuthEndpoint = /^\/(auth|admin\/login)/.test(config?.url || "");

    if (status === 401 && sentAuth && !isAuthEndpoint) {
      const adminToken = localStorage.getItem("adminToken");

      if (adminToken && sentAuth === `Bearer ${adminToken}`) {
        clearAdminSession();
        window.location.assign("/admin/login");
      } else {
        clearUserSession();
        window.location.assign("/session-expired");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
