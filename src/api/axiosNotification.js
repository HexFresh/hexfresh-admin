import axios from 'axios';

const axiosNotification = axios.create({
  baseURL: process.env.REACT_APP_CHAT_SERVER_URL,
});

export default axiosNotification;
