import axiosClient from "./axiosClient";

export const findAllUsersInLeaderboard = async (programId) => {
  const endpoint = `program/${programId}/leaderboard`;
  try {
    const response = await axiosClient.get(endpoint);
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const updateStatusOfLeaderboard = async (programId, isActive) => {
  const endpoint = `program/${programId}/leaderboard`;
  try {
    const response = await axiosClient.put(endpoint, {isActive});
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}