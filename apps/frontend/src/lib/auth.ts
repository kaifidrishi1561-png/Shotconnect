import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const RENDER_BACKEND_URL = 'https://shotconnect-1.onrender.com/api';

const resolveApiBaseUrl = async (): Promise<string> => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('host') || '';
  const hostname = host.split(':')[0];

  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  return isLocalHost ? `http://${hostname}:8000/api` : RENDER_BACKEND_URL;
};

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const API_BASE_URL = await resolveApiBaseUrl();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      },
      cache: 'no-store',
      credentials: 'include'
    });

    if (!response.ok) {
      redirect('/login');
    }

    return response.json();
  } catch (error) {
    console.error('Auth fetch failed:', error);
    redirect('/login');
  }
}