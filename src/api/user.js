import axiosClient from './axiosClient';

export const getUserAccountById = async (id) => {
  const endpoint = `user/${id}/info`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserProfileById = async (id) => {
  const endpoint = `user/${id}/user-profile`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createNewEmptyUserProfile = async (id) => {
  const endpoint = `user/${id}/user-profile`;
  try {
    const response = await axiosClient.post(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserProfile = async (id, userProfile) => {
  const endpoint = `user/${id}/user-profile`;
  try {
    const response = await axiosClient.put(endpoint, userProfile);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPhaseOfFresher = async (fresherId) => {
  const endpoint = `user/${fresherId}/current-program/phase`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
