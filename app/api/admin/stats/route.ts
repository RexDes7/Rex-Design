/**
 * Stats API (MongoDB)
 * GET /api/admin/stats - Get dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-simple';
import { getDatabase } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDatabase();

    const totalProjects = await db.collection('projects').countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const pageviewsLast30Days = await db.collection('pageviews').countDocuments({
      timestamp: { $gte: thirtyDaysAgo.toISOString() }
    });

    const recentPageviews = await db.collection('pageviews')
      .find({}, { projection: { path: 1, timestamp: 1, _id: 0 } })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        pageviewsLast30Days,
        recentPageviews
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
