import axios from 'axios';
import axiosClient, {setAuthToken} from "../../api/axiosClient";
import {signOut} from "./auth-slice";
import axiosNotification from "../../api/axiosNotification";

const axiosAuth = axios.create({
  withCredentials: true, baseURL: 'https://hexfresh-auth.herokuapp.com/api/',
});

// export const refreshAuthToken = async () => {
//   try {
//     console.log("con cho cuong");
//     const {data: authData} = await axiosAuth.get('/auth/refresh-token');
//
//     await setAuthToken(authData?.token);
//     await localStorage.setItem("authData", JSON.stringify(authData));
//     //Connect socket
//     // Socket.initSocket(authData?.token);
//     return authData;
//   } catch (e) {
//     alert('Please login again');
//     throw e;
//   }
// }
//
// export const setUpInterceptor = (dispatch) => {
//   console.log("setup interceptor");
//   axiosClient.interceptors.response.use((res) => {
//     return res;
//   }, async (err) => {
//     const originalConfig = err.config;
//     // Access Token was expired
//     if (err.response.status === 401 && !originalConfig._retry) {
//       originalConfig._retry = true;
//       try {
//         await refreshAuthToken();
//         console.log("refresh token");
//         return axiosClient(originalConfig);
//       } catch (_error) {
//         dispatch(signOut);
//         return Promise.reject(_error);
//       }
//     }
//     return Promise.reject(err);
//   });
//   axiosNotification.interceptors.response.use((res) => {
//     return res;
//   }, async (err) => {
//     const originalConfig = err.config;
//     // Access Token was expired
//     if (err.response.status === 401 && !originalConfig._retry) {
//       originalConfig._retry = true;
//       try {
//         await refreshAuthToken();
//         return axiosNotification(originalConfig);
//       } catch (_error) {
//         dispatch(signOut);
//         return Promise.reject(_error);
//       }
//     }
//     return Promise.reject(err);
//   });
// };

export default axiosAuth;
