// src/app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        ...user,
        password: undefined // Remove password from response
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}