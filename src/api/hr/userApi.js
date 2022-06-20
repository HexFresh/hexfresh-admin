import axiosClient from '../axiosClient';

export const getUsers = async (query) => {
  const {keyword, roleId, limit, offset} = query;
  const endpoint = `user`;
  try {
    const response = await axiosClient.get(endpoint, {
      params: {keyword, roleId, limit, offset},
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const createUser = async (user) => {
  const endpoint = `user`;
  try {
    const response = await axiosClient.post(endpoint, user);
    const {data} = response;
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const assignFresherToMentor = async (fresherId, mentorId) => {
  console.log(fresherId, mentorId);
  const endpoint = `mentor-permission`;
  try {
    const response = await axiosClient.post(endpoint, {mentorId, fresherId});
    const {data} = response;
    return data;
  } catch (error) {
    return error.message;
  }
};
