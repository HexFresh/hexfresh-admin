import axiosClient from '../../api/axiosClient';

export const signInService = async (credentials) => {
  try {
    const endpoint = 'auth/login';
    const response = await axiosClient.post(endpoint, credentials);
    const {token, user} = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('roleId', user.roleId);
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