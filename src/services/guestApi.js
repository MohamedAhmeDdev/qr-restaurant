import axios from 'axios';
import { ServerUrl } from '../utils/ServerUrl';

const guestApi = axios.create({
  baseURL: ServerUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

guestApi.interceptors.request.use(
  (config) => {
    // 1. Retrieve saved session token
    const token = sessionStorage.getItem('guest_table_token');
    if (token) {
      config.headers['X-Table-Token'] = token;
    }

    // 2. Extract URL path parameters
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const restaurantSlug = pathParts[0];
    const tableSlug = pathParts[1];

    if (restaurantSlug) config.headers['X-Restaurant-Slug'] = restaurantSlug;
    if (tableSlug) config.headers['X-Table-Slug'] = tableSlug;

    return config;
  },
  (error) => Promise.reject(error)
);

export default guestApi;