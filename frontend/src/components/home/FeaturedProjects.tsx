'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const FeaturedProjects = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const projects = [
    {
      title: 'Autonomous Navigation Robot',
      description: 'AI-powered robot with computer vision for obstacle detection and path planning.',
      category: 'Robotics',
      image: '/images/robot.jpg',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'IoT Smart Home System',
      description: 'Complete home automation with mobile app control and voice integration.',
      category: 'IoT',
      image: '/images/iot.jpg',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'AI Healthcare Assistant',
      description: 'Machine learning model for disease prediction and health monitoring.',
      category: 'AI/ML',
      image: '/images/ai.jpg',
      color: 'from-green-600 to-teal-600',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [projects.length])

  return (
    <section className="py-20 bg-gray-100 text-gray-900 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Featured Projects</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
        </motion.div>

        {/* Slider */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-r ${projects[currentSlide].color} rounded-2xl p-8 md:p-12 flex items-center shadow-2xl`}
            >
              <div className="max-w-2xl text-white">
                <div className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 font-semibold">
                  {projects[currentSlide].category}
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-4">
                  {projects[currentSlide].title}
                </h3>
                <p className="text-lg md:text-xl mb-8 text-white/95">
                  {projects[currentSlide].description}
                </p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  Learn More
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects
