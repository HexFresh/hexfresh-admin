import { success } from '../ui/ui-actions';
import axiosClient from '../../api/axiosClient';

export function retrieveTokenAction(token) {
  return {
    type: 'auth/retrieveToken',
    token,
  };
}

export function loginConfirmAction(user) {
  return {
    type: 'auth/loginSuccess',
    user,
  };
}

export function fetchProfileInfo(user) {
  return {
    type: 'auth/fetchProfile',
    user,
  };
}

export function signOut(history) {
  return (dispatch) => {
    const endpoint = `auth/logout`;
    try {
      const response = axiosClient.get(endpoint);
      const { data } = response;
      console.log(data);
      localStorage.removeItem('token');
      history('/signin');
      dispatch({ type: 'auth/LOGOUT' });
    } catch (error) {
      console.log(error);
    }
  };
}

export function signIn(credentials, history) {
  return async (dispatch) => {
    const endpoint = 'auth/login';
    try {
      const response = await axiosClient.post(endpoint, credentials);
      const { token, user } = response.data;
      console.log(user);
      localStorage.setItem('token', token);
      dispatch(loginConfirmAction({ ...user, token }));
      dispatch(success());
      history('/');
    } catch (error) {
      console.log(error);
    }
  };
}
