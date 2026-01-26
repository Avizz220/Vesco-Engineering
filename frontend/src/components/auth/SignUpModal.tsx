'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignIn: () => void
}

declare global {
  interface Window {
    google: any
  }
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': any
    }
  }
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signUp, signInWithGoogle } = useAuth()

  const handleGoogleResponse = React.useCallback(async (response: any) => {
    console.log('🔵 Google Response received (Sign Up):', response)
    try {
      setIsLoading(true)
      await signInWithGoogle(response.credential)
      setShowSuccessDialog(true)
    } catch (err: any) {
      console.error('❌ Google sign up error:', err)
      setErrorMessage(err.message || 'Google sign up failed')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }, [signInWithGoogle])

  const handleGoogleSignUp = React.useCallback(() => {
    console.log('🔵 Google Sign-Up button clicked')
    console.log('🔵 Window.google exists:', !!window.google)
    console.log('🔵 Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    
    if (window.google?.accounts?.id) {
      console.log('✅ Rendering Google Sign-In button for Sign Up')
      const buttonContainer = document.getElementById('googleSignUpButton')
      if (buttonContainer) {
        window.google.accounts.id.renderButton(
          buttonContainer,
          { 
            theme: 'outline', 
            size: 'large',
            width: buttonContainer.offsetWidth,
            text: 'signup_with',
            shape: 'rectangular'
          }
        )
      }
    } else {
      console.error('❌ Google Sign-In not loaded yet')
      setErrorMessage('Google Sign-In is loading, please try again in a moment')
      setShowErrorDialog(true)
    }
  }, [])

  // Initialize Google Sign-In
  React.useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })
        console.log('✅ Google Sign-In initialized for Sign Up')
        
        // Render the button automatically when initialized
        const buttonContainer = document.getElementById('googleSignUpButton')
        if (buttonContainer) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            { 
              theme: 'outline', 
              size: 'large',
              width: buttonContainer.offsetWidth || 400,
              text: 'signup_with',
              shape: 'rectangular'
            }
          )
          console.log('✅ Google Sign-Up button rendered')
        }
      }
    }

    // Load Google script if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('✅ Google Sign-In script loaded')
        initializeGoogleSignIn()
      }
      script.onerror = () => {
        console.error('❌ Failed to load Google Sign-In script')
      }
      document.body.appendChild(script)
    } else {
      initializeGoogleSignIn()
    }
  }, [isOpen, handleGoogleResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setShowErrorDialog(true)
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      setShowErrorDialog(true)
      return
    }

    setIsLoading(true)

    try {
      await signUp(name, email, password)
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setShowSuccessDialog(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign up failed')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    onClose()
    onSwitchToSignIn()
  }

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 relative max-h-[90vh] overflow-y-auto"
        style={{ scrollbarColor: '#ffffff #ffffff' }}
      >
        <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" strategy="afterInteractive" />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join VESCO today</p>
        </div>

        {/* Engineering Animation */}
        <div className="flex justify-center mb-4">
          <lottie-player
            src="/Engineering.json"
            background="transparent"
            speed="1"
            style={{ width: '180px', height: '180px' }}
            loop
            autoplay
          ></lottie-player>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-gray-900"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-gray-900"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-gray-900 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18m-3.3-3.3A9.77 9.77 0 0112 18c-4.418 0-8.167-2.943-9.545-7a9.77 9.77 0 012.584-4.01M9.88 9.88a3 3 0 004.24 4.24" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.477 5.136A9.764 9.764 0 0112 5c4.418 0 8.167 2.943 9.545 7a9.77 9.77 0 01-1.249 2.592" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-gray-900 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18m-3.3-3.3A9.77 9.77 0 0112 18c-4.418 0-8.167-2.943-9.545-7a9.77 9.77 0 012.584-4.01M9.88 9.88a3 3 0 004.24 4.24" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.477 5.136A9.764 9.764 0 0112 5c4.418 0 8.167 2.943 9.545 7a9.77 9.77 0 01-1.249 2.592" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">Or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up Button Container */}
        <div id="googleSignUpButton" className="w-full flex justify-center"></div>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              onClose()
              setTimeout(() => onSwitchToSignIn(), 100)
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>

      {/* Success Dialog */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        type="success"
        title="Thank You!"
        message="Your account has been successfully created. Please sign in to continue."
      />

      {/* Error Dialog */}
      <Dialog
        isOpen={showErrorDialog}
        onClose={handleErrorDialogClose}
        type="error"
        title="Sign Up Failed"
        message={errorMessage}
      />
    </div>
  )
}

export default SignUpModal
