// src/app/api/admin/auth/route.js
import { NextResponse } from 'next/server';

const ADMIN_CREDENTIALS = {
  email: 'ronak.srhomes@gmail.com',
  password: 'Ronak@2025'
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({
        success: true,
        admin: {
          email: ADMIN_CREDENTIALS.email,
          role: 'SUPER_ADMIN'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}