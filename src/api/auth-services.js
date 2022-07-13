import axios from "axios";

const axiosAuth = axios.create({
  baseURL: process.env.REACT_APP_AUTH_SERVER_URL,
})

axiosAuth.defaults.withCredentials = true;

class AuthService {
  login(username, password) {
    return axiosAuth
      .post("/auth/login", {username, password})
      .then((response) => {
        if (response.data.token) {
          console.log("logged in");
          const {token, user} = response.data;
          localStorage.setItem('userId', user.id);
          localStorage.setItem('roleId', user.roleId);
          localStorage.setItem('username', user.username);
          localStorage.setItem("user", JSON.stringify(response.data));
          return user;
        }
        return null
      });
  }

  refreshToken() {
    return axiosAuth.get("/auth/refresh-token").then((response) => {
      if (response.data.token) {
        console.log("refresh token");
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
  }

  logout(navigate) {
    axiosAuth.get("/auth/logout").then(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('roleId');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      navigate('/login', {replace: true});
    });
  }
}

export default new AuthService();
