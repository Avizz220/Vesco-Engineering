'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'
import ImageCropper from '@/components/ui/ImageCropper'
import { API_URL, IMAGE_URL_PREFIX } from '@/lib/api'

interface Achievement {
  id: string
  title: string
  description: string
  categories: string[]
  participants: string[]
  competition: string
  date: string
  imageUrl?: string
  linkedinUrl?: string
  createdAt: string
  updatedAt: string
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [achievementsList, setAchievementsList] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'update', index?: number } | null>(null)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const MAX_DESCRIPTION_LENGTH = 100
  const [showImageCropper, setShowImageCropper] = useState(false)
  const [imageForCropping, setImageForCropping] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; fullName: string; email: string }>>([])
  const [categoryInput, setCategoryInput] = useState('')
  
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    categories: [] as string[],
    participants: [] as string[],
    competition: '',
    date: '',
    linkedinUrl: '',
    photo: null as File | null,
  })

  // Fetch achievements from backend
  useEffect(() => {
    fetchAchievements()
    fetchAdminUsers()
  }, [])

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/admins`)
      if (response.ok) {
        const admins = await response.json()
        setAdminUsers(admins)
      }
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/achievements`)
      const data = await response.json()

      if (data.success) {
        setAchievementsList(data.achievements)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
      setDialogMessage('Failed to load achievements')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setOriginalFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setImageForCropping(reader.result as string)
        setShowImageCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], originalFileName, { type: 'image/jpeg' })
    setNewAchievement(prev => ({ ...prev, photo: croppedFile }))
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleCropCancel = () => {
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleEditAchievement = (achievement: Achievement, index: number) => {
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      categories: achievement.categories || [],
      participants: achievement.participants || [],
      competition: achievement.competition,
      date: achievement.date.split('T')[0],
      linkedinUrl: achievement.linkedinUrl || '',
      photo: null,
    })
    setCategoryInput((achievement.categories || []).join(', '))
    setEditingIndex(index)
    setShowAddAchievementModal(true)
  }

  const handleDeleteAchievement = async (index: number) => {
    setConfirmAction({ type: 'delete', index })
    setShowConfirmDialog(true)
  }

  const confirmDeleteAchievement = async () => {
    if (!confirmAction || confirmAction.index === undefined) return
    
    const index = confirmAction.index
    const achievementId = achievementsList[index].id
    try {
      const response = await fetch(`${API_URL}/achievements/${achievementId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setAchievementsList(prev => prev.filter((_, i) => i !== index))
        setDialogMessage('Achievement deleted successfully!')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error deleting achievement:', error)
      setDialogMessage('Failed to delete achievement')
      setShowErrorDialog(true)
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  const handleSubmitAchievement = async (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmAction({ type: 'update' })
    setShowConfirmDialog(true)
  }

  const confirmSubmitAchievement = async () => {
    try {
      if (editingIndex !== null) {
        // Update existing achievement
        const achievementId = achievementsList[editingIndex].id
        const formData = new FormData()
        formData.append('title', newAchievement.title)
        formData.append('description', newAchievement.description)
        formData.append('categories', JSON.stringify(newAchievement.categories))
        formData.append('participants', JSON.stringify(newAchievement.participants))
        formData.append('competition', newAchievement.competition)
        formData.append('date', newAchievement.date)
        if (newAchievement.linkedinUrl) {
          formData.append('linkedinUrl', newAchievement.linkedinUrl)
        }
        if (newAchievement.photo) {
          formData.append('image', newAchievement.photo)
        }

        const response = await fetch(`${API_URL}/achievements/${achievementId}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update achievement')
        }

        setDialogMessage('Achievement updated successfully!')
        setShowSuccessDialog(true)
        setEditingIndex(null)
        await fetchAchievements()
      } else {
        // Add new achievement
        const formData = new FormData()
        formData.append('title', newAchievement.title)
        formData.append('description', newAchievement.description)
        formData.append('categories', JSON.stringify(newAchievement.categories))
        formData.append('participants', JSON.stringify(newAchievement.participants))
        formData.append('competition', newAchievement.competition)
        formData.append('date', newAchievement.date)
        if (newAchievement.linkedinUrl) {
          formData.append('linkedinUrl', newAchievement.linkedinUrl)
        }
        if (newAchievement.photo) {
          formData.append('image', newAchievement.photo)
        }

        const response = await fetch(`${API_URL}/achievements`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create achievement')
        }

        setDialogMessage('Achievement created successfully!')
        setShowSuccessDialog(true)
        await fetchAchievements()
      }
      
      setShowAddAchievementModal(false)
      setNewAchievement({
        title: '',
        description: '',
        categories: [],
        participants: [],
        competition: '',
        date: '',
        linkedinUrl: '',
        photo: null,
      })
      setCategoryInput('')
    } catch (error: any) {
      setDialogMessage(error.message || 'Failed to save achievement')
      setShowErrorDialog(true)
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(achievementsList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedAchievements = achievementsList.slice(startIndex, endIndex)

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsisThreshold = 7

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-26 md:pt-28 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex-1 hidden md:block"></div>
            <div className="flex-1 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-600/80 mb-2 sm:mb-3">Competitions & Wins</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-slate-900 whitespace-nowrap">Our Achievements</h1>
            </div>
            <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
              {user?.isAdmin && (
                <button
                  onClick={() => setShowAddAchievementModal(true)}
                  className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Achievement
                </button>
              )}
            </div>
          </div>
          <p className="text-slate-600 max-w-3xl mx-auto text-base sm:text-lg text-center px-2">
            Competitions we have entered and conquered — showcasing our cross-disciplinary engineering strength.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
          >
            {displayedAchievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {user?.isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button
                      onClick={() => handleEditAchievement(achievement, index)}
                      className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-sky-50 transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-600">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(index)}
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

                {/* Image */}
                <div className="relative w-full overflow-hidden bg-slate-100 aspect-[4/3]">
                  {achievement.imageUrl ? (
                    <Image
                      src={achievement.imageUrl.startsWith('http') ? achievement.imageUrl : `${IMAGE_URL_PREFIX}${achievement.imageUrl}`}
                      alt={achievement.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-700/80">{achievement.competition}</p>
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">{achievement.title}</h3>
                      
                      {/* Categories */}
                      {achievement.categories && achievement.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {achievement.categories.map((category, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-3 py-1 text-xs font-medium border border-sky-200"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {achievement.description.length <= MAX_DESCRIPTION_LENGTH
                      ? achievement.description
                      : `${achievement.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
                    {achievement.description.length > MAX_DESCRIPTION_LENGTH && (
                      <button
                        onClick={() => {
                          setSelectedAchievement(achievement)
                          setIsDetailsPanelOpen(true)
                        }}
                        className="ml-2 text-sky-600 hover:text-sky-700 font-semibold text-xs"
                      >
                        See More
                      </button>
                    )}
                  </p>

                  {/* Participants */}
                  {achievement.participants && achievement.participants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Participants:</p>
                      <div className="flex flex-wrap gap-2">
                        {achievement.participants.map((participantId, idx) => {
                          const participant = adminUsers.find(u => u.id === participantId)
                          return participant ? (
                            <span 
                              key={idx}
                              className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium border border-emerald-200"
                            >
                              {participant.fullName}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      {achievement.linkedinUrl && (
                        <a 
                          href={achievement.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:opacity-75 transition-opacity"
                          title="View on LinkedIn"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077B5">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* No Achievements Message */}
        {!isLoading && achievementsList.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Achievements Yet</h3>
            <p className="text-gray-500">Add your first achievement to get started</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && achievementsList.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* Add Achievement Modal */}
      {showAddAchievementModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <style>{`
            .modal-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .modal-scroll::-webkit-scrollbar-thumb {
              background: #ffffff;
              border-radius: 4px;
            }
            .modal-scroll::-webkit-scrollbar-thumb:hover {
              background: #f0f0f0;
            }
          `}</style>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto modal-scroll">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingIndex !== null ? 'Edit Achievement' : 'Add New Achievement'}
              </h3>
              <button
                onClick={() => {
                  setShowAddAchievementModal(false)
                  setEditingIndex(null)
                }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitAchievement} className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Achievement Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  placeholder="Enter achievement title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none resize-none"
                  placeholder="Describe the achievement"
                />
              </div>

              {/* Competition */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Competition/Event <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAchievement.competition}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, competition: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  placeholder="e.g., National Robotics Challenge"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Related Categories (Max 3) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value)
                    const categories = e.target.value
                      .split(',')
                      .map(c => c.trim())
                      .filter(c => c.length > 0)
                      .slice(0, 3)
                    setNewAchievement(prev => ({ ...prev, categories }))
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  placeholder="e.g., Robotics, AI, Hardware (separate by commas)"
                />
                <p className="text-xs text-gray-500">
                  {newAchievement.categories.length} / 3 categories
                  {newAchievement.categories.length > 0 && (
                    <span className="ml-2 text-sky-600">
                      [{newAchievement.categories.join(', ')}]
                    </span>
                  )}
                </p>
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Participants <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                    {adminUsers.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">No team members available</p>
                    ) : (
                      adminUsers.map((admin) => (
                        <label key={admin.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={newAchievement.participants.includes(admin.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAchievement(prev => ({
                                  ...prev,
                                  participants: [...prev.participants, admin.id]
                                }))
                              } else {
                                setNewAchievement(prev => ({
                                  ...prev,
                                  participants: prev.participants.filter(id => id !== admin.id)
                                }))
                              }
                            }}
                            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                          />
                          <span className="text-sm text-gray-700">{admin.fullName}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {newAchievement.participants.length} participant(s) selected
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                />
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  LinkedIn Post URL
                </label>
                <input
                  type="url"
                  value={newAchievement.linkedinUrl}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                  placeholder="https://www.linkedin.com/posts/..."
                />
                <p className="text-xs text-gray-500">Optional: Link to LinkedIn post about this achievement</p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Achievement Photo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {newAchievement.photo ? (
                        <>
                          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">{newAchievement.photo.name}</p>
                          <p className="text-xs text-gray-500">{(newAchievement.photo.size / 1024).toFixed(2)} KB</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAchievementModal(false)
                    setEditingIndex(null)
                  }}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  {editingIndex !== null ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        type="success"
        title="Success!"
        message={dialogMessage}
      />

      {/* Error Dialog */}
      <Dialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        type="error"
        title="Error"
        message={dialogMessage}
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              {confirmAction?.type === 'delete' ? 'Delete Achievement?' : 'Confirm Changes?'}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {confirmAction?.type === 'delete' 
                ? 'Are you sure you want to delete this achievement? This action cannot be undone.' 
                : 'Are you sure you want to save these changes?'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setConfirmAction(null)
                }}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  if (confirmAction?.type === 'delete') {
                    confirmDeleteAchievement()
                  } else {
                    confirmSubmitAchievement()
                  }
                }}
                className={`px-6 py-2.5 rounded-lg text-white font-semibold transition-colors ${
                  confirmAction?.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Details Side Panel */}
      <AnimatePresence>
        {isDetailsPanelOpen && selectedAchievement && (
          <>
            {/* Backdrop */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDetailsPanelOpen(false)}
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
                onClick={() => setIsDetailsPanelOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Achievement Image */}
              <div className="relative w-full h-64 md:h-80 lg:h-96 bg-slate-100">
                {selectedAchievement.imageUrl ? (
                  <Image
                    src={selectedAchievement.imageUrl.startsWith('http') ? selectedAchievement.imageUrl : `${IMAGE_URL_PREFIX}${selectedAchievement.imageUrl}`}
                    alt={selectedAchievement.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <svg className="w-32 h-32 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Competition */}
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-sky-700 font-semibold">
                    {selectedAchievement.competition}
                  </p>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {selectedAchievement.title}
                </h2>

                {/* Categories */}
                {selectedAchievement.categories && selectedAchievement.categories.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAchievement.categories.map((category, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-4 py-1.5 text-sm font-medium border border-sky-200"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Participants */}
                {selectedAchievement.participants && selectedAchievement.participants.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Participants:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAchievement.participants.map((participantId, idx) => {
                        const participant = adminUsers.find(u => u.id === participantId)
                        return participant ? (
                          <span 
                            key={idx}
                            className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-4 py-1.5 text-sm font-medium border border-emerald-200"
                          >
                            {participant.fullName}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Date & LinkedIn */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {new Date(selectedAchievement.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  {selectedAchievement.linkedinUrl && (
                    <a 
                      href={selectedAchievement.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors font-medium text-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0077B5">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      View on LinkedIn
                    </a>
                  )}
                </div>

                {/* Full Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">About This Achievement</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedAchievement.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>

      {/* Image Cropper */}
      {showImageCropper && imageForCropping && (
        <ImageCropper
          image={imageForCropping}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}
