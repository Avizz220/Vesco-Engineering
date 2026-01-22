import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()

    // Get cookies from backend response and set them in our response
    const setCookieHeader = response.headers.get('set-cookie')
    const res = NextResponse.json(data, { status: 201 })
    
    if (setCookieHeader) {
      res.headers.set('set-cookie', setCookieHeader)
    }

    return res
  } catch (error: any) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { message: 'Server error during sign up' },
      { status: 500 }
    )
  }
}
