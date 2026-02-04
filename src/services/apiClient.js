import axios from "axios";

/* ======================================================
   Base Axios Instance
====================================================== */

const api = axios.create({
  baseURL: "https://api.kushalapp.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   Request Interceptor (Attach token automatically)
====================================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ======================================================
   Response Interceptor (Global error handling)
====================================================== */
api.interceptors.response.use(
  (response) => response.data, // return only data
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(
      error.response?.data || { message: "Something went wrong" },
    );
  },
);

export default api;
