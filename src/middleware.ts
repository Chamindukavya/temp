import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  const token = await getToken({ req });
  console.log('Token:', token);

  if (!token) {
    console.log('No token, redirecting to login...');
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

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
