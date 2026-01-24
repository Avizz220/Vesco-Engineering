'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SuccessModal from '@/components/ui/SuccessModal'
import ErrorModal from '@/components/ui/ErrorModal'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Full name is required')
      setShowErrorModal(true)
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      setShowErrorModal(true)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match')
      setShowErrorModal(true)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.message || 'Sign up failed. Please try again.')
        setShowErrorModal(true)
        return
      }

      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      // Show success modal
      setShowSuccessModal(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign up failed. Please check your connection and try again.')
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    // Navigate to sign in page
    router.push('/auth/signin')
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-24 pb-12">
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Thank You!"
        message="Your details have been successfully submitted. Thanks!"
      />

      <ErrorModal 
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title="Sign Up Failed"
        message={errorMessage}
      />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block order-2">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Join Our Team</h1>
                <p className="text-xl text-gray-600">Create an account to collaborate with VESCO's innovative engineering team and unlock exclusive features</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Easy Registration</h3>
                    <p className="text-gray-600">Simple signup process in just a few steps</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Privacy First</h3>
                    <p className="text-gray-600">Your information is kept confidential and secure</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                    <p className="text-gray-600">Connect with talented engineers worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="w-full max-w-md mx-auto order-1 lg:order-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-6">
                  <span className="text-3xl font-bold text-primary-600">VESCO</span>
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-2">Start your engineering journey with us</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start mt-5">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-purple-600 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                      Terms & Conditions
                    </Link>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">Or sign up with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-3 hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>

              {/* Sign In Link */}
              <p className="text-center text-gray-600 mt-8">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
