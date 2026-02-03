'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import { Project } from '@/types'
import { useAuth } from '@/context/AuthContext'
import Dialog from '@/components/ui/Dialog'
import ImageCropper from '@/components/ui/ImageCropper'
import { API_URL, IMAGE_URL_PREFIX } from '@/lib/api'

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'update', index?: number } | null>(null)
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; fullName: string; email: string }>>([])  const [showImageCropper, setShowImageCropper] = useState(false)
  const [imageForCropping, setImageForCropping] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')  const [newProject, setNewProject] = useState({
    title: '',
    contributors: [] as string[],
    relatedAreas: [] as string[],
    description: '',
    photo: null as File | null,
    githubLink: '',
    linkedInLink: '',
    youtubeLink: '',
  })

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects()
    fetchAdminUsers()
  }, [])

  // Check for project ID from team page navigation
  useEffect(() => {
    const openProjectId = sessionStorage.getItem('openProjectId')
    if (openProjectId && projectsList.length > 0) {
      const project = projectsList.find(p => p.id === openProjectId)
      if (project) {
        setSelectedProject(project)
        setIsModalOpen(true)
        sessionStorage.removeItem('openProjectId')
      }
    }
  }, [projectsList])

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

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/projects`)
      const data = await response.json()

      if (data.success) {
        const transformedProjects = data.projects.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          // Handle both Cloudinary URLs (full path) and local uploads (relative path)
          imageUrl: project.imageUrl 
            ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${IMAGE_URL_PREFIX}${project.imageUrl}`)
            : '/api/placeholder/400/300',
          category: project.category,
          contributors: Array.isArray(project.contributors) ? project.contributors : [],
          liveUrl: project.liveUrl,
          githubUrl: project.githubUrl,
          linkedInUrl: project.linkedInUrl,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        }))
        setProjectsList(transformedProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setDialogMessage('Failed to load projects')
      setShowErrorDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProject = (project: Project, index: number) => {
    setNewProject({
      title: project.title,
      contributors: project.contributors || [],
      relatedAreas: project.technologies.slice(0, 4),
      description: project.description,
      photo: null,
      githubLink: project.githubUrl || '',
      linkedInLink: project.linkedInUrl || '',
      youtubeLink: project.liveUrl || '',
    })
    setEditingIndex(index)
    setShowAddProjectModal(true)
  }

  const handleDeleteProject = async (index: number) => {
    setConfirmAction({ type: 'delete', index })
    setShowConfirmDialog(true)
  }

  const confirmDeleteProject = async () => {
    if (!confirmAction || confirmAction.index === undefined) return
    
    const index = confirmAction.index
    const projectId = projectsList[index].id
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setProjectsList(prev => prev.filter((_, i) => i !== index))
        setDialogMessage('Project deleted successfully!')
        setShowSuccessDialog(true)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      setDialogMessage('Failed to delete project')
      setShowErrorDialog(true)
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  const registeredUsers = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Lee', 'Tom Brown',
    'Alex Wilson', 'Emily Davis', 'Chris Martin', 'Lisa Taylor', 'David Kim',
    'Rachel Green', 'Kevin Zhang', 'Olivia White', 'Ryan Black', 'Anna Johnson'
  ]

  // Get unique areas from existing projects' technologies and categories
  const projectAreas = useMemo(() => {
    const allAreas = new Set<string>()
    projectsList.forEach(project => {
      // Add category
      if (project.category) allAreas.add(project.category)
      // Add all technologies
      if (Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => allAreas.add(tech))
      }
    })
    // Add some default options if no projects exist yet
    const defaultAreas = ['IoT', 'Web Development', 'AI/ML', 'Robotics', 'Electronics', 'Software', 'Aerospace', 'Manufacturing']
    defaultAreas.forEach(area => allAreas.add(area))
    return Array.from(allAreas).sort()
  }, [projectsList])

  const handleAddContributor = (contributor: string) => {
    if (!newProject.contributors.includes(contributor)) {
      setNewProject(prev => ({ ...prev, contributors: [...prev.contributors, contributor] }))
    }
  }

  const handleRemoveContributor = (contributor: string) => {
    setNewProject(prev => ({ ...prev, contributors: prev.contributors.filter(c => c !== contributor) }))
  }

  const handleAddArea = (area: string) => {
    if (newProject.relatedAreas.length < 4 && !newProject.relatedAreas.includes(area)) {
      setNewProject(prev => ({ ...prev, relatedAreas: [...prev.relatedAreas, area] }))
    }
  }

  const handleRemoveArea = (area: string) => {
    setNewProject(prev => ({ ...prev, relatedAreas: prev.relatedAreas.filter(a => a !== area) }))
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
    setNewProject(prev => ({ ...prev, photo: croppedFile }))
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleCropCancel = () => {
    setShowImageCropper(false)
    setImageForCropping(null)
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmAction({ type: 'update' })
    setShowConfirmDialog(true)
  }

  const confirmSubmitProject = async () => {
    try {
      if (editingIndex !== null) {
        // Update existing project
        const projectId = projectsList[editingIndex].id
        const formData = new FormData()
        formData.append('title', newProject.title)
        formData.append('description', newProject.description)
        formData.append('technologies', JSON.stringify(newProject.relatedAreas))
        formData.append('contributors', JSON.stringify(newProject.contributors))
        formData.append('category', newProject.relatedAreas[0] || 'Other')
        formData.append('githubUrl', newProject.githubLink || '')
        formData.append('linkedInUrl', newProject.linkedInLink || '')
        formData.append('liveUrl', newProject.youtubeLink || '')
        if (newProject.photo) {
          formData.append('image', newProject.photo)
        }

        const response = await fetch(`${API_URL}/projects/${projectId}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update project')
        }

        setDialogMessage('Project updated successfully!')
        setShowSuccessDialog(true)
        setEditingIndex(null)
        await fetchProjects()
      } else {
        // Add new project to backend with FormData for file upload
        const formData = new FormData()
        formData.append('title', newProject.title)
        formData.append('description', newProject.description)
        formData.append('technologies', JSON.stringify(newProject.relatedAreas))
        formData.append('contributors', JSON.stringify(newProject.contributors))
        formData.append('category', newProject.relatedAreas[0] || 'Other')
        formData.append('githubUrl', newProject.githubLink || '')
        formData.append('linkedInUrl', newProject.linkedInLink || '')
        formData.append('liveUrl', newProject.youtubeLink || '')
        formData.append('featured', 'false')
        if (newProject.photo) {
          formData.append('image', newProject.photo)
        }

        const response = await fetch(`${API_URL}/projects`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create project')
        }

        setDialogMessage('Project created successfully!')
        setShowSuccessDialog(true)
        
        // Refresh projects list
        await fetchProjects()
      }
      
      setShowAddProjectModal(false)
      setNewProject({
        title: '',
        contributors: [],
        relatedAreas: [],
        description: '',
        photo: null,
        githubLink: '',
        linkedInLink: '',
        youtubeLink: '',
      })
    } catch (error: any) {
      setDialogMessage(error.message || 'Failed to save project')
      setShowErrorDialog(true)
    } finally {
      setShowConfirmDialog(false)
      setConfirmAction(null)
    }
  }

  const categories = useMemo(() => {
    const allCategories = new Set<string>(['All'])
    projectsList.forEach(project => {
      // Add main category
      if (project.category) {
        allCategories.add(project.category)
      }
      // Add technologies as categories too
      if (Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => allCategories.add(tech))
      }
    })
    return Array.from(allCategories).sort((a, b) => {
      if (a === 'All') return -1
      if (b === 'All') return 1
      return a.localeCompare(b)
    })
  }, [projectsList])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projectsList
    return projectsList.filter(p => 
      p.category === selectedCategory || 
      (Array.isArray(p.technologies) && p.technologies.includes(selectedCategory))
    )
  }, [selectedCategory, projectsList])

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedProjects = filteredProjects.slice(startIndex, endIndex)

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

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-26 md:pt-28 pb-12 sm:pb-14 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex-1 hidden md:block"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mb-4 md:flex-1 whitespace-nowrap">
              Our Projects
            </h1>
            <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
              {user?.isAdmin && (
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add New Project
                </button>
              )}
            </div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Explore our innovative engineering projects and technological solutions
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 px-2"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {displayedProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index}
                onViewDetails={handleViewDetails}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                showAdminControls={user?.isAdmin}
                adminUsers={adminUsers}
              />
            ))}
          </div>
        )}

        {/* No Projects Message */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Projects Found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProjects.length > itemsPerPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            {/* First Page */}
            <button
              onClick={() => {
                setCurrentPage(1)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
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
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
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
                  onClick={() => {
                    setCurrentPage(page as number)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
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
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
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
              onClick={() => {
                setCurrentPage(totalPages)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
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

      {/* Add Project Modal */}
      {showAddProjectModal && (
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
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto modal-scroll">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h3>
              </div>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="p-6 space-y-5">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="projectName">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="projectName"
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="Enter project name"
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
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="Describe your project in detail"
                />
              </div>

              {/* Project Photo */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="photo">
                  Project Photo
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {newProject.photo ? (
                        <>
                          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-gray-600 font-medium">{newProject.photo.name}</p>
                          <p className="text-xs text-gray-500">{(newProject.photo.size / 1024).toFixed(2)} KB</p>
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
                      id="photo"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Related Areas */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Related Areas <span className="text-gray-500 text-xs">(Max 4)</span>
                </label>
                <select
                  onChange={(e) => {
                    handleAddArea(e.target.value)
                    e.target.value = ''
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                >
                  <option value="">Select areas...</option>
                  {projectAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.relatedAreas.map(area => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-sky-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Contributors */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Contributors
                </label>
                <select
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === 'all') {
                      setNewProject(prev => ({ ...prev, contributors: ['all'] }))
                    } else if (value && !newProject.contributors.includes(value) && newProject.contributors[0] !== 'all') {
                      setNewProject(prev => ({ 
                        ...prev, 
                        contributors: [...prev.contributors, value] 
                      }))
                    }
                    e.target.value = ''
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  value=""
                >
                  <option value="">Select contributors...</option>
                  <option value="all">All Admins</option>
                  {adminUsers.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName} ({admin.email})
                    </option>
                  ))}
                </select>
                {newProject.contributors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProject.contributors[0] === 'all' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-primary-600 text-white rounded-lg text-sm font-medium">
                        All Admins
                        <button
                          onClick={() => setNewProject(prev => ({ ...prev, contributors: [] }))}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          type="button"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ) : (
                      newProject.contributors.map((contributorId) => {
                        const admin = adminUsers.find(a => a.id === contributorId)
                        return admin ? (
                          <span key={contributorId} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium">
                            {admin.fullName}
                            <button
                              onClick={() => setNewProject(prev => ({
                                ...prev,
                                contributors: prev.contributors.filter(id => id !== contributorId)
                              }))}
                              className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                              type="button"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ) : null
                      })
                    )}
                  </div>
                )}
              </div>

              {/* GitHub Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="github">
                  GitHub Link <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="github"
                  type="url"
                  value={newProject.githubLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, githubLink: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="https://github.com/..."
                />
              </div>

              {/* YouTube Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="youtube">
                  YouTube Link <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="youtube"
                  type="url"
                  value={newProject.youtubeLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, youtubeLink: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="https://youtube.com/..."
                />
              </div>

              {/* LinkedIn Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="linkedin">
                  LinkedIn Link <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={newProject.linkedInLink}
                  onChange={(e) => setNewProject(prev => ({ ...prev, linkedInLink: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  {editingIndex !== null ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        adminUsers={adminUsers}
      />

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-2v2m-6-4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              {confirmAction?.type === 'delete' ? 'Delete Project?' : 'Confirm Changes?'}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {confirmAction?.type === 'delete' 
                ? 'Are you sure you want to delete this project? This action cannot be undone.' 
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
                    confirmDeleteProject()
                  } else {
                    confirmSubmitProject()
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
