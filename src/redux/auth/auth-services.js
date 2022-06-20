import axiosClient from '../../api/axiosClient';
import axiosAuth from "./axiosAuth";
import {signOut} from "./auth-slice";
import axios from "axios";
import axiosNotification from "../../api/axiosNotification";

export const signInService = async (credentials) => {
  try {
    const endpoint = 'auth/login';
    const response = await axiosAuth.post(endpoint, credentials);
    const {token, user} = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('roleId', user.roleId);
    localStorage.setItem("authData", JSON.stringify(response.data));
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    axiosNotification.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log(axiosClient.defaults.headers);
    return user;
  } catch (error) {
    console.log(error);
  }
}

export const signOutService = async (navigate) => {
  try {
    const endpoint = 'auth/logout';
    await axiosClient.get(endpoint);
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
    localStorage.removeItem('token');
    navigate('/login', {replace: true});
  } catch (error) {
    console.log(error);
  }
}

export const testAuthorization = async () => {
  try {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      const authData = JSON.parse(authDataString);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
      axiosNotification.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
      console.log(axiosClient.defaults.headers);
      console.log("ua ki vao day");
      await axiosClient.get('/');
      return authData;
    }
  } catch (e) {
    console.log(e);
  }
  // try {
  //   return await refreshAuthToken();
  // } catch (e) {
  //   console.log(e.response);
  //   console.log('Refresh token expired');
  // }
  return Promise.reject("No cookie");
}

export const refreshAuthToken = async () => {
  try {
    console.log("con cho cuong");
    const {data: authData} = await axiosAuth.get('/auth/refresh-token');

    axiosClient.defaults.headers.common.Authorization = `Bearer ${authData?.token}`;
    axiosNotification.defaults.headers.common.Authorization = `Bearer ${authData?.token}`;
    console.log(axiosClient.defaults.headers);
    await localStorage.setItem("authData", JSON.stringify(authData));
    //Connect socket
    // Socket.initSocket(authData?.token);
    return authData;
  } catch (e) {
    alert('Please login again');
    throw e;
  }
}

export const setUpInterceptor = (dispatch) => {
  console.log("setup interceptor");
  axiosClient.interceptors.response.use((res) => {
    return res;
  }, async (err) => {
    const originalConfig = err.config;
    // Access Token was expired
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        await refreshAuthToken();
        console.log("refresh token");
        return axiosClient(originalConfig);
      } catch (_error) {
        dispatch(signOut);
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  });
  axiosNotification.interceptors.response.use((res) => {
    return res;
  }, async (err) => {
    const originalConfig = err.config;
    // Access Token was expired
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        await refreshAuthToken();
        return axiosNotification(originalConfig);
      } catch (_error) {
        dispatch(signOut);
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  });
};