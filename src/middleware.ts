import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/diary/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*', ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;


  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/diary'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (token && url.pathname.startsWith('/diary')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
