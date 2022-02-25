import { success } from '../ui/ui-actions';

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
    dispatch(loginConfirmAction(credentials));

    localStorage.setItem('token', credentials.token);

    dispatch(success());

    history('/');
  };
}
