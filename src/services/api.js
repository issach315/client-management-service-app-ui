import axios from "axios";

// Base Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request Interceptor (no token logic)
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

//  Reusable HTTP Methods
export const get = (url, params = {}) => {
  return API.get(url, { params });
};

export const post = (url, data = {}) => {
  return API.post(url, data);
};

export const put = (url, data = {}) => {
  return API.put(url, data);
};

export const del = (url) => {
  return API.delete(url);
};

export default API;
