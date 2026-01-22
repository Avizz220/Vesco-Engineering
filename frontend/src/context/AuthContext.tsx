'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  image?: string
  isAdmin?: boolean
  github?: string
  linkedin?: string
  position?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signInWithGoogle: (response: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage if exists
    const savedUser = localStorage.getItem('vescoUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('vescoUser')
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Check if admin credentials
      const isAdminEmail = email.startsWith('vescoenjos') && email.endsWith('@gmail.com')
      const isAdminPassword = password === 'engineeringvesco-2026'
      const isAdmin = isAdminEmail && isAdminPassword

      // Create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin,
      }

      console.log('Sign In - Created User:', mockUser)
      console.log('Sign In - isAdmin:', isAdmin)
      console.log('Sign In - Email Check:', { isAdminEmail, isAdminPassword })

      setUser(mockUser)
      localStorage.setItem('vescoUser', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock authentication - simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Create mock user (sign up users are always normal users, not admins)
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin: false,
      }

      setUser(mockUser)
      localStorage.setItem('vescoUser', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async (response: any) => {
    setIsLoading(true)
    try {
      // Mock Google authentication
      await new Promise(resolve => setTimeout(resolve, 800))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: 'user@google.com',
        name: 'Google User',
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=googleuser`,
        isAdmin: false,
      }

      setUser(mockUser)
      localStorage.setItem('vescoUser', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Google sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('vescoUser')
    router.push('/')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('vescoUser', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
