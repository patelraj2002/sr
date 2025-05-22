import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId } = params;

    // Check if user is authenticated and is deleting their own account
    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the user and all related data (Prisma will handle cascading deletes)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}