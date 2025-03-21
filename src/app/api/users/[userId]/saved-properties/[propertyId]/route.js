// src/app/api/users/[userId]/saved-properties/[propertyId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/serverAuth';

// GET - Check if property is saved
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId, propertyId } = params;

    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperty = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    });

    return NextResponse.json({
      success: true,
      isSaved: !!savedProperty
    });

  } catch (error) {
    console.error('Error checking saved status:', error);
    return NextResponse.json(
      { error: 'Failed to check saved status' },
      { status: 500 }
    );
  }
}

// POST - Save a property
export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId, propertyId } = params;

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

// DELETE - Unsave a property
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    const { userId, propertyId } = params;

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
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: true,
        message: 'Property was not saved'
      });
    }
    return NextResponse.json(
      { error: 'Failed to unsave property' },
      { status: 500 }
    );
  }
}