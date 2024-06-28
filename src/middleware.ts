import {type NextRequest, NextResponse} from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

const loggedInRoutes = ["/dashboard"];
const authToken = 'sb-hufmgntltpmeoisjbcba-auth-token'

export async function middleware(request: NextRequest) {
    const nextResponse = await updateSession(request)
    const cookies = request.cookies.get(authToken)
    let token: string | undefined = undefined

    // Check if auth token is available
    token = cookies?.value

    // If no token present for auth protected routes, redirect to landing page
    if (!token && loggedInRoutes.some((path) => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.redirect("http://localhost:3000/");
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ],
}