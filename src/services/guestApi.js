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
    // 1. Handle token (persist in sessionStorage for smooth SPA navigation)
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token') || sessionStorage.getItem('guest_table_token');

    if (token) {
      sessionStorage.setItem('guest_table_token', token);
      config.headers['X-Table-Token'] = token;
    }

    // 2. Extract slugs from current page URL and send via headers
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const restaurantSlug = pathParts[0];
    const tableSlug = pathParts[1];

    if (restaurantSlug) config.headers['X-Restaurant-Slug'] = restaurantSlug;
    if (tableSlug) config.headers['X-Table-Slug'] = tableSlug;

    // config.url remains beautifully clean (e.g., '/menu', '/guest/orders')
    return config;
  },
  (error) => Promise.reject(error)
);

export default guestApi;