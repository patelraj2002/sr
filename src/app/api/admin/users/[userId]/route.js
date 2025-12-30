import { NextResponse } from 'next/server'; // Add this import
import prisma from '@/app/lib/db';

export async function DELETE(request, { params }) {
  try {
    // Await params to fix the warning
    const userId = await params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete all associated data in the correct order
    await prisma.$transaction(async (tx) => {
      // Delete saved properties
      await tx.savedProperty.deleteMany({
        where: { userId: userId }
      });

      // Delete inquiries for user's properties
      await tx.inquiry.deleteMany({
        where: {
          property: {
            ownerId: userId
          }
        }
      });

      // Delete images for user's properties
      await tx.image.deleteMany({
        where: {
          property: {
            ownerId: userId
          }
        }
      });

      // Delete sharing options for user's properties
      await tx.sharingOption.deleteMany({
        where: {
          property: {
            ownerId: userId
          }
        }
      });

      // Delete addresses for user's properties
      await tx.address.deleteMany({
        where: {
          property: {
            ownerId: userId
          }
        }
      });

      // Delete user's properties
      await tx.property.deleteMany({
        where: { ownerId: userId }
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
