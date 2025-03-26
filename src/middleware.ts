import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // Redirect if the user is not authenticated
    if (!token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next(); // Allow request to proceed
}

// Apply middleware only to protected routes
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/quiz-play/:path*",
        "/quiz-result/:path*",
        "/quiz-setup/:path*",
    ],
};
