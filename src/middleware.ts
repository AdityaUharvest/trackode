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
    '/playy/'
  ]

  // Check if the current path is protected
  const isProtected = protectedPaths.some(p => path.startsWith(p))
  
  if (isProtected) {
    // Log for debugging (check your hosting provider's logs)
    console.log(`Middleware processing protected route: ${path}`)
    
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET||process.env.NEXTAUTH_SECRET ,
      secureCookie:process.env.NODE_ENV === 'production'
    })

    console.log('Token exists:', !!token) // Debug log

    // If no token and path is protected, redirect to login
    if (!token) {
      const signInUrl = new URL('/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      console.log(`Redirecting to login from ${path}`) // Debug log
      return NextResponse.redirect(signInUrl)
    }

    
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  
}