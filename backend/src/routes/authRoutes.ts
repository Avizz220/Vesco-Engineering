import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient, Role } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'

const router = Router()
const prisma = new PrismaClient()

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Helper function to determine user role
const determineUserRole = (email: string, password: string): Role => {
  // Check if email starts with "vescoenjos" and password is "vescoengineering-2026"
  const isAdmin = email.toLowerCase().startsWith('vescoenjos') && password === 'vescoengineering-2026'
  return isAdmin ? Role.ADMIN : Role.MEMBER
}

// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    ;(req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    console.log('🔵 SIGNUP REQUEST RECEIVED:', { body: req.body })
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array() 
      })
    }

    try {
      const { fullName, email, password } = req.body
      console.log('✅ Processing signup for:', email)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already registered' 
        })
      }

      // Determine user role based on email and password
      const userRole = determineUserRole(email, password)

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user in database
      const user = await prisma.user.create({
        data: {
          fullName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: userRole,
        },
      })

      console.log('✅ USER CREATED IN DATABASE:', { id: user.id, email: user.email, role: user.role })

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        }
      })
    } catch (error: any) {
      console.error('Sign up error:', error)
      return res.status(500).json({ 
        success: false,
        message: error.message || 'Server error during sign up',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  }
)

// @route   POST /api/auth/signin
// @desc    Sign in user
// @access  Public
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    console.log('🔵 SIGNIN REQUEST RECEIVED:', { email: req.body.email })
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array() 
      })
    }

    try {
      const { email, password } = req.body

      // Find user in database
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      console.log('🔍 USER LOOKUP RESULT:', user ? 'FOUND' : 'NOT FOUND')

      if (!user || !user.password) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        })
      }

      // Compare password with hashed password in database
      const isPasswordValid = await bcrypt.compare(password, user.password)

      console.log('🔐 PASSWORD VALIDATION:', isPasswordValid ? 'VALID' : 'INVALID')

      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        })
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      })
    } catch (error: any) {
      console.error('Sign in error:', error)
      return res.status(500).json({ message: 'Server error during sign up' })
    }
  }
)

// @route   POST /api/auth/signin
// @desc    Sign in user
// @access  Public
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password || '')

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({
        id: user.id,
        name: user.fullName,
        email: user.email,
        image: user.image,
      })
    } catch (error: any) {
      console.error('Sign in error:', error)
      return res.status(500).json({ 
        success: false,
        message: 'Server error during sign in' 
      })
    }
  }
)

// @route   POST /api/auth/google
// @desc    Google OAuth sign in
// @access  Public
router.post('/google', async (req: Request, res: Response) => {
  console.log('🔵 GOOGLE AUTH ENDPOINT HIT')
  
  const clientId = process.env.GOOGLE_CLIENT_ID
  console.log(`🔧 Configured Client ID (Server): ${clientId ? clientId.substring(0, 15) + '...' : 'UNDEFINED'}`)
  
  try {
    const { credential } = req.body

    if (!clientId) {
      console.error('❌ CRITICAL ERROR: GOOGLE_CLIENT_ID is not defined in environment variables')
      return res.status(500).json({ message: 'Server configuration error: Google Client ID missing' })
    }

    if (!credential) {
      return res.status(400).json({ message: 'Credential is required' })
    }

    // 1. Verify Token
    console.log('🔐 Verifying ID Token...')
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      })
    } catch (verifyError: any) {
      console.error('❌ Token Verification Failed:', verifyError.message)
      return res.status(401).json({ 
        message: 'Token verification failed', 
        details: verifyError.message,
        tip: 'Ensure Frontend and Backend use the exact same Google Client ID'
      })
    }

    const payload = ticket.getPayload()
    
    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token payload' })
    }

    const { email, name, picture, sub: googleId } = payload
    console.log('✅ Token Verified. Email:', email)

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' })
    }

    // 2. Database Operations
    console.log('💾 Checking Database for user...')
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // If user doesn't exist, create new user
    if (!user) {
      console.log('👤 Creating new user...')
      try {
        user = await prisma.user.create({
          data: {
            email,
            fullName: name || email.split('@')[0],
            image: picture || null,
            googleId,
            password: null, // No password for Google OAuth users
            role: Role.MEMBER,
          },
        })
      } catch (dbError: any) {
        console.error('❌ DB Create Error:', dbError)
        throw new Error(`Database Create Error: ${dbError.message}`)
      }
    } else if (!user.googleId) {
      console.log('↻ Updating existing user with Google ID...')
      try {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        })
      } catch (dbError: any) {
         console.error('❌ DB Update Error:', dbError)
         throw new Error(`Database Update Error: ${dbError.message}`)
      }
    }

    // 3. Create Session Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Google sign in error:', error)
    // Return the actual error message to help debugging
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Server error during Google sign in',
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      id: user.id,
      name: user.fullName,
      email: user.email,
      image: user.image,
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token')
  return res.status(200).json({ message: 'Logged out successfully' })
})

// @route   GET /api/auth/admins
// @desc    Get all admin users
// @access  Public (needed for project contributors dropdown)
router.get('/admins', async (req: Request, res: Response) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
      },
      orderBy: { fullName: 'asc' }
    })

    return res.status(200).json(admins)
  } catch (error: any) {
    console.error('Get admins error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
})

// @route   POST /api/auth/google
// @desc    Authenticate with Google OAuth
// @access  Public
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ 
        success: false,
        message: 'Google credential is required' 
      })
    }

    // Decode the JWT credential from Google
    const base64Url = credential.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString())

    const { sub: googleId, email, name, picture } = payload

    if (!email || !googleId) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid Google credential' 
      })
    }

    // Check if user exists with this Google ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleId },
          { email: email }
        ]
      }
    })

    if (user) {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { 
            googleId: googleId,
            image: picture || user.image
          }
        })
      }
    } else {
      // Create new user with Google authentication
      user = await prisma.user.create({
        data: {
          fullName: name,
          email: email,
          googleId: googleId,
          password: null, // No password for Google auth users
          image: picture,
          role: email.toLowerCase().startsWith('vescoenjos') ? Role.ADMIN : Role.MEMBER
        }
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        role: user.role
      }
    })
  } catch (error: any) {
    console.error('Google auth error:', error)
    return res.status(500).json({ 
      success: false,
      message: 'Google authentication failed',
      error: error.message 
    })
  }
})

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post(
  '/change-password',
  verifyToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    console.log('🔵 CHANGE PASSWORD REQUEST RECEIVED')
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array() 
      })
    }

    try {
      const { currentPassword, newPassword } = req.body
      const userId = (req as any).user.id

      // Find user in database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        })
      }

      // Check if user has a password (not Google user)
      if (!user.password) {
        return res.status(400).json({ 
          success: false,
          message: 'Cannot change password for Google accounts' 
        })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Current password is incorrect' 
        })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update password in database
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      })

      console.log('✅ PASSWORD CHANGED FOR USER:', userId)

      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error: any) {
      console.error('Change password error:', error)
      return res.status(500).json({ 
        success: false,
        message: 'Server error while changing password' 
      })
    }
  }
)

export default router

