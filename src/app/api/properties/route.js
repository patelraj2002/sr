// src/app/api/properties/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const location = searchParams.get('location');
    const furnished = searchParams.get('furnished');
    const amenities = searchParams.get('amenities')?.split(',') || [];

    // Build where clause
    let where = {};

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add owner filter if ownerId is provided
    if (ownerId) {
      // Verify owner exists and is valid
      const owner = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!owner || owner.userType !== 'OWNER') {
        return NextResponse.json(
          { error: 'Invalid owner ID' },
          { status: 404 }
        );
      }

      where.ownerId = ownerId;
    }

    // Add type filter
    if (type && type !== 'ALL') {
      where.type = type;
    }

    // Add price filter
    if (priceMin || priceMax) {
      where.OR = [
        // For FLAT type
        {
          AND: [
            { type: 'FLAT' },
            priceMin && { price: { gte: parseFloat(priceMin) } },
            priceMax && { price: { lte: parseFloat(priceMax) } }
          ].filter(Boolean)
        },
        // For PG type
        {
          AND: [
            { type: 'PG' },
            {
              sharingOptions: {
                some: {
                  AND: [
                    priceMin && { price: { gte: parseFloat(priceMin) } },
                    priceMax && { price: { lte: parseFloat(priceMax) } }
                  ].filter(Boolean)
                }
              }
            }
          ]
        }
      ];
    }

    // Add location filter
    if (location) {
      where.OR = [
        { location: { contains: location, mode: 'insensitive' } },
        { googleAddress: { contains: location, mode: 'insensitive' } },
        {
          address: {
            OR: [
              { city: { contains: location, mode: 'insensitive' } },
              { state: { contains: location, mode: 'insensitive' } },
              { pincode: { contains: location } }
            ]
          }
        }
      ];
    }

    // Add furnished filter
    if (furnished === 'true') {
      where.furnished = true;
    }

    // Add amenities filter
    if (amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities
      };
    }

    // Fetch properties with all related data
    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
            url: true,
            isMain: true,
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        sharingOptions: {
          orderBy: {
            persons: 'asc'
          }
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format properties (keep your existing formatting logic)
    const formattedProperties = properties.map(property => ({
      ...property,
      price: property.type === 'PG' 
        ? property.sharingOptions.length > 0 
          ? Math.min(...property.sharingOptions.map(opt => opt.price))
          : null
        : property.price,
      
      sharingOptions: property.sharingOptions.map(option => ({
        ...option,
        availabilityStatus: 
          option.available === 0 ? 'FULL' :
          option.available === option.total ? 'EMPTY' : 'PARTIALLY_OCCUPIED',
        occupancyRate: ((option.total - option.available) / option.total) * 100
      })),

      mainImage: property.images.find(img => img.isMain)?.url || 
                property.images[0]?.url || 
                '/images/placeholder.jpg',

      fullAddress: property.address 
        ? `${property.address.street}, ${property.address.city}, ${property.address.state} - ${property.address.pincode}`
        : property.location,

      metadata: {
        hasImages: property.images.length > 0,
        totalSharing: property.type === 'PG' ? property.sharingOptions.length : null,
        totalBeds: property.type === 'PG' 
          ? property.sharingOptions.reduce((sum, opt) => sum + opt.total, 0)
          : null,
        availableBeds: property.type === 'PG'
          ? property.sharingOptions.reduce((sum, opt) => sum + opt.available, 0)
          : null,
      }
    }));

    return NextResponse.json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch properties',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'ownerId', 'type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          fields: missingFields
        },
        { status: 400 }
      );
    }

    // Verify owner exists and is authorized
    const owner = await prisma.user.findUnique({
      where: { id: body.ownerId }
    });

    if (!owner || owner.userType !== 'OWNER') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized: Invalid owner' 
        },
        { status: 401 }
      );
    }

    // Validate sharing options for PG
    if (body.type === 'PG' && (!body.sharingOptions || body.sharingOptions.length === 0)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'PG properties must have at least one sharing option'
        },
        { status: 400 }
      );
    }

    // Create property with all related data
    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: 'ACTIVE',
        location: body.location,
        price: body.type === 'FLAT' ? body.price : undefined,
        rooms: body.rooms || 1,
        bathrooms: body.bathrooms || 1,
        furnished: body.furnished || false,
        available: body.available || new Date(),
        amenities: body.amenities || [],
        rules: body.rules || [],
        ownerId: body.ownerId,
        latitude: body.latitude,
        longitude: body.longitude,
        googleAddress: body.googleAddress,

        // Create address if provided
        address: body.address ? {
          create: body.address
        } : undefined,

        // Create sharing options for PG
        sharingOptions: body.type === 'PG' ? {
          create: body.sharingOptions.map(option => ({
            persons: parseInt(option.persons),
            price: parseFloat(option.price),
            available: parseInt(option.available),
            total: parseInt(option.total)
          }))
        } : undefined,

        // Create images
        images: {
          create: (body.images || []).map((image, index) => ({
            url: image.url,
            publicId: image.publicId || '',
            isMain: index === 0 // First image is main
          }))
        }
      },
      include: {
        images: true,
        sharingOptions: true,
        address: true,
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
      property
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create property',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}