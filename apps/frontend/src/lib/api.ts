import axios from 'axios';

const resolveApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0/0'].includes(hostname);
    const backendHost = isLocalHost ? hostname : 'localhost';
    return `http://${backendHost}:8000/api`;
  }

  return 'http://localhost:8000/api';
};

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true
});
