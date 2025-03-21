// src/app/utils/clientAuth.js
export async function getClientSession() {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) throw new Error('Failed to fetch session');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}