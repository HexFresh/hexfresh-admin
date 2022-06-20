import axiosClient, {setAuthToken} from '../../api/axiosClient';
import axiosAuth from "./axiosAuth";

export const signInService = async (credentials) => {
  try {
    const endpoint = 'auth/login';
    const response = await axiosAuth.post(endpoint, credentials);
    console.log(axiosAuth.defaults.headers.common);
    const {token, user} = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('roleId', user.roleId);
    localStorage.setItem("authData", JSON.stringify(response.data));
    setAuthToken(token);
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
      await setAuthToken(authData.token);
      await axiosClient.get('/');

      return authData;
    }
  } catch (e) {
    console.log(e);
    alert('Access token expired');
  }
  // try {
  //   return await refreshAuthToken();
  // } catch (e) {
  //   console.log(e.response);
  //   console.log('Refresh token expired');
  // }
  return Promise.reject("No cookie");
}