// src/app/api/admin/stats/users/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Get date range
    const startDate = new Date();
    if (timeRange === 'week') startDate.setDate(startDate.getDate() - 7);
    if (timeRange === 'month') startDate.setDate(startDate.getDate() - 30);
    if (timeRange === 'year') startDate.setDate(startDate.getDate() - 365);

    const [totalUsers, ownerCount, seekerCount, monthlyGrowth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { userType: 'OWNER' } }),
      prisma.user.count({ where: { userType: 'SEEKER' } }),
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: true,
      })
    ]);

    return NextResponse.json({
      totalUsers,
      owners: ownerCount,
      seekers: seekerCount,
      monthlyStats: {
        users: monthlyGrowth.map(item => item._count)
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}