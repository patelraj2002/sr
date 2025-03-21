// src/app/api/properties/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const property = await prisma.property.findUnique({
      where: { id },
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
        address: true,
        sharingOptions: true,
        inquiries: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);

  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Verify ownership
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true }
    });

    if (!property || property.ownerId !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.type === 'FLAT' ? parseFloat(body.price) : null,
        location: body.location,
        googleAddress: body.googleAddress,
        latitude: body.latitude,
        longitude: body.longitude,
        type: body.type,
        status: body.status || 'ACTIVE',
        furnished: body.furnished,
        rooms: parseInt(body.rooms),
        bathrooms: parseInt(body.bathrooms),
        amenities: body.amenities,
        rules: body.rules,
        available: new Date(body.available),
        
        // Update address
        address: {
          upsert: {
            create: body.address,
            update: body.address
          }
        },

        // Update sharing options
        sharingOptions: {
          deleteMany: {},
          create: body.type === 'PG' ? body.sharingOptions.map(opt => ({
            persons: parseInt(opt.persons),
            price: parseFloat(opt.price),
            available: parseInt(opt.available),
            total: parseInt(opt.total)
          })) : []
        },

        // Update images
        images: {
          deleteMany: {},
          create: body.images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId || '',
            isMain: index === 0
          }))
        }
      },
      include: {
        images: true,
        address: true,
        sharingOptions: true
      }
    });

    return NextResponse.json(updatedProperty);

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}