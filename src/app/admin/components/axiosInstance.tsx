import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes("/admin/login")) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request error occurred!");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/admin/login") {
          toast.error("Unauthorized! Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/admin/login";
        }
      } else if (status === 403) {
        toast.error("Access forbidden.");
      } else if (status === 404) {
        toast.error("Resource not found.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.response.data.error || "An error occurred.");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
