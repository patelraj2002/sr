// src/app/utils/clientAuth.js
export async function getClientSession() {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }