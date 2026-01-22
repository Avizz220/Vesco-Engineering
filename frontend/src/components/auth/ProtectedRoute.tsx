'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import SignInModal from '@/components/auth/SignInModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [hasLocalAuth, setHasLocalAuth] = useState(true) // Default to true to show content

  // Check localStorage synchronously
  useEffect(() => {
    const savedUser = localStorage.getItem('vescoUser')
    const isUserAuthenticated = !!savedUser || isAuthenticated
    setHasLocalAuth(isUserAuthenticated)
    
    // Only show modal if not authenticated
    if (!isUserAuthenticated) {
      setShowSignInModal(true)
    } else {
      setShowSignInModal(false)
    }
  }, [isAuthenticated])

  // If has local auth or is authenticated, show children immediately
  if (hasLocalAuth) {
    return <>{children}</>
  }

  // Not authenticated - show modal only
  return (
    <SignInModal
      isOpen={showSignInModal}
      onClose={() => {}}
      onSwitchToSignUp={() => {}}
    />
  )
}

export default ProtectedRoute
