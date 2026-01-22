'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import { Project } from '@/types'
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our Projects
          </h1>
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

      {/* Project Details Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
