import axios from "./http";

const url = "api/users/";
const register_url = "api/users/register";
const login_url = "api/users/login";
const logout_url = "api/users/logout";
const me_url = "api/users/me";
const refresh_url = "api/users/refresh";

class UserService {
  static async getUsers() {
    const res = await axios.get(url);
    return res.data.users;
  }

  static async insertUser(user) {
    try {
      const response = await axios.post(register_url, user);
      return response.data;
    } catch (err) {
      return {
        error: err.response?.data?.msg ? err.response.data : err,
        success: false,
      };
    }
  }

  static async loginUser(user) {
    try {
      const response = await axios.post(login_url, user);
      return {
        ...response.data,
        success: true,
      };
    } catch (err) {
      return {
        error: err.response?.data,
        success: false,
        status: err.response?.status,
      };
    }
  }

  static async logoutUser() {
    try {
      await axios.post(logout_url);
    } catch {
      // Still clear local session even if the request fails
    }
  }

  static async getMe() {
    const res = await axios.get(me_url);
    return res.data;
  }

  static async refresh() {
    const res = await axios.post(refresh_url);
    return res.data;
  }
}

export default UserService;
