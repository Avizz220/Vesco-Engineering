'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import SignInModal from '@/components/auth/SignInModal'
import roboticImg from '@/assets/robotic.jpg'
import eieImg from '@/assets/eie.jpg'
import arduinoImg from '@/assets/arduino.jpg'
import aerospaceImg from '@/assets/aerospace.jpg'

const Hero = () => {
  const { isAuthenticated } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)

  const handleProtectedNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      setShowSignInModal(true)
    }
    // If authenticated, let the Link component handle navigation
  }
  return (
    <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white pt-32 pb-20 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Animated Floating Images - More Prominent */}
      {/* Robotics Image - Top Right */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-20 right-8 w-80 h-80 hidden lg:block"
      >
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-500/30">
            <Image
              src={roboticImg}
              alt="Robotics Project"
              fill
              className="object-cover"
              sizes="320px"
              priority
              quality={95}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* EIE Image - Bottom Left */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.5 }}
        className="absolute bottom-20 left-8 w-72 h-72 hidden lg:block"
      >
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 1
          }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500/30">
            <Image
              src={eieImg}
              alt="Engineering Innovation"
              fill
              className="object-cover"
              sizes="288px"
              priority
              quality={95}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Arduino Image - Center Right */}
      <motion.div
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0.45 }}
        className="absolute top-1/3 right-1/4 w-64 h-64 hidden xl:block"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 0.5
          }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full shadow-2xl overflow-hidden border-2 border-orange-400/30">
            <Image
              src={arduinoImg}
              alt="Arduino Projects"
              fill
              className="object-cover"
              sizes="256px"
              priority
              quality={95}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Aerospace Image - Top Left */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 0.4 }}
        className="absolute top-1/2 left-1/4 w-56 h-56 hidden xl:block"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: 'easeInOut',
            delay: 1.5
          }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400/30">
            <Image
              src={aerospaceImg}
              alt="Aerospace Projects"
              fill
              className="object-cover"
              sizes="224px"
              priority
              loading="eager"
              quality={90}
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading with Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Welcome to Team VESCO
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-orange-200"
          >
            Visionary Engineers Shaping Creative Opportunities
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto"
          >
            We are a passionate team of innovators from our university, dedicated to solving real-world
            problems through cutting-edge technology, robotics, AI, and creative engineering solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/projects"
              onClick={(e) => handleProtectedNavigation(e, '/projects')}
              className="group bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
            >
              View Our Projects
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/team"
              onClick={(e) => handleProtectedNavigation(e, '/team')}
              className="bg-transparent border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Meet the Team
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </section>
  )
}

export default Hero
