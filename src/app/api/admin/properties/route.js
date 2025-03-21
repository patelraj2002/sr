// src/app/api/admin/properties/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true,
        _count: {
          select: {
            inquiries: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}