import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try to get token from Authorization header first
    let token = null
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } 
    // If no Bearer token, try to get from cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }
    
    if (!token) {
      throw new AppError('Authentication required', 401)
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new AppError('JWT secret not configured', 500)
    }

    const decoded = jwt.verify(token, secret) as {
      id: string
      email: string
      role: string
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401))
    } else {
      next(error)
    }
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    console.log('🔐 Authorization Check - User Role:', req.user.role, 'Required Roles:', roles)

    // Case-insensitive role comparison
    const userRoleLower = req.user.role.toLowerCase()
    const rolesLower = roles.map(r => r.toLowerCase())

    if (!rolesLower.includes(userRoleLower)) {
      console.log('❌ Access Denied - User role does not match required roles')
      return next(new AppError('Access denied', 403))
    }

    console.log('✅ Access Granted')
    next()
  }
}
