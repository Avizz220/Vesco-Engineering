'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types'
import { useState } from 'react'

interface ProjectCardProps {
  project: Project
  index: number
  onViewDetails: (project: Project) => void
  onEdit?: (project: Project, index: number) => void
  onDelete?: (index: number) => void
  showAdminControls?: boolean
  adminUsers?: Array<{ id: string; fullName: string; email: string }>
}

const ProjectCard = ({ project, index, onViewDetails, onEdit, onDelete, showAdminControls, adminUsers = [] }: ProjectCardProps) => {
  const MAX_DESCRIPTION_LENGTH = 150
  const [imageError, setImageError] = useState(false)
  const [showUnavailableDialog, setShowUnavailableDialog] = useState(false)
  const [unavailableMessage, setUnavailableMessage] = useState('')

  const handleLinkClick = (e: React.MouseEvent, url: string | undefined, linkType: string) => {
    e.preventDefault()
    if (!url || url.trim() === '') {
      setUnavailableMessage(`${linkType} is still not available for this project.`)
      setShowUnavailableDialog(true)
    } else {
      window.open(url, '_blank')
    }
  }

  const getContributorNames = (contributors: string[]) => {
    if (contributors[0] === 'all') {
      // Return all admin names when "all" is selected
      return adminUsers.map(admin => admin.fullName)
    }
    return contributors
      .map(id => adminUsers.find(admin => admin.id === id)?.fullName || 'Unknown')
      .filter(name => name !== 'Unknown')
  }

  const contributorNames = project.contributors ? getContributorNames(project.contributors) : []
  const displayedContributors = contributorNames.slice(0, 3)
  const remainingCount = Math.max(0, contributorNames.length - 3)

  const truncateDescription = (text: string) => {
    if (text.length <= MAX_DESCRIPTION_LENGTH) return text
    return text.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
  }

  const shouldShowMore = project.description.length > MAX_DESCRIPTION_LENGTH

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
    >
      {/* Project Image/Video */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        {showAdminControls && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(project, index)
              }}
              className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-sky-50 transition-colors"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-600">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(index)
              }}
              className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        )}
        {project.videoUrl ? (
          <video
            src={project.videoUrl}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        ) : project.imageUrl && !imageError ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            unoptimized={project.imageUrl.includes('/uploads/')}
          />
        ) : project.imageUrl && imageError ? (
          // Fallback to regular img tag if Next.js Image fails
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // If even the regular img fails, hide it
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Category Badges - Display all categories/technologies */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {project.category}
          </span>
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateDescription(project.description)}
        </p>
        {shouldShowMore && (
          <button
            onClick={() => onViewDetails(project)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
          >
            Read more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Contributors */}
        {project.contributors && project.contributors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2 font-medium">Contributors:</p>
            <div className="flex flex-wrap gap-2">
              {displayedContributors.map((name, idx) => (
                <span
                  key={idx}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {name}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  +{remainingCount} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(project)}
            className="bg-transparent border-2 border-blue-600 text-blue-600 text-center py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-xs"
          >
            View More
          </button>
          <button
            onClick={(e) => handleLinkClick(e, project.githubUrl, 'GitHub link')}
            className="bg-transparent border-2 border-gray-800 text-gray-800 text-center py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-xs flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </button>
          <button
            onClick={(e) => handleLinkClick(e, project.linkedInUrl, 'LinkedIn link')}
            className="bg-transparent border-2 border-blue-700 text-blue-700 text-center py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-xs flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          <button
            onClick={(e) => handleLinkClick(e, project.liveUrl, 'YouTube link')}
            className="bg-transparent border-2 border-red-600 text-red-600 text-center py-2 rounded-lg font-medium hover:bg-red-50 transition-colors text-xs flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </button>
        </div>
      </div>

      {/* Unavailable Dialog */}
      {showUnavailableDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUnavailableDialog(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Not Available</h3>
              <p className="text-gray-600 mb-6">{unavailableMessage}</p>
              <button
                onClick={() => setShowUnavailableDialog(false)}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ProjectCard
