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

export const getAllMentorOfFresher = async (fresherId) => {
  const endpoint = `user/${fresherId}/mentor`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMentorOfFresher = async (fresherId, mentorId) => {
  const payload = {
    fresherId,
    mentorId,
  };
  const endpoint = `mentor-permission`;
  try {
    const response = await axiosClient.delete(endpoint, { data: payload });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addMentorOfFresher = async (fresherId, mentorId) => {
  const payload = {
    fresherId,
    mentorId,
  };
  const endpoint = `mentor-permission`;
  try {
    const response = await axiosClient.post(endpoint, payload);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};
