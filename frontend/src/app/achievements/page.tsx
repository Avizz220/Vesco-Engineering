'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'

interface Achievement {
  id: string
  title: string
  description: string
  position: string
  competition: string
  date: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export default function AchievementsPage() {
  const { user } = useAuth()
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [achievementsList, setAchievementsList] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'update', index?: number } | null>(null)
  
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    position: '',
    competition: '',
    date: '',
    photo: null as File | null,
  })

  // Fetch achievements from backend
  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/achievements')
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
      setNewAchievement(prev => ({ ...prev, photo: e.target.files![0] }))
    }
  }

  const handleEditAchievement = (achievement: Achievement, index: number) => {
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      position: achievement.position,
      competition: achievement.competition,
      date: achievement.date.split('T')[0],
      photo: null,
    })
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
      const response = await fetch(`http://localhost:5000/api/achievements/${achievementId}`, {
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
        formData.append('position', newAchievement.position)
        formData.append('competition', newAchievement.competition)
        formData.append('date', newAchievement.date)
        if (newAchievement.photo) {
          formData.append('image', newAchievement.photo)
        }

        const response = await fetch(`http://localhost:5000/api/achievements/${achievementId}`, {
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
        formData.append('position', newAchievement.position)
        formData.append('competition', newAchievement.competition)
        formData.append('date', newAchievement.date)
        if (newAchievement.photo) {
          formData.append('image', newAchievement.photo)
        }

        const response = await fetch('http://localhost:5000/api/achievements', {
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
        position: '',
        competition: '',
        date: '',
        photo: null,
      })
    } catch (error: any) {
      setDialogMessage(error.message || 'Failed to save achievement')
      setShowErrorDialog(true)
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-600/80 mb-3">Competitions & Wins</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Our Achievements</h1>
            </div>
            <div className="flex-1 flex justify-end">
              {user?.isAdmin && (
                <button
                  onClick={() => setShowAddAchievementModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
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
          <p className="text-slate-600 max-w-3xl mx-auto text-lg text-center">
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
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {achievementsList.map((achievement, index) => (
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
                      src={`http://localhost:5000${achievement.imageUrl}`}
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
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-700/80">{achievement.competition}</p>
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">{achievement.title}</h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-semibold border border-emerald-200">
                      {achievement.position}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{achievement.description}</p>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Position/Award <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newAchievement.position}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none"
                >
                  <option value="">Select position...</option>
                  <option value="Winner">Winner</option>
                  <option value="1st Runner-up">1st Runner-up</option>
                  <option value="2nd Runner-up">2nd Runner-up</option>
                  <option value="Participation">Participation</option>
                </select>
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
    </div>
  )
}
