'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import STATIC_PROJECTS from '@/data/projects'

interface Project {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  featured: boolean
}

const FeaturedProjects = () => {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [projects, setProjects] = useState<Project[]>(
    STATIC_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl || null,
      featured: true,
    }))
  )
  const [isLoading, setIsLoading] = useState(false)
  
  const MAX_DESCRIPTION_WORDS = 50

  // Define gradient colors for featured projects
  const gradients = [
    'from-blue-600 to-cyan-600',
    'from-purple-600 to-pink-600',
    'from-green-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-purple-600',
  ]
  
  const truncateDescriptionByWords = (text: string, maxWords: number) => {
    const words = text.split(' ')
    if (words.length <= maxWords) return { text, isTruncated: false }
    return { 
      text: words.slice(0, maxWords).join(' ') + '...', 
      isTruncated: true 
    }
  }
  
  const handleSeeMore = (projectId: string) => {
    // Store project ID in sessionStorage so projects page can open the modal
    sessionStorage.setItem('openProjectId', projectId)
    router.push('/projects')
  }



  // Show loading state or render empty div during loading
  if (isLoading) {
    return null
  }

  // Don't render if no real projects available
  if (projects.length === 0) {
    console.log('⚠️ No real user-added projects to display in FeaturedProjects')
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
                  <h3 className="text-3xl md:text-5xl font-bold mb-4 line-clamp-2">
                    {projects[currentSlide].title}
                  </h3>
                  <p className="text-base md:text-lg mb-6 text-white/95">
                    {truncateDescriptionByWords(projects[currentSlide].description, MAX_DESCRIPTION_WORDS).text}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {truncateDescriptionByWords(projects[currentSlide].description, MAX_DESCRIPTION_WORDS).isTruncated && (
                      <button 
                        onClick={() => handleSeeMore(projects[currentSlide].id)}
                        className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm md:text-base"
                      >
                        View More
                      </button>
                    )}
                    <button 
                      onClick={() => router.push('/projects')}
                      className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/30 transition-colors text-sm md:text-base"
                    >
                      View All Projects
                    </button>
                  </div>
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
