import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdminPage = req.nextUrl.pathname.startsWith('/admin')

    if (isOnAdminPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/admin/:path*']
}
