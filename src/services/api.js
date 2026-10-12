import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
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
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;

export function getErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}