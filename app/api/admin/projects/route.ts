/**
 * MongoDB Projects API Routes
 * GET /api/admin/projects - List all projects
 * POST /api/admin/projects - Create new project
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeMongoDB } from '@/lib/db/mongodb-init';
import { verifyToken } from '@/lib/auth-simple';
import { getAllProjects, createProject, getMaxDisplayOrder } from '@/lib/db/mongodb-projects';

/**
 * GET /api/admin/projects
 * Get all projects
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure database is initialized
    await initializeMongoDB();

    const projects = await getAllProjects();
    
    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/projects
 * Create new project
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[DEBUG] POST /api/admin/projects - starting');
    
    // Verify authentication
    const user = verifyToken(request);
    console.log('[DEBUG] User:', user ? 'authenticated' : 'unauthorized');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure database is initialized
    console.log('[DEBUG] Initializing database...');
    await initializeMongoDB();

    const body = await request.json();
    console.log('[DEBUG] Request body:', JSON.stringify(body, null, 2));
    console.log('[DEBUG] image_alt value:', body.image_alt);
    console.log('[DEBUG] image_alt type:', typeof body.image_alt);
    console.log('[DEBUG] image_alt length:', body.image_alt?.length);

    // Validate required fields
    if (!body.title || !body.description || !body.category || !body.year || !body.image_alt) {
      console.log('[DEBUG] Missing required fields');
      console.log('[DEBUG] title:', body.title);
      console.log('[DEBUG] description:', body.description);
      console.log('[DEBUG] category:', body.category);
      console.log('[DEBUG] categories:', body.categories);
      console.log('[DEBUG] year:', body.year);
      console.log('[DEBUG] image_alt:', body.image_alt);
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, category, year, and image_alt are required' },
        { status: 400 }
      );
    }

    // Get max display_order and increment
    const maxOrder = await getMaxDisplayOrder();
    const displayOrder = maxOrder + 1;

    console.log('[DEBUG] Inserting project into database...');
    console.log('[DEBUG] display_order:', displayOrder);
    
    const project = await createProject({
      title: body.title,
      description: body.description,
      category: body.category,
      categories: body.categories ? JSON.stringify(body.categories) : JSON.stringify([body.category]),
      year: body.year,
      image: body.image || '',
      image_alt: body.image_alt,
      images: body.images || null,
      wide: body.wide || 0,
      featured: body.featured || 0,
      display_order: displayOrder,
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ERROR] Error creating project:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack';
    console.error('[ERROR] Stack:', errorStack);
    return NextResponse.json(
      { success: false, error: 'Failed to create project', details: errorMessage },
      { status: 500 }
    );
  }
}
