// src/app/utils/serverAuth.js
import { cookies } from 'next/headers';

export async function getServerSession() {
  try {
    const cookieStore = cookies();
    const sessionCookie = await cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}