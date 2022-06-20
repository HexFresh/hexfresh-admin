import axiosNotification from './axiosNotification';

export const getNotificationsService = async (payload) => {
  const {skip, limit} = payload;
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {'Content-Type': 'application/json'}, params: {skip, limit}
    });
    const {data} = response;
    return data;
  } catch (error) {
    return [];
  }
};

export const getNotification = async id => {
  const token = localStorage.getItem('token');
  const endpoint = `notification/${id}`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const createNotification = async (notification) => {
  const token = localStorage.getItem('token');
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.post(endpoint, notification, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const countNotification = async () => {
  const token = localStorage.getItem('token');
  const endpoint = `notification/counter`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}
