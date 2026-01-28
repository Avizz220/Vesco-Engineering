import multer from 'multer'
import path from 'path'
import { Request } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { AppError } from './errorHandler'

const CLOUDINARY_FOLDER = 'vesco-engineering'

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
        folder: CLOUDINARY_FOLDER,
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

const isCloudinaryConfigured = (): boolean => {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME)
}

const buildCloudinaryPublicId = (file: any): string | null => {
  const candidate =
    (typeof file?.public_id === 'string' && file.public_id) ||
    (typeof file?.filename === 'string' && file.filename) ||
    (typeof file?.key === 'string' && file.key) ||
    null

  if (!candidate) return null
  if (candidate.startsWith('http://') || candidate.startsWith('https://')) return null

  // If already has a folder prefix, keep it as-is.
  if (candidate.includes('/')) return candidate

  return `${CLOUDINARY_FOLDER}/${candidate}`
}

// Helper to get full image URL
export const getImageUrl = (file: Express.Multer.File | undefined): string | null => {
  if (!file) return null

  // Cloudinary storage (preferred in production)
  if (isCloudinaryConfigured()) {
    const pathOrUrl = (file as any).path

    // multer-storage-cloudinary typically sets `file.path` to a full URL
    if (typeof pathOrUrl === 'string' && pathOrUrl.length > 0) {
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl
      }

      return cloudinary.url(pathOrUrl, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      })
    }

    // Fallback: construct URL from public_id / filename when `path` isn't present
    const publicId = buildCloudinaryPublicId(file)
    if (publicId) {
      return cloudinary.url(publicId, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      })
    }
  }

  // Local storage - return relative path
  const filename = String((file as any).filename || '').replace(/^[/\\]+/, '')
  return filename ? `/uploads/${filename}` : null
}

// Normalize stored DB imageUrl values (helps with legacy `/uploads/...` values that
// actually represent a Cloudinary public_id like `/uploads/vesco-engineering/image-123`)
export const normalizeImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl

  if (!isCloudinaryConfigured()) return imageUrl

  // If stored as a local-looking path but without extension, it's very likely a Cloudinary public_id.
  if (imageUrl.startsWith('/uploads/')) {
    const withoutPrefix = imageUrl.substring('/uploads/'.length).replace(/^[/\\]+/, '')

    // If it's a real local filename, it should have an extension; keep it as local.
    const lastSegment = withoutPrefix.split('/').pop() || ''
    const hasExtension = lastSegment.includes('.')
    if (hasExtension) return imageUrl

    const publicId = withoutPrefix.includes('/') ? withoutPrefix : `${CLOUDINARY_FOLDER}/${withoutPrefix}`
    return cloudinary.url(publicId, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    })
  }

  return imageUrl
}
