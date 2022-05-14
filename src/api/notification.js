import axiosNotification from './axiosNotification';

export const getNotifications = async () => {
  const token = localStorage.getItem('token');
  console.log({ token });
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    const { data } = response;
    return data;
  } catch (error) {
    return error;
  }
};
