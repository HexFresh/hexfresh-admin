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
    localStorage.removeItem('token');
    history('/signin');
    dispatch({ type: 'auth/LOGOUT' });
  };
}

export function signIn(credentials, history) {
  return async (dispatch) => {
    const endpoint = 'auth/login';
    try {
      const response = await axiosClient.post(
        endpoint,
        `username=admin&password=123`
      );
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      dispatch(loginConfirmAction({ ...user, token }));
      dispatch(success());
      history('/');
    } catch (error) {
      console.log(error);
    }
  };
}
