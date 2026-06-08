import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://alolittlesteps.com/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    config.headers.userid = userId;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/auth/login/admins")
    ) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userId");

      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("userId");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
