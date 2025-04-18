import { NextResponse } from 'next/server';
import { getServerSession } from '@/app/utils/auth';
import prisma from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId } = params;

    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' }, 
        { status: 401 }
      );
    }

    const data = await request.json();
    const { currentPassword, newPassword } = data;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current and new password are required' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
