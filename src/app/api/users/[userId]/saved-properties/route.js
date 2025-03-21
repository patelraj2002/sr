// src/app/api/users/[userId]/saved-properties/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session || session.id !== params.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const savedProperties = await prisma.savedProperty.findMany({
      where: {
        userId: params.userId
      },
      include: {
        property: {
          include: {
            images: true,
            sharingOptions: true
          }
        }
      }
    });

    return NextResponse.json({
      properties: savedProperties.map(sp => sp.property)
    });

  } catch (error) {
    console.error('Error fetching saved properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved properties' },
      { status: 500 }
    );
  }
}