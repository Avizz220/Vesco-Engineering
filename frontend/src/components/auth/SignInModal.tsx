'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
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

const ResetPasswordForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSent(true)
    setLoading(false)
    setTimeout(() => onClose(), 1200)
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm text-gray-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {loading ? 'Sending...' : sent ? 'Email sent' : 'Send reset link'}
      </button>
      {sent && <p className="text-sm text-green-600 text-center">Reset link sent to your email (mock).</p>}
    </form>
  )
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email and password are not empty
    if (!email || !email.trim()) {
      setErrorMessage('Please enter your email address')
      setShowErrorDialog(true)
      return
    }

    if (!password || !password.trim()) {
      setErrorMessage('Please enter your password')
      setShowErrorDialog(true)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address')
      setShowErrorDialog(true)
      return
    }

    setIsLoading(true)

    try {
      await signIn(email, password)
      setEmail('')
      setPassword('')
      setShowSuccessDialog(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    onClose()
  }

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-10 relative">
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Welcome back to VESCO</p>
          </div>

          {/* Telecommunication Animation */}
          <div className="flex justify-center mb-6">
            <lottie-player
              src="/Telecommunications%20Engineering.json"
              background="transparent"
              speed="1"
              style={{ width: '220px', height: '220px' }}
              loop
              autoplay
            ></lottie-player>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                minLength={5}
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
                  minLength={6}
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
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose()
                setTimeout(() => onSwitchToSignUp(), 100)
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close reset password"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
            <p className="text-gray-600 mb-6">Enter your email and we'll send a reset link (mock).</p>
            <ResetPasswordForm onClose={() => setShowResetModal(false)} />
          </div>
        </div>
      )}

      {/* Error Dialog */}
      <Dialog
        isOpen={showErrorDialog}
        onClose={handleErrorDialogClose}
        type="error"
        title="Sign In Failed"
        message={errorMessage}
      />

      {/* Success Dialog */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        type="success"
        title="Welcome Back!"
        message="You have successfully signed in to your account."
      />
    </>
  )
}

export default SignInModal

