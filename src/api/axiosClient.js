import axios from 'axios';
import authHeader from "./auth-header";
import authService from "./auth-services";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER_URL, headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = authHeader();
  if (token) {
    config.headers = {authorization: token};
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use((res) => {
  return res;
}, async (err) => {
  console.log(err);
  const originalConfig = err.config;
  console.log(originalConfig);

  if (originalConfig.url !== "/auth/login" && err.response) {
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        await authService.refreshToken();
        return axiosClient(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
  }
  return Promise.reject(err);
});

axiosClient.defaults.withCredentials = true;

export default axiosClient;
