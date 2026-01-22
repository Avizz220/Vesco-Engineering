import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token
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
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

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

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
    } catch (error: any) {
      console.error('Sign up error:', error)
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
        name: user.name,
        email: user.email,
        image: user.image,
      })
    } catch (error: any) {
      console.error('Sign in error:', error)
      return res.status(500).json({ message: 'Server error during sign in' })
    }
  }
)

// @route   POST /api/auth/google
// @desc    Google OAuth sign in
// @access  Public
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    // Verify Google token (you'll need to install google-auth-library)
    // For now, we'll create/find user
    // In production, verify the token with Google API

    return res.status(201).json({ message: 'Google sign in - To be implemented with google-auth-library' })
  } catch (error: any) {
    console.error('Google sign in error:', error)
    return res.status(500).json({ message: 'Server error during Google sign in' })
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
      name: user.name,
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

export default router

