'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { API_URL } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  image?: string
  isAdmin?: boolean
  github?: string
  linkedin?: string
  position?: string
  isGoogleUser?: boolean
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
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with null to ensure server and initial client render match (avoid hydration mismatch)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mark as mounted
    setIsMounted(true)
    
    // Load user from localStorage after hydration to avoid SSR/client mismatch
    try {
      const savedUser = localStorage.getItem('vescoUser')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch {
      localStorage.removeItem('vescoUser')
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call real backend API
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Create user object from backend response
      const authenticatedUser: User = {
        id: data.id || data.user?.id,
        email: data.email || data.user?.email,
        name: data.fullName || data.user?.fullName || data.name || data.user?.name,
        image: data.image || data.user?.image,
        isAdmin: data.role === 'ADMIN' || data.user?.role === 'ADMIN',
        isGoogleUser: false,
      }

      console.log('✅ Sign In Success - User:', authenticatedUser)

      setUser(authenticatedUser)
      localStorage.setItem('vescoUser', JSON.stringify(authenticatedUser))
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call real backend API
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fullName: name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      console.log('✅ Sign Up Success - User registered:', data.user.email)
      
      // DO NOT auto-login after signup - user must sign in separately
      // Registration successful, but user is not logged in yet
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async (credential: string) => {
    setIsLoading(true)
    try {
      // Call real backend API for Google authentication
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      })

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON Response from Backend:', text);
        try {
           // Attempt to parse text in case header was wrong
           data = JSON.parse(text);
        } catch (e) {
           throw new Error(`Server returned ${response.status} ${response.statusText} (non-JSON). See console.`);
        }
      }

      if (!response.ok) {
        console.error('❌ Google Sign-In Error Response:', data)
        throw new Error(data.message || 'Google sign in failed - check console for details')
      }

      // Create user object from backend response
      const authenticatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image,
        isAdmin: data.user.role === 'ADMIN',
        isGoogleUser: true,
      }

      console.log('✅ Google Sign In Success - User:', authenticatedUser)

      setUser(authenticatedUser)
      localStorage.setItem('vescoUser', JSON.stringify(authenticatedUser))
    } catch (error: any) {
      throw new Error(error.message || 'Google sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear cookie
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
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

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated')
    
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Password change failed')
    }

    return data
  }

  const refreshUserProfile = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const data = await response.json()
      
      const updatedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        image: data.user.image,
        isAdmin: data.user.role === 'ADMIN',
        isGoogleUser: user.isGoogleUser,
      }

      setUser(updatedUser)
      localStorage.setItem('vescoUser', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Error refreshing user profile:', error)
    }
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
        changePassword,
        refreshUserProfile,
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
