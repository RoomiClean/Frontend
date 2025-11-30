import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { API_BASE_URL, API_TIMEOUT, API_HEADERS } from '@/constants/develop.constants';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: API_HEADERS,
  withCredentials: true,
});

apiInstance.interceptors.request.use(config => {
  if (config.data) {
    config.data = snakecaseKeys(config.data, { deep: true });
  }
  return config;
});

apiInstance.interceptors.response.use(response => {
  if (response.data) {
    response.data = camelcaseKeys(response.data, { deep: true });
  }
  return response;
});

export default apiInstance;
