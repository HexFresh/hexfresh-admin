import axiosClient from "./axiosClient";

export const getBadges = async (query) => {
  const {keyword, limit, offset} = query;
  const endpoint = `badge`;
  try {
    const response = await axiosClient.get(endpoint, {
      params: {keyword, limit, offset},
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
}

export const createBadge = async (badge) => {
  const endpoint = `badge`;
  try {
    const response = await axiosClient.post(endpoint, badge);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteBadge = async (id) => {
  const endpoint = `badge/${id}`;
  try {
    const response = await axiosClient.delete(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const getBadgeOfProgram = async (id) => {
  const endpoint = `program/${id}/badge`;
  try {
    const response = await axiosClient.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}
