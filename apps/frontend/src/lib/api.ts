import axios from 'axios';

const RENDER_BACKEND_URL = 'https://shotconnect.onrender.com/api';

const resolveApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

    return isLocalHost ? `http://${hostname}:8000/api` : RENDER_BACKEND_URL;
  }

  return RENDER_BACKEND_URL;
};

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true
});