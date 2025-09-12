import axios from "axios";
import { store } from "../store";

const baseURL = "https://riderbackend-gbe0.onrender.com/api/";

const createApi = () => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add token to headers
  instance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.authConfig?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log(token)
      return config;
    },
    (error) => Promise.reject(error)
  );

  // API methods
  const get = (url, params = {}) => {
    return instance.get(url, { params }); // Support query parameters
  };

  const post = (url, data) => {
    return instance.post(url, data);
  };

  const put = (url, data) => {
    return instance.put(url, data);
  };

  const patch = (url, data) => {
    return instance.patch(url, data);
  };

  const del = (url) => {
    return instance.delete(url);
  };

  return { get, post, put, patch, del };
};

export const { get, post, put, patch, del } = createApi();
