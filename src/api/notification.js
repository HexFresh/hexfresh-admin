import axiosNotification from './axiosNotification';

export const getNotificationsService = async () => {
  const token = localStorage.getItem('token');
  const endpoint = `notification`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {
        'Content-Type': 'application/json', Authorization: 'Bearer ' + token,
      },
    });
    const {data} = response;
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

export const getNotification = async id => {
  const token = localStorage.getItem('token');
  const endpoint = `notification/${id}`;
  try {
    const response = await axiosNotification.get(endpoint, {
      headers: {
        'Content-Type': 'application/json', Authorization: 'Bearer ' + token,
      },
    });
    const {data} = response;
    console.log(data);
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
        'Content-Type': 'application/json', Authorization: 'Bearer ' + token,
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
        'Content-Type': 'application/json', Authorization: 'Bearer ' + token,
      },
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}
