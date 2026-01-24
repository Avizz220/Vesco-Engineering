import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { upload } from '../middleware/upload';

const router = express.Router();
const prisma = new PrismaClient();

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

// GET all courses (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

// POST new course (admin only)
router.post(
  '/',
  verifyAdmin,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('instructor').trim().notEmpty().withMessage('Instructor is required'),
    body('duration').trim().notEmpty().withMessage('Duration is required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
    body('price').trim().notEmpty().withMessage('Price is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, category, instructor, duration, level, price, learningOutcomes } = req.body;
      
      // Parse learningOutcomes if it's a string
      let outcomesArray = [];
      if (learningOutcomes) {
        try {
          outcomesArray = typeof learningOutcomes === 'string' 
            ? JSON.parse(learningOutcomes) 
            : learningOutcomes;
        } catch (e) {
          outcomesArray = [];
        }
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          category,
          instructor,
          duration,
          level,
          price,
          imageUrl,
          learningOutcomes: outcomesArray,
        },
      });

      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  }
);

// PUT update course (admin only)
router.put(
  '/:id',
  verifyAdmin,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('instructor').trim().notEmpty().withMessage('Instructor is required'),
    body('duration').trim().notEmpty().withMessage('Duration is required'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
    body('price').trim().notEmpty().withMessage('Price is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, description, category, instructor, duration, level, price, learningOutcomes } = req.body;

      // Parse learningOutcomes if it's a string
      let outcomesArray = [];
      if (learningOutcomes) {
        try {
          outcomesArray = typeof learningOutcomes === 'string' 
            ? JSON.parse(learningOutcomes) 
            : learningOutcomes;
        } catch (e) {
          outcomesArray = [];
        }
      }

      const updateData: any = {
        title,
        description,
        category,
        instructor,
        duration,
        level,
        price,
        learningOutcomes: outcomesArray,
      };

      // Only update imageUrl if a new file is uploaded
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const course = await prisma.course.update({
        where: { id },
        data: updateData,
      });

      res.json(course);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Failed to update course' });
    }
  }
);

// DELETE course (admin only)
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({
      where: { id },
    });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});

export default router;
