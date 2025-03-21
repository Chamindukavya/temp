import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  // Get the token using NextAuth's utility
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'next-auth.session-token', // Explicitly specify cookie name
  });
  console.log('Decoded token:', token);

  if (!token) {
    console.log('No token, redirecting to login...');
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // Token is already decoded and verified by getToken
  console.log('Decoded token:', token);
  // Access user data (e.g., token.id, token.role, token.subscription)

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/quizzes/:path*',
    '/community/:path*',
    '/progress/:path*',
    '/subscription',
  ],
};