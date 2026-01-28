import { Router, Request, Response } from 'express'
import { authenticate, authorize } from '../middleware/auth'
import { PrismaClient } from '@prisma/client'
import { upload, getImageUrl } from '../middleware/upload'

const prisma = new PrismaClient()
const router = Router()

// Middleware to check admin role
const verifyAdmin = [authenticate, authorize('admin')]

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
      where: { id: String(id) },
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
router.post('/', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { name, role, bio, linkedinUrl, githubUrl, email, department } = req.body

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' })
    }

    const imageUrl = getImageUrl(req.file)

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        linkedinUrl,
        githubUrl,
        email,
        department,
        imageUrl,
        joinedDate: new Date(),
      },
    })
    res.status(201).json({ success: true, teamMember })
  } catch (error) {
    console.error('Error creating team member:', error)
    res.status(500).json({ success: false, message: 'Error creating team member' })
  }
})

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, role, bio, linkedinUrl, githubUrl, email, department, isActive } = req.body

    const imageUrl = req.file ? getImageUrl(req.file) : undefined

    const teamMember = await prisma.teamMember.update({
      where: { id: String(id) },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(bio !== undefined && { bio }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(email !== undefined && { email }),
        ...(department !== undefined && { department }),
        ...(imageUrl && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    res.json({ success: true, teamMember })
  } catch (error) {
    console.error('Error updating team member:', error)
    res.status(500).json({ success: false, message: 'Error updating team member' })
  }
})

// @route   DELETE /api/team/:id
// @desc    Delete team member (soft delete by setting isActive to false)
// @access  Private (Admin only)
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const teamMember = await prisma.teamMember.update({
      where: { id: String(id) },
      data: { isActive: false },
    })
    res.json({ success: true, message: 'Team member deleted successfully', teamMember })
  } catch (error) {
    console.error('Error deleting team member:', error)
    res.status(500).json({ success: false, message: 'Error deleting team member' })
  }
})

export default router
