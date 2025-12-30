// src/app/api/admin/stats/activities/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
  try {
    const [recentUsers, recentProperties, recentInquiries] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          name: true,
          userType: true,
          createdAt: true
        }
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { name: true }
          }
        }
      }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: { title: true }
          }
        }
      })
    ]);

    const activities = [
      ...recentUsers.map(user => ({
        type: 'USER',
        description: `New ${user.userType.toLowerCase()} ${user.name} joined`,
        timestamp: user.createdAt
      })),
      ...recentProperties.map(prop => ({
        type: 'PROPERTY',
        description: `New property "${prop.title}" listed by ${prop.owner.name}`,
        timestamp: prop.createdAt
      })),
      ...recentInquiries.map(inq => ({
        type: 'INQUIRY',
        description: `New inquiry for "${inq.property.title}"`,
        timestamp: inq.createdAt
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    return NextResponse.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}