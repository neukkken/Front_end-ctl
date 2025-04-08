// api/axios.ts
import axios, { isAxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_URL_API;

const instance = axios.create({
  baseURL: BASE_URL
});

(instance as any).isAxiosError = isAxiosError;

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;