import axiosNotification from './axiosNotification';

export const getNotificationsService = async (payload) => {
  const {skip, limit} = payload;
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.get(endpoint, {
      params: {skip, limit}
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const getNotification = async id => {
  const endpoint = `notification/${id}`;
  try {
    const response = await axiosNotification.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const createNotification = async (notification) => {
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.post(endpoint, notification);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const countNotification = async () => {
  const endpoint = `notification/counter`;
  try {
    const response = await axiosNotification.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}
