import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Call backend API to invalidate token
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    const res = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear the token cookie
    res.cookies.delete('token')

    return res
  } catch (error: any) {
    console.error('Logout error:', error)
    const res = NextResponse.json(
      { message: 'Logged out' },
      { status: 200 }
    )
    res.cookies.delete('token')
    return res
  }
}
