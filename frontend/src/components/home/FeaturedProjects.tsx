'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { API_URL, IMAGE_URL_PREFIX } from '@/lib/api'

interface Project {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  featured: boolean
}

const FeaturedProjects = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Define gradient colors for featured projects
  const gradients = [
    'from-blue-600 to-cyan-600',
    'from-purple-600 to-pink-600',
    'from-green-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-purple-600',
  ]

  // Fetch featured projects from backend
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        console.log('🔍 Fetching projects from:', `${API_URL}/projects`)
        const response = await fetch(`${API_URL}/projects`)
        const data = await response.json()

        console.log('📊 API Response:', data)

        if (data.success) {
          // Transform projects to handle image URLs properly
          const transformedProjects = data.projects.map((p: any) => {
            let imageUrl = null
            if (p.imageUrl) {
              // If it's a full URL (Cloudinary), use as-is
              if (p.imageUrl.startsWith('http')) {
                imageUrl = p.imageUrl
              } else {
                // Relative path, prepend backend URL
                imageUrl = IMAGE_URL_PREFIX ? `${IMAGE_URL_PREFIX}${p.imageUrl}` : p.imageUrl
              }
            }
            
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              category: p.category,
              imageUrl,
              featured: p.featured
            }
          })
          
          console.log('🎨 Transformed projects:', transformedProjects)
          
          // Show ALL projects (not filtered by image) - display up to 10
          const projectsToDisplay = transformedProjects.slice(0, 10)
          
          console.log('✅ Projects to display:', projectsToDisplay.length)
          setProjects(projectsToDisplay)
        }
      } catch (error) {
        console.error('❌ Error fetching featured projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  // Show loading state or render empty div during loading
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </section>
    )
  }

  // Don't render if no projects
  if (projects.length === 0) {
    console.log('⚠️ No projects to display in FeaturedProjects')
    return null
  }

  // Auto-advance slides
  useEffect(() => {
    if (projects.length === 0) return
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
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Background Image with Overlay */}
              {projects[currentSlide].imageUrl && (
                <div className="absolute inset-0">
                  <img
                    src={projects[currentSlide].imageUrl}
                    alt={projects[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradients[currentSlide % gradients.length]} opacity-90`}></div>
                </div>
              )}
              {/* Fallback gradient if no image */}
              {!projects[currentSlide].imageUrl && (
                <div className={`absolute inset-0 bg-gradient-to-r ${gradients[currentSlide % gradients.length]}`}></div>
              )}
              
              {/* Content */}
              <div className="relative h-full flex items-center p-8 md:p-12">
                <div className="max-w-2xl text-white">
                  <div className="inline-block bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4 font-semibold">
                    {projects[currentSlide].category}
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold mb-4">
                    {projects[currentSlide].title}
                  </h3>
                  <p className="text-lg md:text-xl mb-8 text-white/95 line-clamp-3">
                    {projects[currentSlide].description}
                  </p>
                  <button 
                    onClick={() => window.location.href = '/projects'}
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    View Projects
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % projects.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

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
