import axiosClient from '../axiosClient';

export const getPrograms = async (query) => {
  const {keyword, limit, offset} = query;
  const endpoint = `program`;
  try {
    const response = await axiosClient.get(endpoint, {
      params: {keyword, limit, offset},
    });
    const {data} = response;
    return data;
  } catch (error) {
    return error;
  }
};

export const createProgram = async (program) => {
  const endpoint = `program`;
  try {
    const response = await axiosClient.post(endpoint, program);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const removeProgram = async (id) => {
  const endpoint = `program/${id}`;
  try {
    const response = await axiosClient.delete(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const deleteProgramFromFresher = async (userId, programId) => {
  const endpoint = `program-permission`;
  try {
    const response = await axiosClient.delete(endpoint, {data: {userId, programId}});
    const {data} = response;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getStatOfProgram = async (programId) => {
  const endpoint = `stat/program/${programId}`;
  try {
    const response = await axiosClient.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}
