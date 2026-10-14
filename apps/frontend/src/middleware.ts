import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/register'];
const protectedPrefixes = ['/home', '/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Static assets, API routes, favicon, aur Next internals ko ignore karein
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Auth status check (cookies)
  const hasAuth = Boolean(
    request.cookies.get('accessToken')?.value ||
    request.cookies.get('auth_session')?.value
  );

  // 3. Root route ('/')
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(hasAuth ? '/home' : '/login', request.url)
    );
  }

  // 4. Public routes (/login, /register)
  if (publicRoutes.includes(pathname)) {
    // Sirf tab redirect karein jab user sach me authenticated ho
    if (hasAuth) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // 5. Protected routes (/home, /dashboard, etc.)
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute && !hasAuth) {
    // Loop rokne ke liye: agar pehle se login par hi hain to redirect na karein
    if (pathname === '/login') {
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};