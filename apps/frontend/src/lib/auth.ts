import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const resolveApiBaseUrl = async () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('host') || 'localhost:3000';
  const hostname = host.split(':')[0];
  return `http://${hostname}:8000/api`;
};

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  const API_BASE_URL = await resolveApiBaseUrl();

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
}
