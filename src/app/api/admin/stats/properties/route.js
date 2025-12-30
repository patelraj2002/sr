// src/app/api/admin/stats/properties/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request) {
  try {
    const [
      totalProperties,
      activeProperties,
      propertyTypes,
      popularLocations
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.property.groupBy({
        by: ['type'],
        _count: true
      }),
      // Fixed query for popular locations
      prisma.property.groupBy({
        by: ['location'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      })
    ]);

    const propertyTypeStats = {
      PG: 0,
      FLAT: 0
    };
    propertyTypes.forEach(type => {
      propertyTypeStats[type.type] = type._count;
    });

    // Transform popular locations data
    const transformedLocations = popularLocations.map(loc => ({
      name: loc.location,
      count: loc._count.id
    }));

    return NextResponse.json({
      totalProperties,
      activeProperties,
      propertyTypes: propertyTypeStats,
      popularLocations: transformedLocations,
      monthlyStats: {
        properties: [] // Add proper monthly stats if needed
      }
    });
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property statistics' },
      { status: 500 }
    );
  }
}