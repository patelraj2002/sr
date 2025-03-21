// src/app/api/admin/stats/inquiries/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request) {
  try {
    const [
      totalInquiries,
      pendingInquiries,
      completedInquiries
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({
        where: { status: 'PENDING' }
      }),
      prisma.inquiry.count({
        where: { status: 'COMPLETED' }
      })
    ]);

    return NextResponse.json({
      totalInquiries,
      pendingInquiries,
      completedInquiries
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiry statistics' },
      { status: 500 }
    );
  }
}