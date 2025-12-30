// src/app/api/inquiries/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from '@/app/utils/auth';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, message, visitDate, sharingOptionId } = body;

    // Validate inputs
    if (!propertyId || !message) {
      return NextResponse.json(
        { error: 'Property ID and message are required' },
        { status: 400 }
      );
    }

    // Check if the property exists and get owner details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
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

    // Prevent owner from inquiring about their own property
    if (property.ownerId === session.id) {
      return NextResponse.json(
        { error: "You cannot inquire about your own property" },
        { status: 400 }
      );
    }

    // Create the inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        propertyId,
        name: session.name,
        email: session.email,
        phone: session.phone || '',
        message,
        visitDate: visitDate ? new Date(visitDate) : null,
        sharingOptionId: sharingOptionId || null,
        status: 'PENDING'
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            images: {
              take: 1
            }
          }
        }
      }
    });

    // Format the response
    const formattedInquiry = {
      id: inquiry.id,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      message: inquiry.message,
      visitDate: inquiry.visitDate,
      property: {
        id: inquiry.property.id,
        title: inquiry.property.title,
        location: inquiry.property.location,
        image: inquiry.property.images[0]?.url || null,
        owner: {
          name: inquiry.property.owner.name
        }
      }
    };

    return NextResponse.json({
      success: true,
      inquiry: formattedInquiry
    });

  } catch (error) {
    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Base query conditions
    const whereConditions = {};
    if (status) {
      whereConditions.status = status;
    }

    // Different queries for owners and seekers
    if (session.userType === 'OWNER') {
      whereConditions.property = {
        ownerId: session.id
      };
    } else {
      whereConditions.email = session.email;
    }

    // Get total count for pagination
    const totalCount = await prisma.inquiry.count({
      where: whereConditions
    });

    // Fetch inquiries with pagination
    const inquiries = await prisma.inquiry.findMany({
      where: whereConditions,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            type: true,
            location: true,
            images: {
              where: { isMain: true },
              take: 1
            },
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Format inquiries for response
    const formattedInquiries = inquiries.map(inquiry => ({
      id: inquiry.id,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      message: inquiry.message,
      response: inquiry.response,
      visitDate: inquiry.visitDate,
      property: {
        id: inquiry.property.id,
        title: inquiry.property.title,
        type: inquiry.property.type,
        location: inquiry.property.location,
        image: inquiry.property.images[0]?.url || null,
        sharingOptions: inquiry.property.sharingOptions,
        owner: {
          name: inquiry.property.owner.name,
          // Only include contact details for confirmed inquiries
          ...(inquiry.status === 'CONFIRMED' && {
            email: inquiry.property.owner.email,
            phone: inquiry.property.owner.phone
          })
        }
      }
    }));

    return NextResponse.json({
      success: true,
      inquiries: formattedInquiries,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}