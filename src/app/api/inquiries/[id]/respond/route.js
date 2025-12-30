// src/app/api/inquiries/[id]/respond/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { response } = await request.json();

    // Verify inquiry exists and belongs to the owner
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true
          }
        }
      }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    if (inquiry.property.ownerId !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update inquiry with response
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status: 'RESPONDED',
        response: response,
        updatedAt: new Date()
      }
    });

    // TODO: Send email notification to inquirer
    // You can implement email notification here

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry
    });

  } catch (error) {
    console.error('Error responding to inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to respond to inquiry' },
      { status: 500 }
    );
  }
}