import axiosClient from '../axiosClient';

export const getPrograms = async (query) => {
  const { keyword, limit, offset } = query;
  const endpoint = `program`;
  try {
    const response = await axiosClient.get(endpoint, {
      params: { keyword, limit, offset },
    });
    const { data } = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const createProgram = async (program) => {
  const endpoint = `program`;
  try {
    const response = await axiosClient.post(endpoint, program);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};
