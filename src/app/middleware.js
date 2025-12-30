// src/middleware.js
import { NextResponse } from 'next/server';

// Define path configurations
const pathConfig = {
  public: ['/', '/auth', '/properties'],
  owner: {
    protected: ['/dashboard/owner'],
    redirect: '/auth?type=OWNER'
  },
  seeker: {
    protected: ['/dashboard/seeker'],
    redirect: '/auth?type=SEEKER'
  },
  protected: ['/properties/new', '/properties/edit']
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // Allow public paths
  if (pathConfig.public.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Handle owner dashboard routes
  if (pathname.startsWith('/dashboard/owner/')) {
    return handleOwnerRoutes(request, session);
  }

  // Handle seeker dashboard routes
  if (pathname.startsWith('/dashboard/seeker/')) {
    return handleSeekerRoutes(request, session);
  }

  // Handle general protected routes
  if (pathConfig.protected.some(path => pathname.startsWith(path))) {
    return handleProtectedRoutes(request, session);
  }

  return NextResponse.next();
}

function handleOwnerRoutes(request, session) {
  if (!session) {
    return redirectToAuth(request, 'OWNER');
  }

  try {
    const userData = JSON.parse(session);
    const ownerIdFromUrl = request.nextUrl.pathname.split('/')[3];

    if (userData.userType !== 'OWNER' || userData.id !== ownerIdFromUrl) {
      return handleUnauthorized(request);
    }

    return addUserHeader(request, session);
  } catch (error) {
    return handleInvalidSession(request);
  }
}

function handleSeekerRoutes(request, session) {
  const { pathname } = request.nextUrl;

  // If it's the main seeker dashboard, allow public access
  if (pathname === '/dashboard/seeker') {
    return NextResponse.next();
  }

  if (!session) {
    return redirectToAuth(request, 'SEEKER');
  }

  try {
    const userData = JSON.parse(session);
    const seekerIdFromUrl = pathname.split('/')[3];

    // For personal seeker dashboard
    if (seekerIdFromUrl) {
      if (userData.userType !== 'SEEKER' || userData.id !== seekerIdFromUrl) {
        return handleUnauthorized(request);
      }
    }

    return addUserHeader(request, session);
  } catch (error) {
    return handleInvalidSession(request);
  }
}

function handleProtectedRoutes(request, session) {
  if (!session) {
    return redirectToAuth(request);
  }

  try {
    const userData = JSON.parse(session);
    
    // Check if the route requires specific user type
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith('/properties/new') && userData.userType !== 'OWNER') {
      return handleUnauthorized(request);
    }

    return addUserHeader(request, session);
  } catch (error) {
    return handleInvalidSession(request);
  }
}

function redirectToAuth(request, userType = '') {
  const url = new URL('/auth', request.url);
  if (userType) {
    url.searchParams.set('type', userType);
  }
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function handleUnauthorized(request) {
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

function handleInvalidSession(request) {
  const response = NextResponse.redirect(new URL('/auth', request.url));
  response.cookies.delete('session');
  return response;
}

function addUserHeader(request, session) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('user', session);
  return NextResponse.next({
    headers: requestHeaders,
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/properties/new',
    '/properties/edit/:path*'
  ]
};