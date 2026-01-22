'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import SignInModal from '@/components/auth/SignInModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowSignInModal(true)
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => {}}
          onSwitchToSignUp={() => {}}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Please sign in to continue</p>
          </div>
        </div>
      </>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
