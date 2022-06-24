import axios from 'axios';
import axiosNotification from "./axiosNotification";

const axiosClient = axios.create({
  withCredentials: true, baseURL: process.env.REACT_APP_API_SERVER_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    axiosNotification.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export default axiosClient;
