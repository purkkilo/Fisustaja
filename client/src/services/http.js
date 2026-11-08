import axios from "axios";

axios.defaults.withCredentials = true;
// Service URLs are written "api/..." without a leading slash. Resolve them
// from the site root, not from the current page: on /public-results/<id>
// they would otherwise become /public-results/api/... (the app's HTML).
axios.defaults.baseURL = import.meta.env?.BASE_URL || "/";

let refreshPromise = null;

function isAuthUrl(url = "") {
  return (
    url.includes("api/users/login") ||
    url.includes("api/users/refresh") ||
    url.includes("api/users/logout")
  );
}

export function setupAuthInterceptor({ onUnauthorized }) {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (
        !original ||
        error.response?.status !== 401 ||
        original._retry ||
        isAuthUrl(original.url)
      ) {
        return Promise.reject(error);
      }

      original._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post("api/users/refresh").finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        return axios(original);
      } catch (refreshError) {
        onUnauthorized?.();
        return Promise.reject(refreshError);
      }
    },
  );
}

export default axios;
