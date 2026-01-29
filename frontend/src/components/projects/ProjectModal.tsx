'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types'
import { useState } from 'react'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  adminUsers?: Array<{ id: string; fullName: string; email: string }>
}

const ProjectModal = ({ project, isOpen, onClose, adminUsers = [] }: ProjectModalProps) => {
  const [showUnavailableDialog, setShowUnavailableDialog] = useState(false)
  const [unavailableMessage, setUnavailableMessage] = useState('')

  if (!project) return null

  const handleLinkClick = (url: string | undefined, linkType: string) => {
    if (!url || url.trim() === '') {
      setUnavailableMessage(`${linkType} is not available for this project at the moment.`)
      setShowUnavailableDialog(true)
      return false
    }
    return true
  }

  const getContributorNames = (contributors: string[]) => {
    if (contributors[0] === 'all') {
      return adminUsers.map(admin => admin.fullName)
    }
    return contributors
      .map(id => adminUsers.find(admin => admin.id === id)?.fullName || 'Unknown')
      .filter(name => name !== 'Unknown')
  }

  const contributorNames = project.contributors ? getContributorNames(project.contributors) : []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-in Panel from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Project Image/Video */}
              <div className="relative h-80 bg-gray-200 overflow-hidden">
                {project.videoUrl ? (
                  <video
                    src={project.videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                  />
                ) : project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Title */}
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>

                {/* Contributors */}
                {contributorNames.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Contributors {project.contributors[0] === 'all' && <span className="text-sm text-gray-500 font-normal">(All Team Admins)</span>}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {contributorNames.map((name, idx) => (
                        <span
                          key={idx}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            project.contributors[0] === 'all' 
                              ? 'bg-gradient-to-r from-sky-500 to-primary-600 text-white'
                              : 'bg-primary-100 text-primary-800'
                          }`}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Created Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(project.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(project.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (handleLinkClick(project.githubUrl, 'GitHub link')) {
                        window.open(project.githubUrl, '_blank')
                      }
                    }}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (handleLinkClick(project.linkedInUrl, 'LinkedIn link')) {
                        window.open(project.linkedInUrl, '_blank')
                      }
                    }}
                    className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    View on LinkedIn
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (handleLinkClick(project.liveUrl, 'YouTube link')) {
                        window.open(project.liveUrl, '_blank')
                      }
                    }}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    View on YouTube
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal
