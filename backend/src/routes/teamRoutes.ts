import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get all team members - To be implemented' })
})

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get team member by ID - To be implemented' })
})

// @route   POST /api/team
// @desc    Add new team member
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Add team member - To be implemented' })
})

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Update team member - To be implemented' })
})

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Delete team member - To be implemented' })
})

export default router
