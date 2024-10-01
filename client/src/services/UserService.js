import axios from "axios";

const url = "api/users/";
const register_url = "api/users/register";
const login_url = "api/users/login";
const refresh_token_url = "api/users/refresh-token";

class UserService {
  // Get all the users (only admin)
  static async getUsers() {
    const res = await axios.get(url);
    try {
      return res.data.users;
    } catch (err) {
      return err;
    }
  }

  // Create user
  static async insertUser(user) {
    let res = {};
    await axios
      .post(register_url, user)
      .then((response) => {
        res = response.data;
      })
      .catch((err) => {
        res = {
          error: err.response.data.msg ? err.response.data : err,
          success: false,
        };
      });
    return res;
  }

  // Login user
  static async loginUser(user) {
    let res = {};
    await axios
      .post(login_url, user)
      .then((response) => {
        let { user, is_admin } = updateLocalStorage(response);
        res = { user: user, is_admin: is_admin, success: true };
      })
      .catch((err) => {
        res = {
          error: err.response.data,
          success: false,
          status: err.response.status,
        };
      });
    return res;
  }

  // logout user
  static async logoutUser() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    delete axios.defaults.headers.common["Authorization"];
    return;
  }

  // logout user
  static async refreshToken(user, isAdmin) {
    let res = {};
    await axios
      .post(refresh_token_url, { user: user, is_admin: isAdmin })
      .then((response) => {
        let { user, is_admin } = updateLocalStorage(response);
        res = { user: user, is_admin: is_admin, success: true };
      })
      .catch((err) => {
        console.log(err);
        res = {
          error: err.response.data.msg ? err.response.data : err,
          success: false,
        };
      });
    return res;
  }
}

function updateLocalStorage(response) {
  // Check if user is admin
  let is_admin = JSON.stringify(response.data.is_admin);

  let user = {
    _id: response.data.user._id,
    name: response.data.user.name,
    email: response.data.user.email,
    createdAt: response.data.user.createdAt,
  };
  let token = response.data.token;
  // Set login token (jwt) and user data to localstorage and vuex
  localStorage.setItem("user", JSON.stringify(user));
  if (is_admin) localStorage.setItem("auth", is_admin);
  else localStorage.removeItem("auth");
  // Set preferences to vuex
  localStorage.setItem("jwt", token);
  axios.defaults.headers.common["Authorization"] = token;
  return { is_admin, user };
}

export default UserService;
