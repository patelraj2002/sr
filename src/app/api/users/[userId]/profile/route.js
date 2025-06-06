// src/app/api/users/[userId]/profile/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId } = params;

    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, alternatePhone } = body;
    
    console.log('Updating profile with data:', { name, phone, alternatePhone });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        alternatePhone
      }
    });

    console.log('Updated user:', updatedUser);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        alternatePhone: updatedUser.alternatePhone,
        userType: updatedUser.userType
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}