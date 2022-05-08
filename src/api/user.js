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

export const getCurrentUserProfile = async () => {
  const endpoint = `user/user-profile`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createNewEmptyUserProfile = async (id, userProfile) => {
  const endpoint = `user/${id}/user-profile`;
  try {
    const response = await axiosClient.post(endpoint, userProfile);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createCurrentNewEmptyUserProfile = async (userProfile) => {
  const endpoint = `user/user-profile`;
  try {
    const response = await axiosClient.post(endpoint, userProfile);
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

export const updateCurrentUserProfile = async (userProfile) => {
  const endpoint = `user/user-profile`;
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

export const getAllDegree = async () => {
  const endpoint = `degree`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllJobPosition = async () => {
  const endpoint = `job-position`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};
