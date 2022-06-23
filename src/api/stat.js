import axiosClient from './axiosClient';

export const getStat = async () => {
  const endpoint = 'stat/dashboard-admin';
  try {
    const response = await axiosClient.get(endpoint);
    return response.data;
  } catch (error) {
    return console.log(error);
  }
}