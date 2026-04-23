import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.yaja.example.com/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.error?.message ??
      error.message ??
      '오류가 발생했습니다.';
    return Promise.reject(new Error(msg));
  }
);

export default instance;
