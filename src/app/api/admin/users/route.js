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
            properties: true,
            savedProperties: true
          }
        },
        properties: {
          select: {
            id: true,
            title: true,
            status: true,
            type: true,
            createdAt: true,
            _count: {
              select: {
                inquiries: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get only last 5 properties
        }
      }
    });

    // Remove sensitive data and format response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return {
        ...safeUser,
        // Add computed fields
        totalProperties: user._count.properties,
        totalSavedProperties: user._count.savedProperties,
        // Format dates
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        // Format recent properties
        recentProperties: user.properties.map(prop => ({
          ...prop,
          createdAt: prop.createdAt.toISOString(),
          totalInquiries: prop._count.inquiries
        }))
      };
    });

    return NextResponse.json({
      success: true,
      users: safeUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.name || !data.userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate userType
    if (!['OWNER', 'SEEKER'].includes(data.userType)) {
      return NextResponse.json(
        { error: 'Invalid user type. Must be OWNER or SEEKER' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        userType: data.userType,
        phone: data.phone || null,
        password: data.password, // In real app, ensure this is hashed
        lastLoginAt: null
      }
    });

    // Remove sensitive data
    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...safeUser,
        createdAt: safeUser.createdAt.toISOString(),
        updatedAt: safeUser.updatedAt.toISOString(),
        lastLoginAt: null
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
