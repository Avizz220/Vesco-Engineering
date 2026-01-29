export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  videoUrl?: string
  youtubeUrl?: string
  githubUrl?: string
  linkedInUrl?: string
  liveUrl?: string
  category: string
  contributors?: string[]
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  imageUrl?: string
  position: string
  competition: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  department?: 'Computer Engineering' | 'Electrical Engineering' | 'Mechanical Engineering'
  imageUrl?: string
  bio?: string
  linkedinUrl?: string
  githubUrl?: string
  email?: string
  joinedDate: string
  isActive?: boolean
}

export interface User {
  id: string
  email: string
  name: string
  image?: string
  role?: 'admin' | 'member'
  createdAt?: string
}
