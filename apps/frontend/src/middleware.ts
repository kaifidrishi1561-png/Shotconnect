import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register'];
const protectedPrefixes = ['/home', '/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const hasAccessToken = Boolean(request.cookies.get('accessToken')?.value);

  if (pathname === '/') {
    return hasAccessToken
      ? NextResponse.redirect(new URL('/home', request.url))
      : NextResponse.redirect(new URL('/login', request.url));
  }

  if (publicRoutes.includes(pathname)) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  const isProtectedRoute = protectedPrefixes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !hasAccessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
