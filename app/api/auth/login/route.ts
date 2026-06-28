import { NextRequest, NextResponse } from 'next/server';
import {
  comparePassword,
  createToken,
  COOKIE_NAME,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  if (
    username !== adminUsername ||
    !(await comparePassword(password, adminPasswordHash))
  ) {
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  }

  const token = await createToken({
    username,
    role: 'admin',
  });

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}