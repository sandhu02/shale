import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export const COOKIE_NAME = 'admin_token';

export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function comparePassword(
  plain: string,
  hashed: string
) {
  if (
    hashed.startsWith('$2a$') ||
    hashed.startsWith('$2b$') ||
    hashed.startsWith('$2y$')
  ) {
    return await bcrypt.compare(plain, hashed);
  }

  const sha256Hash = crypto.createHash('sha256').update(plain).digest('hex');
  return sha256Hash === hashed;
}