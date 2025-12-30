// src/app/api/admin/properties/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

// Get single property details
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true,
        inquiries: {
          include: {
            property: true
          }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// Update property status
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: body,
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
    });

    return NextResponse.json({
      success: true,
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// Delete property
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete associated images first
    await prisma.image.deleteMany({
      where: { propertyId: id }
    });

    // Delete the property
    await prisma.property.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}