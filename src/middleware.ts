import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const protectedPaths = [
    '/dashboard',
    '/admin-dashboard',
    '/quiz-play',
    '/quiz-result',
    '/quiz-setup',
    '/premium-mock-tests',
    '/mock-tests',
    'playy'
  ]

  // Check if the current path is protected
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  
  if (isProtected) {
    // Log for debugging (check your hosting provider's logs)
    console.log(`Middleware processing protected route: ${path}`)
    
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
      secureCookie: 
        process.env.NODE_ENV === 'production' ||
        process.env.VERCEL_ENV === 'production' ||
        process.env.HOSTNAME?.includes('vercel.app')
    })

    console.log('Token exists:', !!token) // Debug log

    // If no token and path is protected, redirect to login
    if (!token) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      console.log(`Redirecting to login from ${path}`) // Debug log
      return NextResponse.redirect(signInUrl)
    }

    // Optional: Add role-based checks here
    // if (path.startsWith('/admin-dashboard') && token.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  
}