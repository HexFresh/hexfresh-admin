import axiosClient from '../../api/axiosClient';

export const getProgramDetail = async (id) => {
  const endpoint = `program/${id}/people`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    return error;
  }
};
