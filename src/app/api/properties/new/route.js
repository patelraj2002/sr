// src/app/api/properties/new/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function POST(request) {
  try {
    // Verify authentication and authorization
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Please sign in to create a property' },
        { status: 401 }
      );
    }

    if (session.userType !== 'OWNER') {
      return NextResponse.json(
        { error: 'Only property owners can create listings' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Extract all fields from request body
    const {
      title,
      description,
      type,
      location,
      googleAddress,
      latitude,
      longitude,
      furnished,
      rooms,
      bathrooms,
      amenities,
      rules,
      available,
      price,
      sharingOptions,
      images,
      address,
      ownerId
    } = body;

    // Validate required fields
    if (!title || !description || !location || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    // Validate address fields
    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return NextResponse.json(
        { error: 'Complete address details are required' },
        { status: 400 }
      );
    }

    // Set area to street if not provided
    const addressArea = address.area || address.street;

    // Validate property type specific fields
    if (type === 'FLAT' && (!price || price <= 0)) {
      return NextResponse.json(
        { error: 'Valid price is required for flat listings' },
        { status: 400 }
      );
    }

    if (type === 'PG') {
      // Validate sharing options for PG
      if (!sharingOptions || sharingOptions.length === 0) {
        return NextResponse.json(
          { error: 'At least one sharing option is required for PG listings' },
          { status: 400 }
        );
      }

      // Validate each sharing option
      for (const option of sharingOptions) {
        if (!option.persons || !option.price || !option.total) {
          return NextResponse.json(
            { error: 'Incomplete sharing option details' },
            { status: 400 }
          );
        }

        if (option.available > option.total) {
          return NextResponse.json(
            { error: 'Available beds cannot exceed total beds' },
            { status: 400 }
          );
        }

        if (option.price <= 0) {
          return NextResponse.json(
            { error: 'Invalid price in sharing options' },
            { status: 400 }
          );
        }
      }
    }

    // Validate images
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one property image is required' },
        { status: 400 }
      );
    }

    // Verify owner
    if (ownerId !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized operation' },
        { status: 403 }
      );
    }

    // Create property with all related data
    const property = await prisma.property.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        type,
        status: 'ACTIVE',
        location: location.trim(),
        googleAddress: googleAddress?.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        furnished: Boolean(furnished),
        rooms: parseInt(rooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        amenities: Array.isArray(amenities) ? amenities : [],
        rules: Array.isArray(rules) ? rules : [],
        available: new Date(available),
        price: type === 'FLAT' ? parseFloat(price) : null,
        ownerId,

        // Create address
        address: {
          create: {
            street: address.street.trim(),
            area: addressArea.trim(),
            landmark: address.landmark?.trim() || null,
            city: address.city.trim(),
            state: address.state.trim(),
            pincode: address.pincode.trim()
          }
        },

        // Create sharing options for PG
        sharingOptions: type === 'PG' ? {
          create: sharingOptions.map(option => ({
            persons: parseInt(option.persons),
            price: parseFloat(option.price),
            available: parseInt(option.available),
            total: parseInt(option.total)
          }))
        } : undefined,

        // Create images
        images: {
          create: images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId || '',
            isMain: index === 0 // First image is main
          }))
        }
      },
      // Include all related data in response
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

    // Format the response
    const response = {
      success: true,
      message: 'Property created successfully',
      property: {
        ...property,
        price: type === 'PG' 
          ? Math.min(...property.sharingOptions.map(opt => opt.price))
          : property.price,
        mainImage: property.images.find(img => img.isMain)?.url || property.images[0]?.url,
        totalBeds: type === 'PG'
          ? property.sharingOptions.reduce((sum, opt) => sum + opt.total, 0)
          : null,
        availableBeds: type === 'PG'
          ? property.sharingOptions.reduce((sum, opt) => sum + opt.available, 0)
          : null
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Property creation error:', error);
    
    // Handle specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Duplicate property entry' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to create property',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}