import axios from 'axios';

const axiosClient = axios.create({
  withCredentials: true, baseURL: 'https://hexfresh-gamification-backend.herokuapp.com/api/',
});

export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export default axiosClient;
