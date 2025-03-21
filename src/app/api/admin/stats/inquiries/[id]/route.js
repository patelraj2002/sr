// src/app/api/admin/inquiries/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// Get single inquiry details
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            images: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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

    return NextResponse.json({
      success: true,
      inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry' },
      { status: 500 }
    );
  }
}

// Update inquiry status
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: body,
      include: {
        property: {
          include: {
            images: {
              take: 1
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// Delete inquiry
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.inquiry.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}