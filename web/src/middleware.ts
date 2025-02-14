/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
// import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    // Authentication middleware commented out for frontend-only deployment
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/u',
        '/pseudobot',
        '/u/profile',
        '/aboutus',
        '/analyzer',
        '/algovisualise',
        '/comptest',
        '/main',
        '/u/dashboard',
        '/roadmap',
        '/u/edit-profile'
    ],
};