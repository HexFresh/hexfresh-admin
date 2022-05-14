import axios from 'axios';

const axiosNotification = axios.create({
  baseURL: 'https://hexfresh-socket.herokuapp.com/',
});

export default axiosNotification;
