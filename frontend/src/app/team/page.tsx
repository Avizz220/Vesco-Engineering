'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TeamMember } from '@/types'
import TeamMemberCard from '@/components/team/TeamMemberCard'

type Department = 'Computer Engineering' | 'Electrical Engineering' | 'Mechanical Engineering'

interface CategorizedMembers {
  [key: string]: TeamMember[]
}

const FALLBACK_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Lead Developer',
    department: 'Computer Engineering',
    bio: 'Full-stack developer with passion for innovative solutions',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'john@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    department: 'Computer Engineering',
    bio: 'Creative designer focused on user experience and modern design systems',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'jane@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    joinedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Backend Engineer',
    department: 'Computer Engineering',
    bio: 'Experienced backend developer specializing in cloud solutions',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'mike@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    joinedDate: '2024-01-10',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    role: 'Electrical Engineer',
    department: 'Electrical Engineering',
    bio: 'Strategic electrical engineer with expertise in power systems and circuit design',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'sarah@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    joinedDate: '2024-03-01',
  },
  {
    id: '5',
    name: 'Alex Chen',
    role: 'Electrical Technician',
    department: 'Electrical Engineering',
    bio: 'Skilled technician with expertise in electrical systems and troubleshooting',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'alex@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    joinedDate: '2024-02-05',
  },
  {
    id: '6',
    name: 'Emma Rodriguez',
    role: 'Mechanical Engineer',
    department: 'Mechanical Engineering',
    bio: 'Mechanical engineer specialized in CAD design and mechanical systems',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'emma@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    joinedDate: '2024-01-25',
  },
  {
    id: '7',
    name: 'David Lee',
    role: 'Mechanical Designer',
    department: 'Mechanical Engineering',
    bio: 'Experienced mechanical designer with expertise in product development',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    email: 'david@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    joinedDate: '2024-02-10',
  },
]

// Publicly visible team page; auth only used elsewhere in app

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(FALLBACK_MEMBERS)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setError(null)
        const response = await fetch('/api/team')
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }
        const data = await response.json()
        setMembers(data)
      } catch (err) {
        console.error('Error fetching team members:', err)
        // Keep fallback members on network failure so the page renders immediately
        setMembers(FALLBACK_MEMBERS)
        setError('Using default team data')
      }
    }

    fetchTeamMembers()
  }, [])

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
      <div className="min-h-screen pt-24 pb-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A talented group of professionals from diverse engineering disciplines dedicated to delivering excellence
              and innovation in everything we do
            </p>
          </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            Using default team data
          </div>
        )}

        {members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No team members found.</p>
          </div>
        ) : (
          /* Categorized Team Members Sections */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-16"
          >
            {departments.map((department) => {
              const deptMembers = categorizedMembers[department]
              if (deptMembers.length === 0) return null

              return (
                <div key={department} className={`rounded-lg p-8 border ${departmentColors[department]} shadow-sm`}>
                  {/* Department Header */}
                  <div className="mb-10">
                    <h2 className={`text-3xl font-bold ${departmentTitleColors[department]} mb-2`}>
                      {department}
                    </h2>
                    <div className={`w-24 h-1 rounded-full ${departmentAccentColors[department]}`}></div>
                  </div>

                  {/* Department Members Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {deptMembers.map((member, index) => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

      </div>
    </div>
    </>
  )
}
