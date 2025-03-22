// src/app/api/properties/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/serverAuth'; // Updated import

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
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
        sharingOptions: {
          orderBy: {
            persons: 'asc'
          }
        },
        inquiries: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if the property is saved by the current user
    let isSaved = false;
    if (session && session.id !== property.ownerId) {
      const savedProperty = await prisma.savedProperty.findUnique({
        where: {
          userId_propertyId: {
            userId: session.id,
            propertyId: id
          }
        }
      });
      isSaved = !!savedProperty;
    }

    return NextResponse.json({
      success: true,
      property,
      isOwner: session?.id === property.ownerId,
      isSaved,
      userSession: session // Include session info for client
    });

  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch property',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
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

    // Validate required fields
    if (!body.title || !body.location || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
        sharingOptions: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
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
      { 
        success: false,
        error: 'Failed to update property',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}