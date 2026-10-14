import axios from 'axios';

const resolveApiBaseUrl = () => {
  // 1. अगर Environment Variable में API URL सेट है, तो सबसे पहले उसे यूज़ करें
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. ब्राउज़र में लोकल डेवलपमेंट के लिए फॉलबैक
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost = ['localhost', '127.0.0.1'].includes(hostname);

    // अगर लोकल में चल रहा है तो 8000 पोर्ट, वरना Render का लाइव URL
    return isLocalHost 
      ? `http://${hostname}:8000/api` 
      : 'https://shotconnect-1.onrender.com/api';
  }

  // 3. SSR (Server-Side) फॉलबैक
  return 'https://shotconnect-1.onrender.com/api';
};

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});