import axios from 'axios';

const axiosAuth = axios.create({
  withCredentials: true, baseURL: 'https://hexfresh-auth.herokuapp.com/api/',
});

export default axiosAuth;
