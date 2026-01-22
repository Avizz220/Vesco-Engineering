'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import SignInModal from '@/components/auth/SignInModal'
import { Project } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import roboticImg from '@/assets/robotic.jpg'
import eieImg from '@/assets/eie.jpg'
import arduinoImg from '@/assets/arduino.jpg'
import aerospaceImg from '@/assets/aerospace.jpg'

// Sample project data - Replace with API call later
const allProjects: Project[] = [
  {
    id: '1',
    title: 'Autonomous Robot',
    description: 'An intelligent autonomous robot capable of navigating complex environments using advanced sensors and AI algorithms for obstacle detection and path planning.',
    technologies: ['ROS', 'Python', 'Computer Vision', 'TensorFlow'],
    imageUrl: roboticImg.src,
    category: 'Robotics',
    contributors: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Smart Home IoT System',
    description: 'A comprehensive IoT-based smart home automation system with real-time monitoring, voice control, and energy optimization features.',
    technologies: ['Arduino', 'IoT', 'Mobile App', 'Firebase'],
    imageUrl: arduinoImg.src,
    category: 'IoT',
    contributors: ['Sarah Lee', 'Tom Brown'],
    githubUrl: '#',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: '3',
    title: 'AI-Powered Drone',
    description: 'An autonomous drone equipped with AI capabilities for aerial surveillance, object detection, and automated flight path optimization.',
    technologies: ['Python', 'AI/ML', 'Drone Tech', 'OpenCV'],
    imageUrl: aerospaceImg.src,
    category: 'Aerospace',
    contributors: ['Alex Wilson', 'Emily Davis', 'Chris Martin', 'Lisa Taylor'],
    liveUrl: '#',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
  {
    id: '4',
    title: 'EIE Control System',
    description: 'Advanced electronic and electrical control system for industrial automation with real-time monitoring and predictive maintenance.',
    technologies: ['Embedded C', 'PCB Design', 'Control Systems', 'MATLAB'],
    imageUrl: eieImg.src,
    category: 'Electronics',
    contributors: ['David Kim', 'Rachel Green'],
    githubUrl: '#',
    createdAt: '2024-04-12',
    updatedAt: '2024-04-12',
  },
  {
    id: '5',
    title: 'Machine Learning Model',
    description: 'A deep learning model for image classification and object recognition with 95% accuracy on benchmark datasets.',
    technologies: ['Python', 'TensorFlow', 'Keras', 'CNN'],
    imageUrl: roboticImg.src,
    category: 'AI/ML',
    contributors: ['Kevin Zhang', 'Olivia White', 'Ryan Black'],
    githubUrl: '#',
    createdAt: '2024-05-20',
    updatedAt: '2024-05-20',
  },
  {
    id: '6',
    title: 'Web-Based Dashboard',
    description: 'Interactive real-time dashboard for monitoring and controlling various engineering systems and IoT devices.',
    technologies: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
    imageUrl: eieImg.src,
    category: 'Software',
    contributors: ['Anna Johnson', 'Mark Lee'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-15',
  },
  {
    id: '7',
    title: '3D Printing System',
    description: 'Custom 3D printer with advanced features for rapid prototyping and manufacturing of complex engineering parts.',
    technologies: ['CAD', 'Mechanical Design', 'Arduino', 'Firmware'],
    imageUrl: arduinoImg.src,
    category: 'Manufacturing',
    contributors: ['Sophie Turner', 'James Miller'],
    githubUrl: '#',
    createdAt: '2024-07-10',
    updatedAt: '2024-07-10',
  },
  {
    id: '8',
    title: 'Solar Tracking System',
    description: 'Automated solar panel tracking system that maximizes energy capture by following the sun throughout the day.',
    technologies: ['Arduino', 'Sensors', 'Renewable Energy', 'Electronics'],
    imageUrl: aerospaceImg.src,
    category: 'Energy',
    contributors: ['Linda Clark', 'Peter Hall'],
    githubUrl: '#',
    createdAt: '2024-08-05',
    updatedAt: '2024-08-05',
  },
  {
    id: '9',
    title: 'Gesture Control Robot',
    description: 'A robot controlled by hand gestures using computer vision and machine learning for intuitive human-robot interaction.',
    technologies: ['OpenCV', 'Python', 'Machine Learning', 'Robotics'],
    imageUrl: roboticImg.src,
    category: 'Robotics',
    contributors: ['Daniel Wright', 'Emma Scott', 'Noah Adams'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2024-09-12',
    updatedAt: '2024-09-12',
  },
  {
    id: '10',
    title: 'Voice Assistant',
    description: 'AI-powered voice assistant with natural language processing capabilities for smart home and task automation.',
    technologies: ['NLP', 'Python', 'Speech Recognition', 'AI'],
    imageUrl: eieImg.src,
    category: 'AI/ML',
    contributors: ['Grace Hill', 'Lucas Baker'],
    githubUrl: '#',
    createdAt: '2024-10-08',
    updatedAt: '2024-10-08',
  },
  {
    id: '11',
    title: 'Water Quality Monitor',
    description: 'IoT-based water quality monitoring system for real-time analysis of pH, turbidity, and contamination levels.',
    technologies: ['IoT', 'Sensors', 'Data Analytics', 'Arduino'],
    imageUrl: arduinoImg.src,
    category: 'Environmental',
    contributors: ['Mia Carter', 'Ethan Moore'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2024-11-20',
    updatedAt: '2024-11-20',
  },
  {
    id: '12',
    title: 'Traffic Management AI',
    description: 'Intelligent traffic management system using computer vision and AI for optimizing traffic flow and reducing congestion.',
    technologies: ['Computer Vision', 'AI', 'Python', 'Deep Learning'],
    imageUrl: aerospaceImg.src,
    category: 'Smart City',
    contributors: ['Ava Lewis', 'Mason Walker', 'Isabella Young'],
    githubUrl: '#',
    createdAt: '2024-12-15',
    updatedAt: '2024-12-15',
  },
  {
    id: '13',
    title: 'Wireless Power Transfer',
    description: 'Innovative wireless power transfer system for charging devices without physical connections using electromagnetic induction.',
    technologies: ['Electronics', 'Power Systems', 'Wireless Tech', 'PCB'],
    imageUrl: eieImg.src,
    category: 'Electronics',
    contributors: ['William King', 'Sophia Harris'],
    githubUrl: '#',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
  },
  {
    id: '14',
    title: 'Biometric Security System',
    description: 'Multi-factor biometric security system combining fingerprint, facial recognition, and voice authentication.',
    technologies: ['Biometrics', 'AI', 'Computer Vision', 'Security'],
    imageUrl: roboticImg.src,
    category: 'Security',
    contributors: ['Benjamin Allen', 'Charlotte Martinez'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2025-02-05',
    updatedAt: '2025-02-05',
  },
  {
    id: '15',
    title: 'Augmented Reality App',
    description: 'AR application for engineering visualization and interactive 3D model manipulation in real-world environments.',
    technologies: ['Unity', 'ARCore', 'C#', '3D Modeling'],
    imageUrl: arduinoImg.src,
    category: 'Software',
    contributors: ['Henry Robinson', 'Amelia Clark'],
    liveUrl: '#',
    githubUrl: '#',
    createdAt: '2025-03-18',
    updatedAt: '2025-03-18',
  },
]

export default function ProjectsPage() {
  const [displayCount, setDisplayCount] = useState(12)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  // Debug log
  useEffect(() => {
    console.log('Projects Page - User:', user)
    console.log('Projects Page - isAdmin:', user?.isAdmin)
  }, [user])
  const [newProject, setNewProject] = useState({
    title: '',
    contributors: [] as string[],
    relatedAreas: [] as string[],
    description: '',
    photo: null as File | null,
    githubLink: '',
    linkedInLink: '',
    youtubeLink: '',
  })
  const router = useRouter()

  // Mock registered users (replace with actual data from backend later)
  const registeredUsers = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Lee', 'Tom Brown',
    'Alex Wilson', 'Emily Davis', 'Chris Martin', 'Lisa Taylor', 'David Kim',
    'Rachel Green', 'Kevin Zhang', 'Olivia White', 'Ryan Black', 'Anna Johnson'
  ]

  // Available project areas
  const projectAreas = ['IoT', 'Web Development', 'AI/ML', 'Robotics', 'Electronics', 'Software', 'Aerospace', 'Manufacturing']

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
      setNewProject(prev => ({ ...prev, photo: e.target.files![0] }))
    }
  }

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle project submission to backend
    console.log('New Project:', newProject)
    // Reset form
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
    setShowAddProjectModal(false)
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))]

  // Filter projects by category
  const filteredProjects = selectedCategory === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.category === selectedCategory)

  // Get projects to display
  const displayedProjects = filteredProjects.slice(0, displayCount)
  const hasMore = displayCount < filteredProjects.length

  const loadMore = () => {
    setDisplayCount(prev => prev + 12)
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  const SignInRequired = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-2xl relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Sign In Required</h3>
        <p className="text-gray-600 mb-8">Please sign in to view our innovative projects and case studies</p>
        <button
          onClick={() => setShowSignInModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  )

  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <SignInRequired />
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSwitchToSignUp={() => setShowSignInModal(false)}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1"></div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 flex-1">
              Our Projects
            </h1>
            <div className="flex-1 flex justify-end">
              {user?.isAdmin && (
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our innovative engineering projects and technological solutions
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setDisplayCount(12)
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Projects Found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Load More Projects
            </button>
            <p className="text-gray-500 mt-4">
              Showing {displayedProjects.length} of {filteredProjects.length} projects
            </p>
          </motion.div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Admin Panel</p>
                <h3 className="text-xl font-semibold text-gray-900">Add New Project</h3>
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

              {/* Contributors */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Contributors <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={(e) => {
                    handleAddContributor(e.target.value)
                    e.target.value = ''
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                >
                  <option value="">Select contributors...</option>
                  {registeredUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.contributors.map(contributor => (
                    <span
                      key={contributor}
                      className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {contributor}
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(contributor)}
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
                  disabled={newProject.relatedAreas.length >= 4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-100"
                >
                  <option value="">Select area...</option>
                  {projectAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.relatedAreas.map(area => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-emerald-900"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
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
                  placeholder="Describe the project..."
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="photo">
                  Project Photo <span className="text-red-500">*</span>
                </label>
                <input
                  id="photo"
                  type="file"
                  required
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                {newProject.photo && (
                  <p className="text-sm text-gray-600">Selected: {newProject.photo.name}</p>
                )}
              </div>

              {/* Links Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="github">
                    GitHub Link
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="linkedin">
                    LinkedIn Post
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
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="youtube">
                    YouTube Link
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
                  Add Project
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
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => setShowSignInModal(false)}
      />

      {/* Show blocked message if not authenticated */}
    </div>
  )
}
