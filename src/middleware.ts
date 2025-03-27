import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const protectedPaths = [
    '/dashboard',
    '/admin-dashboard',
    '/quiz-play',
    '/quiz-result',
    '/quiz-setup'
  ]

  // Check if the current path is protected
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  
  if (isProtected) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    })

    // If no token and path is protected, redirect to login
    if (!token) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Additional role-based checks (example for admin dashboard)
    
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)',
  ],
}