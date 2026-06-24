import { NextResponse } from 'next/server';
import { validateCredentials, createToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const isValid = await validateCredentials(username, password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = await createToken(username);
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return response;
}