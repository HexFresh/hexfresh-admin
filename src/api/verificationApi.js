import axiosClient from "./axiosClient";

export const sendVerificationCodeByEmail = async (email) => {
  const endpoint = `auth/forgot-password/mail`;
  try {
    const response = await axiosClient.post(endpoint, {email});
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const verifyForgotPasswordRequest = async (email, newPassword, verificationCode) => {
  const endpoint = `auth/forgot-password`;
  try {
    const response = await axiosClient.post(endpoint, {email, newPassword, verificationCode});
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const verifyResetPasswordRequest = async (oldPassword, newPassword) => {
  const endpoint = `auth/reset-password`;
  try {
    const response = await axiosClient.post(endpoint, {oldPassword, newPassword});
    const {data} = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}