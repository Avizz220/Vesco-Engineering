import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get all projects - To be implemented' })
})

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get project by ID - To be implemented' })
})

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Create project - To be implemented' })
})

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Update project - To be implemented' })
})

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(501).json({ message: 'Delete project - To be implemented' })
})

export default router
