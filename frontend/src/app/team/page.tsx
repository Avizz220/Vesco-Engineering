'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { TeamMember, Project } from '@/types'
import TeamMemberCard from '@/components/team/TeamMemberCard'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'
import ImageCropper from '@/components/ui/ImageCropper'
import { API_URL, IMAGE_URL_PREFIX } from '@/lib/api'

type Department = 'Computer Engineering' | 'Electrical Engineering' | 'Mechanical Engineering'

interface CategorizedMembers {
  [key: string]: TeamMember[]
}

export default function TeamPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showProjectsModal, setShowProjectsModal] = useState(false)
  const [selectedMemberProjects, setSelectedMemberProjects] = useState<Project[]>([])
  const [selectedMemberName, setSelectedMemberName] = useState('')
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; fullName: string; email: string }>>([])
  const [showSlideshow, setShowSlideshow] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null)
  const [showImageCropper, setShowImageCropper] = useState(false)
  const [imageForCropping, setImageForCropping] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    email: '',
    photo: null as File | null,
  })

  useEffect(() => {
    fetchTeamMembers()
    fetchAdminUsers()
  }, [])

  useEffect(() => {
    if (!showSlideshow) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [showSlideshow])

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

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/team`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (err) {
      console.error('Error fetching team members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddOrUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const confirmAddOrUpdate = async () => {
    setShowConfirmDialog(false)
    
    try {
      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      submitFormData.append('role', formData.role)
      submitFormData.append('department', formData.department)
      submitFormData.append('bio', formData.bio)
      submitFormData.append('linkedinUrl', formData.linkedinUrl)
      submitFormData.append('githubUrl', formData.githubUrl)
      submitFormData.append('email', formData.email)
      if (formData.photo) {
        submitFormData.append('image', formData.photo)
      }

      // Use different endpoint based on user role
      let url: string
      let method: string
      
      if (user?.isAdmin && editingMember) {
        // Admin editing existing member
        url = `${API_URL}/team/${editingMember.id}`
        method = 'PUT'
      } else if (user?.isAdmin && !editingMember) {
        // Admin creating new member
        url = `${API_URL}/team`
        method = 'POST'
      } else {
        // Regular user creating/updating their own profile
        url = `${API_URL}/team/my-profile`
        method = 'POST'
      }
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: submitFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save profile')
      }

      setDialogMessage(editingMember ? 'Profile updated successfully!' : 'Profile created successfully!')
      setShowSuccessDialog(true)
      setShowAddModal(false)
      setEditingMember(null)
      resetForm()
      fetchTeamMembers()
      
      // Refresh user profile in navbar if not admin
      if (!user?.isAdmin) {
        // This will update the navbar picture
        window.location.reload()
      }
    } catch (error: any) {
      setDialogMessage(error.message || 'Failed to save profile')
      setShowSuccessDialog(true)
    }
  }

  const handleEditProfile = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department || '',
      bio: member.bio || '',
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || '',
      email: member.email || '',
      photo: null,
    })
    setShowAddModal(true)
  }

  const handleViewProjects = async (memberName: string) => {
    try {
      const response = await fetch(`${API_URL}/projects`)
      if (response.ok) {
        const data = await response.json()
        const projects = data.projects || []
        
        // Get the member's user ID by matching email
        const member = members.find(m => m.name === memberName)
        const adminUser = adminUsers.find(admin => admin.email === member?.email)
        
        // Filter projects where the member is a contributor
        const memberProjects = projects.filter((project: Project) => {
          if (!project.contributors || !Array.isArray(project.contributors)) return false
          
          // If 'all' is selected, this member contributed to this project
          if (project.contributors[0] === 'all') return true
          
          // Check if member's user ID is in contributors list
          if (adminUser) {
            return project.contributors.includes(adminUser.id)
          }
          
          return false
        })

        setSelectedMemberName(memberName)
        setSelectedMemberProjects(memberProjects)
        setShowAllProjects(false)
        setShowProjectsModal(true)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      department: '',
      bio: '',
      linkedinUrl: '',
      githubUrl: '',
      email: '',
      photo: null,
    })
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
    setFormData(prev => ({ ...prev, photo: croppedFile }))
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleCropCancel = () => {
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleDeleteProfile = async (memberId: string) => {
    setDeletingMemberId(memberId)
    setDialogMessage('Are you sure you want to delete this profile?')
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    setShowConfirmDialog(false)
    if (!deletingMemberId) return

    try {
      const response = await fetch(`${API_URL}/team/${deletingMemberId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete profile')
      }

      setDialogMessage('Profile deleted successfully!')
      setShowSuccessDialog(true)
      setDeletingMemberId(null)
      fetchTeamMembers()
    } catch (error: any) {
      setDialogMessage(error.message || 'Failed to delete profile')
      setShowSuccessDialog(true)
      setDeletingMemberId(null)
    }
  }

  // Check if logged-in user has a profile
  const userProfile = members.find(m => m.email === user?.email)
  const canCreateProfile = user && !userProfile

  const groupImages = [
    '/group1.jpeg',
    '/group2.jpeg',
    '/group3.jpeg',
  ]

  // Categorize members by department
  const categorizedMembers: CategorizedMembers = {
    'Computer Engineering': members.filter(m => m.department === 'Computer Engineering'),
    'Electrical Engineering': members.filter(m => m.department === 'Electrical Engineering'),
    'Mechanical Engineering': members.filter(m => m.department === 'Mechanical Engineering'),
  }

  const departments: Department[] = [
    'Computer Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
  ]

  const departmentColors: { [key: string]: string } = {
    'Computer Engineering': 'bg-white border-gray-200',
    'Electrical Engineering': 'bg-white border-gray-200',
    'Mechanical Engineering': 'bg-white border-gray-200',
  }

  const departmentTitleColors: { [key: string]: string } = {
    'Computer Engineering': 'text-gray-800',
    'Electrical Engineering': 'text-gray-800',
    'Mechanical Engineering': 'text-gray-800',
  }

  const departmentAccentColors: { [key: string]: string } = {
    'Computer Engineering': 'bg-blue-500',
    'Electrical Engineering': 'bg-blue-500',
    'Mechanical Engineering': 'bg-blue-500',
  }

  return (
    <>
      {showSlideshow ? (
        <div className="min-h-screen pt-24 sm:pt-26 md:pt-28 pb-12 sm:pb-14 md:pb-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2 mb-8">
                A talented group of professionals from diverse engineering disciplines
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setShowSlideshow(false)}
              >
                <div className="relative h-[60vh] md:h-[70vh]">
                  {groupImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        currentSlide === idx ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Team photo ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  ))}
                  
                  {/* Overlay with button */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-full bg-white/90 text-gray-900 font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/70"
                    >
                      View Team Member
                    </button>
                  </div>
                </div>

                {/* Slide indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                  {groupImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentSlide(idx)
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSlide === idx 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
      <div className="min-h-screen pt-24 sm:pt-26 md:pt-28 pb-12 sm:pb-14 md:pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex-1 hidden md:block"></div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 md:flex-1">
                Meet Our Team
              </h1>
              <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
                {user && (
                  <button
                    onClick={() => {
                      if (userProfile) {
                        handleEditProfile(userProfile)
                      } else {
                        setEditingMember(null)
                        resetForm()
                        setFormData(prev => ({ ...prev, email: user?.email || '', name: user?.name || '' }))
                        setShowAddModal(true)
                      }
                    }}
                    className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 w-full md:w-auto justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      {userProfile ? (
                        <>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </>
                      ) : (
                        <>
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </>
                      )}
                    </svg>
                    {userProfile ? 'Edit My Profile' : 'Create My Profile'}
                  </button>
                )}
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              A talented group of professionals from diverse engineering disciplines dedicated to delivering excellence
              and innovation in everything we do
            </p>
          </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No team members found.</p>
          </div>
        ) : (
          /* All Team Members Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {members.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isOwnProfile={user?.email === member.email}
                  canDelete={user?.email === member.email}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteProfile}
                  onViewProjects={handleViewProjects}
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
      )}

      {/* Back to Slideshow Button */}
      {!showSlideshow && (
        <button
          onClick={() => setShowSlideshow(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          title="Back to slideshow"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* Add/Edit Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingMember ? 'Edit Your Profile' : 'Create Your Profile'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingMember(null)
                  resetForm()
                }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddOrUpdateProfile} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Position/Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="">Select department...</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500">Enter your contact email address</p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Bio/Description (Max 15 words)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0)
                    if (words.length <= 15 || e.target.value.length < formData.bio.length) {
                      setFormData(prev => ({ ...prev, bio: e.target.value }))
                    }
                  }}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                  placeholder="Brief description (max 15 words)..."
                />
                <p className="text-xs text-gray-500">
                  {formData.bio ? formData.bio.trim().split(/\s+/).filter(w => w.length > 0).length : 0} / 15 words
                </p>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              {/* Profile Photo */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Profile Photo
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {formData.photo ? (
                        <>
                          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">{formData.photo.name}</p>
                          <p className="text-xs text-gray-500">{(formData.photo.size / 1024).toFixed(2)} KB</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingMember(null)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  {editingMember ? 'Update Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Modal */}
      {showProjectsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <h3 className="text-xl font-semibold text-gray-900">
                Projects by {selectedMemberName}
              </h3>
              <button
                onClick={() => setShowProjectsModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedMemberProjects.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No projects found for this member</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllProjects ? selectedMemberProjects : selectedMemberProjects.slice(0, 3)).map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => {
                        sessionStorage.setItem('openProjectId', project.id)
                        window.location.href = '/projects'
                      }}
                    >
                      <div className="flex gap-4">
                        {project.imageUrl ? (
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={project.imageUrl.startsWith('http') ? project.imageUrl : `${IMAGE_URL_PREFIX}${project.imageUrl}`}
                              alt={project.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies?.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.technologies?.length || 0) > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                +{(project.technologies?.length || 0) - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedMemberProjects.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowAllProjects(!showAllProjects)
                      }}
                      className="w-full py-3 text-center text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {showAllProjects ? (
                        <span className="flex items-center justify-center gap-2">
                          Show Less
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Show {selectedMemberProjects.length - 3} More Project{selectedMemberProjects.length - 3 > 1 ? 's' : ''}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          setDeletingMemberId(null)
        }}
        type="confirm"
        title="Confirm Action"
        message={deletingMemberId ? dialogMessage : (editingMember ? "Are you sure you want to update your profile?" : "Are you sure you want to create your profile?")}
        onConfirm={deletingMemberId ? confirmDelete : confirmAddOrUpdate}
        onCancel={() => {
          setShowConfirmDialog(false)
          setDeletingMemberId(null)
        }}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
      />

      {/* Success Dialog */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title={dialogMessage.includes('success') ? 'Success' : 'Error'}
        message={dialogMessage}
        onConfirm={() => setShowSuccessDialog(false)}
        confirmText="OK"
      />

      {/* Image Cropper */}
      {showImageCropper && imageForCropping && (
        <ImageCropper
          image={imageForCropping}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  )
}
