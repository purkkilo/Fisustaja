import axios from 'axios';

const url = "api/users/";
const register_url = "api/users/register";
const register_admin_url = "api/users/register-admin";
const login_url = "api/users/login";

class UserService {
    // Get users
    static async getUsers() {
        const res = await axios.get(url);
        try {
          const data = res.data
          return data.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
            createdAt: user.createdAt,
          }))
        } catch (err) {
          return err
        }
    }

    // Create user
    static insertUser(user) {
        return axios.post(register_url, {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            is_admin: false,
        });
    }

    // Create admin
    static insertAdmin(user) {
        return axios.post(register_admin_url, {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            is_admin: user.is_admin,
        });
    }

    // Get user
    static loginUser(user) {
        return axios.post(login_url, {
            email: user.email,
            password: user.password,
        });
    }
}
export default UserService;