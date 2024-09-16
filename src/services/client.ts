import axios from 'axios';
import { useConfigStore } from '@/stores/config';
import router from '@/router';
import { LOGIN_PAGE_PATH } from '@/router/routePath';

export const baseUrl = import.meta.env.VITE_BASE_URL;

const client = axios.create({
  timeout: 60000,
  baseURL: baseUrl,
});

client.interceptors.request.use(
  async (config) => {
    const configStore = useConfigStore();

    // @ts-ignore
    config.headers = {
      Authorization: configStore.accessToken ? `Bearer ${configStore.accessToken}` : undefined,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json, text/plain',
      'charset': 'UTF-8',
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      'Access-Control-Allow-Credentials': 'true',
      "Access-Control-Allow-Headers": '*',
      "Access-Control-Expose-Headers": '*',
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  function (response) {
    if (response.status === 200 || response.status === 201) {
      return response?.data;
    } else {
      console.warn('status # 200');
    }
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      // Thực hiện các hành động như đăng nhập lại hoặc hiển thị thông báo

      await router.replace({
        path: LOGIN_PAGE_PATH,
        replace: true,
      });
    }
    throw error;
  },
);

export default client;
