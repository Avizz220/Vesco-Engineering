export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  category: string
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
  imageUrl?: string
  bio?: string
  linkedinUrl?: string
  githubUrl?: string
  email?: string
  joinedDate: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  createdAt: string
}
