/**
 * MongoDB Login API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initializeMongoDB } from '@/lib/db/mongodb-init';
import { getUserByEmail } from '@/lib/db/mongodb-users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    await initializeMongoDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id?.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
