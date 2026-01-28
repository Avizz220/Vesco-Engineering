import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { upload } from '../middleware/upload'

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

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    res.json({
      success: true,
      count: projects.length,
      projects
    })
  } catch (error: any) {
    console.error('❌ Get projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    })
  }
})

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.json({
      success: true,
      project
    })
  } catch (error: any) {
    console.error('❌ Get project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    })
  }
})

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post(
  '/',
  verifyAdmin,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  async (req: Request, res: Response) => {
    console.log('🔵 CREATE PROJECT REQUEST:', { body: req.body, file: req.file })
    
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
        technologies,
        githubUrl,
        liveUrl,
        category,
        featured,
        contributors
      } = req.body

      // Parse technologies if it's a string (from FormData)
      let parsedTechnologies = technologies
      if (typeof technologies === 'string') {
        try {
          parsedTechnologies = JSON.parse(technologies)
        } catch (e) {
          parsedTechnologies = []
        }
      }

      // Parse contributors if it's a string (from FormData)
      let parsedContributors = contributors
      if (typeof contributors === 'string') {
        try {
          parsedContributors = JSON.parse(contributors)
        } catch (e) {
          parsedContributors = []
        }
      }

      // Get the image URL from uploaded file
      // Cloudinary returns full URL in 'path', local storage uses 'filename'
      let imageUrl = null
      if (req.file) {
        imageUrl = (req.file as any).path || `/uploads/${req.file.filename}`
        console.log('📸 Image upload details:', {
          hasPath: !!(req.file as any).path,
          hasFilename: !!req.file.filename,
          finalUrl: imageUrl
        })
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          technologies: parsedTechnologies,
          imageUrl,
          githubUrl: githubUrl || null,
          liveUrl: liveUrl || null,
          category,
          featured: featured === 'true' || featured === true || false,
          contributors: parsedContributors || []
        }
      })

      console.log('✅ PROJECT CREATED:', project.id)

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project
      })
    } catch (error: any) {
      console.error('❌ Create project error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error.message
      })
    }
  }
)

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      category,
      featured,
      contributors
    } = req.body

    // Parse technologies if it's a string (from FormData)
    let parsedTechnologies = technologies
    if (typeof technologies === 'string') {
      try {
        parsedTechnologies = JSON.parse(technologies)
      } catch (e) {
        parsedTechnologies = undefined
      }
    }

    // Parse contributors if it's a string (from FormData)
    let parsedContributors = contributors
    if (typeof contributors === 'string') {
      try {
        parsedContributors = JSON.parse(contributors)
      } catch (e) {
        parsedContributors = undefined
      }
    }

    // Get the image URL from uploaded file (if provided)
    // Cloudinary returns full URL in 'path', local storage uses 'filename'
    let imageUrl = undefined
    if (req.file) {
      imageUrl = (req.file as any).path || `/uploads/${req.file.filename}`
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(parsedTechnologies && { technologies: parsedTechnologies }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(category && { category }),
        ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
        ...(parsedContributors && { contributors: parsedContributors })
      }
    })

    console.log('✅ PROJECT UPDATED:', project.id)

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    })
  } catch (error: any) {
    console.error('❌ Update project error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    })
  }
})

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }

    await prisma.project.delete({
      where: { id }
    })

    console.log('✅ PROJECT DELETED:', id)

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error: any) {
    console.error('❌ Delete project error:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    })
  }
})

export default router
