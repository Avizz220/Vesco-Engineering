import { Router, Request, Response } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        joinedDate: 'asc',
      },
    })
    res.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    res.status(500).json({ message: 'Error fetching team members' })
  }
})

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' })
    }
    res.json(teamMember)
  } catch (error) {
    console.error('Error fetching team member:', error)
    res.status(500).json({ message: 'Error fetching team member' })
  }
})

// @route   POST /api/team
// @desc    Add new team member
// @access  Private (Admin only)
router.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { name, role, bio, linkedinUrl, githubUrl, email, imageUrl, joinedDate } = req.body

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' })
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        linkedinUrl,
        githubUrl,
        email,
        imageUrl,
        joinedDate: joinedDate ? new Date(joinedDate) : new Date(),
      },
    })
    res.status(201).json(teamMember)
  } catch (error) {
    console.error('Error creating team member:', error)
    res.status(500).json({ message: 'Error creating team member' })
  }
})

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, role, bio, linkedinUrl, githubUrl, email, imageUrl, isActive } = req.body

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(bio !== undefined && { bio }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(email !== undefined && { email }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    res.json(teamMember)
  } catch (error) {
    console.error('Error updating team member:', error)
    res.status(500).json({ message: 'Error updating team member' })
  }
})

// @route   DELETE /api/team/:id
// @desc    Delete team member (soft delete by setting isActive to false)
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: { isActive: false },
    })
    res.json({ message: 'Team member deleted successfully', teamMember })
  } catch (error) {
    console.error('Error deleting team member:', error)
    res.status(500).json({ message: 'Error deleting team member' })
  }
})

export default router
