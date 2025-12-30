// src/app/api/users/[userId]/saved-properties/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/serverAuth';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const session = await getServerSession();

    if (!session || session.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperties = await prisma.savedProperty.findMany({
      where: {
        userId: userId
      },
      include: {
        property: {
          include: {
            images: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            sharingOptions: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      savedProperties
    });

  } catch (error) {
    console.error('Error fetching saved properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved properties' },
      { status: 500 }
    );
  }
}