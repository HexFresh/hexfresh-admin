import axios from "axios";

const API_URL = "https://hexfresh-auth.herokuapp.com/api";
axios.defaults.withCredentials = true;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "/auth/login", {username, password})
      .then((response) => {
        if (response.data.token) {
          console.log("logged in");
          const {token, user} = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('roleId', user.roleId);
          localStorage.setItem("user", JSON.stringify(response.data));
          return user;
        }
        return null
      });
  }

  refreshToken() {
    return axios.get(API_URL + "/auth/refresh-token").then((response) => {
      if (response.data.token) {
        console.log("refresh token");
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
  }

  logout(navigate) {
    axios.get(API_URL + "/auth/logout").then(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('roleId');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', {replace: true});
    });
  }
}

export default new AuthService();
