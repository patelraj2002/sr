// src/app/api/users/[userId]/saved-properties/[propertyId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function POST(request, { params: { userId, propertyId } }) {
  try {
    const session = await getServerSession();
    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperty = await prisma.savedProperty.create({
      data: {
        userId: userId,
        propertyId: propertyId
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Property saved successfully',
      savedProperty
    });

  } catch (error) {
    console.error('Error saving property:', error);
    return NextResponse.json(
      { error: 'Failed to save property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { userId, propertyId } }) {
  try {
    const session = await getServerSession();
    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Property unsaved successfully'
    });

  } catch (error) {
    console.error('Error unsaving property:', error);
    return NextResponse.json(
      { error: 'Failed to unsave property' },
      { status: 500 }
    );
  }
}