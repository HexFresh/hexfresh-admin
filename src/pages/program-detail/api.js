import axiosClient from '../../api/axiosClient';

export const getProgramDetail = async (id) => {
  const endpoint = `program/${id}/people`;
  try {
    const response = await axiosClient.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const addUserToProgram = async (programId, userId) => {
  const endpoint = `program-permission`;
  try {
    const response = await axiosClient.post(endpoint, {userId, programId});
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const addAvailableBadgeToProgram = async (programId, badgeId) => {
  const endpoint = `program/${programId}/badge/${badgeId}`;
  try {
    const response = await axiosClient.post(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const addNewBadgeToProgram = async (programId, badge) => {
  const endpoint = `program/${programId}/badge`;
  try {
    const response = await axiosClient.post(endpoint, badge);
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const removeBadgeFromProgram = async (programId, badgeId) => {
  const endpoint = `program/${programId}/badge/${badgeId}`;
  try {
    const response = await axiosClient.delete(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}
