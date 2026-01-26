'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

interface Course {
  id: string
  title: string
  category: string
  instructor: string
  duration: string
  level: string
  price: string
  description: string
  imageUrl: string | null
  learningOutcomes: string[]
  createdAt: string
  updatedAt: string
}

export default function CoursesPage() {
  const { user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [coursesList, setCoursesList] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    conductedBy: '',
    duration: '',
    learningOutcomes: '',
    courseFee: '',
    category: '',
    level: '',
    photo: null as File | null,
  })

  // Fetch courses from API
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/courses', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setCoursesList(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setNewCourse({
      name: course.title,
      description: course.description,
      conductedBy: course.instructor,
      duration: course.duration,
      learningOutcomes: course.learningOutcomes.join(', '),
      courseFee: course.price,
      category: course.category,
      level: course.level,
      photo: null,
    })
    setShowAddCourseModal(true)
  }

  const handleDeleteCourse = async (course: Course) => {
    setConfirmMessage(`Are you sure you want to delete "${course.title}"?`)
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${course.id}`, {
          method: 'DELETE',
          credentials: 'include',
        })

        if (response.ok) {
          setDialogType('success')
          setDialogMessage('Course deleted successfully!')
          setShowDialog(true)
          fetchCourses()
        } else {
          setDialogType('error')
          setDialogMessage('Failed to delete course')
          setShowDialog(true)
        }
      } catch (error) {
        setDialogType('error')
        setDialogMessage('Error deleting course')
        setShowDialog(true)
      }
    })
    setShowConfirmDialog(true)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCourse(prev => ({ ...prev, photo: e.target.files![0] }))
    }
  }

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault()

    const confirmMsg = editingCourse 
      ? `Are you sure you want to update "${newCourse.name}"?`
      : `Are you sure you want to add "${newCourse.name}"?`

    setConfirmMessage(confirmMsg)
    setConfirmAction(() => async () => {
      try {
        const formData = new FormData()
        formData.append('title', newCourse.name)
        formData.append('description', newCourse.description)
        formData.append('instructor', newCourse.conductedBy)
        formData.append('duration', newCourse.duration)
        formData.append('price', newCourse.courseFee)
        formData.append('category', newCourse.category)
        formData.append('level', newCourse.level)
        
        const outcomes = newCourse.learningOutcomes
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
        formData.append('learningOutcomes', JSON.stringify(outcomes))
        
        if (newCourse.photo) {
          formData.append('image', newCourse.photo)
        }

        const url = editingCourse
          ? `http://localhost:5000/api/courses/${editingCourse.id}`
          : 'http://localhost:5000/api/courses'
        
        const response = await fetch(url, {
          method: editingCourse ? 'PUT' : 'POST',
          credentials: 'include',
          body: formData,
        })

        if (response.ok) {
          setDialogType('success')
          setDialogMessage(editingCourse ? 'Course updated successfully!' : 'Course added successfully!')
          setShowDialog(true)
          setShowAddCourseModal(false)
          setEditingCourse(null)
          setNewCourse({
            name: '',
            description: '',
            conductedBy: '',
            duration: '',
            learningOutcomes: '',
            courseFee: '',
            category: '',
            level: '',
            photo: null,
          })
          fetchCourses()
        } else {
          const error = await response.json()
          setDialogType('error')
          setDialogMessage(error.message || 'Failed to save course')
          setShowDialog(true)
        }
      } catch (error) {
        setDialogType('error')
        setDialogMessage('Error saving course')
        setShowDialog(true)
      }
    })
    setShowConfirmDialog(true)
  }

  const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'

  // Pagination calculations
  const totalPages = Math.ceil(coursesList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedCourses = coursesList.slice(startIndex, endIndex)

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
    <>
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-600/80 mb-3">Professional Training</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Our Courses</h1>
              </div>
              <div className="flex-1 flex justify-end">
                {user?.isAdmin && (
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Course
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg text-center">
              Expert-led courses designed by industry professionals. Learn cutting-edge skills with hands-on projects and real-world applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">Loading courses...</p>
              </div>
            ) : coursesList.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600">No courses available yet.</p>
              </div>
            ) : (
              displayedCourses.map((course) => (
              <div
                key={course.id}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative w-full overflow-hidden bg-slate-100 aspect-[4/3]">
                  <Image
                    src={course.imageUrl ? `http://localhost:5000${course.imageUrl}` : defaultImage}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {user?.isAdmin && (
                      <>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-sky-50 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-600">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
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
                      </>
                    )}
                    <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1 text-xs font-semibold shadow-md">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="relative p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-700/80 mb-1">{course.category}</p>
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">{course.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-slate-600">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-slate-600">{course.duration}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-2">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">What you'll learn</p>
                    <ul className="space-y-1.5">
                      {course.learningOutcomes.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Course Fee</p>
                      <p className="text-2xl font-bold text-slate-900">{course.price}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))
            )}
          </motion.div>

          {/* Pagination */}
          {!loading && coursesList.length > itemsPerPage && (
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
      </div>

      {/* Success/Error Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            {dialogType === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {dialogType === 'success' ? 'Success!' : 'Error'}
            </h3>
            <p className="text-gray-600 mb-6">{dialogMessage}</p>
            <button
              onClick={() => setShowDialog(false)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmDialog(false)
                  setConfirmAction(null)
                }}
                className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  if (confirmAction) confirmAction()
                  setShowConfirmDialog(false)
                  setConfirmAction(null)
                }}
                className="px-6 py-2 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enrollment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Enrollment</p>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
                <h4 className="text-base font-semibold text-slate-900 mb-1">Course Fee: {selectedCourse.price}</h4>
                <p className="text-sm text-slate-600">Duration: {selectedCourse.duration} • Instructor: {selectedCourse.instructor}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-900">How to Enroll</h4>
                <ol className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">1</span>
                    <span>Contact our course coordinator using the details below</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">2</span>
                    <span>Deposit the course fee to the provided bank account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">3</span>
                    <span>Send the payment slip/receipt to confirm your enrollment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">4</span>
                    <span>Receive confirmation and course access details within 24 hours</span>
                  </li>
                </ol>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-3">
                <h4 className="text-base font-semibold text-slate-900">Contact & Payment Details</h4>
                
                <div className="bg-slate-50 rounded-lg p-3 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Course Coordinator</p>
                      <p className="text-sm text-slate-600">Eng. Ravindu Jayasinghe</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="text-sm text-slate-600">+94 77 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-600">courses@teamvesco.lk</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                    </svg>
                    Bank Account Details
                  </h5>
                  <div className="space-y-1.5 text-sm text-slate-700">
                    <p><span className="font-semibold">Bank:</span> Commercial Bank</p>
                    <p><span className="font-semibold">Account Name:</span> VESCO Engineering Team</p>
                    <p><span className="font-semibold">Account Number:</span> 1234567890</p>
                    <p><span className="font-semibold">Branch:</span> Colombo 07</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href="mailto:courses@teamvesco.lk"
                  className="px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto modal-scroll">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              </div>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="p-6 space-y-5">
              {/* Course Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="courseName">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="courseName"
                  type="text"
                  required
                  value={newCourse.name}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="Enter course name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="Describe the course..."
                />
              </div>

              {/* Conducted By and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="conductedBy">
                    Conducted By <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="conductedBy"
                    type="text"
                    required
                    value={newCourse.conductedBy}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, conductedBy: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., Eng. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="duration">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="duration"
                    type="text"
                    required
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="learningOutcomes">
                  Learning Outcomes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="learningOutcomes"
                  required
                  value={newCourse.learningOutcomes}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, learningOutcomes: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="List the key learning outcomes (one per line or comma separated)"
                />
              </div>

              {/* Course Fee */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="courseFee">
                  Course Fee <span className="text-red-500">*</span>
                </label>
                <input
                  id="courseFee"
                  type="text"
                  required
                  value={newCourse.courseFee}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, courseFee: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="e.g., LKR 35,000"
                />
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="category">
                    Related Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="category"
                    type="text"
                    required
                    value={newCourse.category}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., Web Development, IoT"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="level">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="level"
                    required
                    value={newCourse.level}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  >
                    <option value="">Select level...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Course Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Course Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {newCourse.photo ? (
                        <>
                          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">{newCourse.photo.name}</p>
                          <p className="text-xs text-gray-500">{(newCourse.photo.size / 1024).toFixed(2)} KB</p>
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
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  {editingCourse !== null ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
