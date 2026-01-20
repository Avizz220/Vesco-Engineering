import { Router } from 'express'
import { body } from 'express-validator'

const router = Router()

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  (req, res) => {
    // Controller will be implemented
    res.status(501).json({ message: 'Register endpoint - To be implemented' })
  }
)

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res) => {
    // Controller will be implemented
    res.status(501).json({ message: 'Login endpoint - To be implemented' })
  }
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', (req, res) => {
  // Controller will be implemented
  res.status(501).json({ message: 'Get current user - To be implemented' })
})

export default router
