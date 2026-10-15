import axios from "axios";

// Smart fallback: When running on HTTPS (e.g. Vercel deployment), avoid mixed content
// by defaulting to the deployed Render backend if VITE_API_URL is omitted.
const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
const defaultBaseUrl = isHttps
  ? "https://parkease-backend-1-l4a4.onrender.com"
  : "http://localhost:8080";

const rawBaseUrl = import.meta.env.VITE_API_URL || defaultBaseUrl;
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const baseURL = cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired or invalid authentication
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-clear token for protected routes, not failed login attempts
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));
    }

    return Promise.reject(error);
  }
);

export default api;

export function getErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  // Handle Spring Boot validation errors { details: { email: "...", password: "..." } }
  if (data?.details && typeof data.details === "object") {
    const firstKey = Object.keys(data.details)[0];
    if (firstKey && data.details[firstKey]) {
      return data.details[firstKey];
    }
  }

  if (data?.message) {
    return data.message;
  }

  // When credentials fail, Spring Security may return 401 or 403 Forbidden
  if (error.response?.status === 401 || error.response?.status === 403) {
    return "Invalid email or password.";
  }

  if (
    data?.error &&
    data.error !== "Forbidden" &&
    data.error !== "Unauthorized"
  ) {
    return data.error;
  }

  if (
    error.code === "ERR_NETWORK" ||
    error.message?.includes("Network Error")
  ) {
    return "Unable to connect to the backend server. Please check your backend connection.";
  }

  return (
    error.message ||
    "Something went wrong. Please try again."
  );
}