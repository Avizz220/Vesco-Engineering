'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import SuccessModal from '@/components/ui/SuccessModal'
import ErrorModal from '@/components/ui/ErrorModal'

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function ContactPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    rating: 0,
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [mailAnimation, setMailAnimation] = useState<any>(null)
  const [phoneAnimation, setPhoneAnimation] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  // Check for success/error parameters in URL
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success === 'true') {
      setShowSuccess(true)
    } else if (error === 'true') {
      setShowError(true)
    }
  }, [searchParams])

  // Load Lottie animations
  useEffect(() => {
    fetch('/mail.json')
      .then(res => res.json())
      .then(data => setMailAnimation(data))
      .catch(err => console.error('Error loading mail animation:', err))
    
    fetch('/Phone icon animation.json')
      .then(res => res.json())
      .then(data => setPhoneAnimation(data))
      .catch(err => console.error('Error loading phone animation:', err))
  }, [])

  const handleCloseModal = () => {
    setShowSuccess(false)
    setShowError(false)
    // Clean URL by removing query parameters
    window.history.replaceState({}, '', '/contact')
  }

  const headquarters = [
    {
      region: 'VES Engineering Team',
      address: 'Faculty of Engineering, University of Ruhuna',
      city: 'Galle',
      postalCode: '80000',
      phone: '071-1103585'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Engineering Background */}
      <div className="relative bg-blue-600 text-white py-20 sm:py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(/Engineering.json)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-12 sm:pt-16 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg">Get in touch</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white opacity-90 mb-6 sm:mb-8 drop-shadow-md">
              We're Vincere Engineering Services, ready to lead you into the future of engineering excellence.
            </p>
            
            {/* Logged-in User Display */}
            
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-12 md:py-16 -mt-8 sm:-mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Contact Form - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                {mailAnimation && (
                  <div className="w-12 h-12 sm:w-16 sm:h-16">
                    <Lottie animationData={mailAnimation} loop={true} />
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Form</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">We'd love to hear from you.</p>

              <form action="https://formsubmit.co/ahirushan629@gmail.com" method="POST" className="space-y-6">
                {/* Hidden inputs for FormSubmit configuration */}
                <input type="hidden" name="_subject" value="New Contact Form Submission from VESCO Website" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value={`${typeof window !== 'undefined' ? window.location.origin : ''}/contact?success=true`} />
                <input type="hidden" name="_error" value={`${typeof window !== 'undefined' ? window.location.origin : ''}/contact?error=true`} />
                                <input type="hidden" name="_cc" value="contact@vesco.lk" />
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rating*
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer transition-transform hover:scale-110">
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          required
                          className="sr-only"
                          onChange={() => setFormData({ ...formData, rating: star })}
                        />
                        <svg
                          className={`w-10 h-10 ${
                            star <= formData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </label>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.rating === 5 && 'Excellent!'}
                      {formData.rating === 4 && 'Great!'}
                      {formData.rating === 3 && 'Good'}
                      {formData.rating === 2 && 'Fair'}
                      {formData.rating === 1 && 'Needs Improvement'}
                    </p>
                  )}
                </div>

                {/* Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions*
                  </label>
                  <textarea
                    name="questions"
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900"
                    placeholder="Any questions you have for us..."
                  />
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="feedback"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900"
                    placeholder="Share your feedback with us..."
                  />
                </div>

                {/* University/Industry/Job (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University/Industry/Job <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="affiliation"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="e.g.,Software Engineer"
                  />
                </div>

                {/* Field (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="field"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="e.g., Computer Science, Electrical Engineering"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Contact Form
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Headquarters */}
            {headquarters.map((hq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  {phoneAnimation && (
                    <div className="w-14 h-14 flex-shrink-0">
                      <Lottie animationData={phoneAnimation} loop={true} />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{hq.region}</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>{hq.address}</p>
                  <p>{hq.city}</p>
                  <p className="font-medium">{hq.postalCode}</p>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${hq.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        {hq.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Get Support</h3>
              <p className="text-sm text-gray-600 mb-6">
                Need help with VESCO Engineering products or services?
              </p>
              
              <div className="space-y-4">
                <motion.a
                  whileHover={{ scale: 1.05, x: 5 }}
                  href="mailto:support@vesco.com"
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email us</p>
                    <p className="text-gray-900">contact@vesco.lk</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05, x: 5 }}
                  href="tel:0711103585"
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Call us</p>
                    <p className="text-gray-900">071-1103585</p>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://www.linkedin.com/company/vincere-engineering-services-ves"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://web.facebook.com/profile.php?id=61576463671476"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="https://www.youtube.com/@vescoengineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.2 0 12 0 12s0 3.8.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.8 24 12 24 12s0-3.8-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseModal}
        title="Form Submitted Successfully!"
        message="Thank you for contacting us. We've received your message and will get back to you shortly via email."
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showError}
        onClose={handleCloseModal}
        title="Submission Failed"
        message="There was an error submitting your form. Please try again or contact us directly via email."
      />
    </div>
  )
}

