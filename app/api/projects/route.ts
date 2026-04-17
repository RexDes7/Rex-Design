/**
 * Public Projects API
 * GET /api/projects - Get all projects (no auth required)
 */

import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/db/mongodb-projects';

export async function GET() {
  try {
    const projects = await getAllProjects();

    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
