import axiosClient from '../axiosClient';

export const getPrograms = async () => {
  const endpoint = `program`;
  try {
    const response = await axiosClient.get(endpoint);
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
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
