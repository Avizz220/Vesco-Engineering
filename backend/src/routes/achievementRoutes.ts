import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get all achievements - To be implemented' })
})

// @route   GET /api/achievements/:id
// @desc    Get achievement by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get achievement by ID - To be implemented' })
})

// @route   POST /api/achievements
// @desc    Create new achievement
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Create achievement - To be implemented' })
})

// @route   PUT /api/achievements/:id
// @desc    Update achievement
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Update achievement - To be implemented' })
})

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Delete achievement - To be implemented' })
})

export default router
