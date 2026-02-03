import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { upload, getImageUrl } from '../middleware/upload'

const router = Router()
const prisma = new PrismaClient()

// Middleware to verify admin JWT from cookie
const verifyAdmin = (req: Request, res: Response, next: Function) => {
  const token = req.cookies?.token
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
    
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Admin access required' })
    }
    
    ;(req as any).user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { date: 'desc' }
    })

    res.json({
      success: true,
      count: achievements.length,
      achievements
    })
  } catch (error: any) {
    console.error('❌ Get achievements error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    })
  }
})

// @route   GET /api/achievements/:id
// @desc    Get achievement by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    
    const achievement = await prisma.achievement.findUnique({
      where: { id }
    })

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }

    res.json({
      success: true,
      achievement
    })
  } catch (error: any) {
    console.error('❌ Get achievement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement',
      error: error.message
    })
  }
})

// @route   POST /api/achievements
// @desc    Create new achievement
// @access  Private (Admin only)
router.post(
  '/',
  verifyAdmin,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('categories').notEmpty().withMessage('Categories are required'),
    body('participants').notEmpty().withMessage('Participants are required'),
    body('competition').trim().notEmpty().withMessage('Competition is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
  ],
  async (req: Request, res: Response) => {
    console.log('🔵 CREATE ACHIEVEMENT REQUEST:', { body: req.body, file: req.file })
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      })
    }

    try {
      const {
        title,
        description,
        categories,
        participants,
        competition,
        date,
        linkedinUrl
      } = req.body

      // Parse JSON strings
      const categoriesArray = typeof categories === 'string' ? JSON.parse(categories) : categories
      const participantsArray = typeof participants === 'string' ? JSON.parse(participants) : participants

      // Handle Cloudinary URL or local path
      const imageUrl = getImageUrl(req.file)

      const achievement = await prisma.achievement.create({
        data: {
          title,
          description,
          categories: categoriesArray,
          participants: participantsArray,
          competition,
          date: new Date(date),
          imageUrl,
          linkedinUrl: linkedinUrl || null
        }
      })

      console.log('✅ ACHIEVEMENT CREATED:', achievement.id)

      res.status(201).json({
        success: true,
        message: 'Achievement created successfully',
        achievement
      })
    } catch (error: any) {
      console.error('❌ Create achievement error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create achievement',
        error: error.message
      })
    }
  }
)

// @route   PUT /api/achievements/:id
// @desc    Update achievement
// @access  Private (Admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const {
      title,
      description,
      categories,
      participants,
      competition,
      date,
      linkedinUrl
    } = req.body

    // Parse JSON strings
    const categoriesArray = categories ? (typeof categories === 'string' ? JSON.parse(categories) : categories) : undefined
    const participantsArray = participants ? (typeof participants === 'string' ? JSON.parse(participants) : participants) : undefined

    // Handle Cloudinary URL or local path
    const imageUrl = req.file ? getImageUrl(req.file) : undefined

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(categoriesArray && { categories: categoriesArray }),
        ...(participantsArray && { participants: participantsArray }),
        ...(competition && { competition }),
        ...(date && { date: new Date(date) }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(imageUrl !== undefined && { imageUrl })
      }
    })

    console.log('✅ ACHIEVEMENT UPDATED:', achievement.id)

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      achievement
    })
  } catch (error: any) {
    console.error('❌ Update achievement error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update achievement',
      error: error.message
    })
  }
})

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement
// @access  Private (Admin only)
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }

    await prisma.achievement.delete({
      where: { id }
    })

    console.log('✅ ACHIEVEMENT DELETED:', id)

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    })
  } catch (error: any) {
    console.error('❌ Delete achievement error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
      error: error.message
    })
  }
})

export default router
