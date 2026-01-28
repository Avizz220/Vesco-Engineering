import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import achievementRoutes from './routes/achievementRoutes'
import teamRoutes from './routes/teamRoutes'
import courseRoutes from './routes/courseRoutes'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000

// Trust proxy (Required for Vercel/AWS Caddy)
app.set('trust proxy', 1)

// Security middleware with relaxed CSP for images
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "http://localhost:5000", "https://*.vercel.app", "https://*.vesco.lk", "https://*.googleusercontent.com", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5000", "https://accounts.google.com", "https://*.vercel.app", "https://*.vesco.lk"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}))

// Allowed origins list
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://vesco-engineering.vercel.app',
  'https://www.vesco.lk',
  'https://vesco.lk',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [])
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      console.log('❌ Blocked by CORS:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Cookie parser middleware
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Static files (for uploaded images)
app.use('/uploads', express.static('uploads'))

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/courses', courseRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  })
})

// Global error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 API: http://localhost:${PORT}/api`)
})

export default app
