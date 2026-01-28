import multer from 'multer'
import path from 'path'
import { Request } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { AppError } from './errorHandler'

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Configure storage
const getStorage = () => {
  // Use Cloudinary for production or if credentials exist
  if (process.env.NODE_ENV === 'production' || process.env.CLOUDINARY_CLOUD_NAME) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'vesco-engineering',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        public_id: (req: any, file: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          return file.fieldname + '-' + uniqueSuffix
        },
        // Ensure transformation returns the URL properly
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      } as any,
    })
  }

  // Fallback to local disk storage
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.UPLOAD_DIR || './uploads')
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },
  })
}

const storage = getStorage()

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new AppError('Only image files are allowed', 400))
  }
}

// Upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
})
