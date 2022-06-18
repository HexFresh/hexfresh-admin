import axios from 'axios';

const axiosClient = axios.create({
  withCredentials: true, baseURL: 'https://hexfresh-gamification-backend.herokuapp.com/api/',
});

export default axiosClient;
