'use client'

import { useEffect, useState } from 'react'
import { TeamMember } from '@/types'
import TeamMemberCard from '@/components/team/TeamMemberCard'
import { Spinner } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import SignInModal from '@/components/auth/SignInModal'

type Department = 'Computer Engineering' | 'Electrical Engineering' | 'Mechanical Engineering'

interface CategorizedMembers {
  [key: string]: TeamMember[]
}

const SignInRequired = ({ onSignIn, onClose }: { onSignIn: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
    <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-2xl relative">
      <button
        onClick={onClose}
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
      <p className="text-gray-600 mb-8">Please sign in to view our team members and their profiles</p>
      <button
        onClick={onSignIn}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Sign In
      </button>
    </div>
  </div>
)

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/team')
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }
        const data = await response.json()
        setMembers(data)
      } catch (err) {
        console.error('Error fetching team members:', err)
        // Use fallback sample data instead of showing error
        const fallbackMembers: TeamMember[] = [
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
        setMembers(fallbackMembers)
      } finally {
        setLoading(false)
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

  // Check authentication after all hooks
  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <SignInRequired
          onSignIn={() => setShowSignInModal(true)}
          onClose={() => router.push('/')}
        />
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSwitchToSignUp={() => setShowSignInModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A talented group of professionals from diverse engineering disciplines dedicated to delivering excellence
              and innovation in everything we do
            </p>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            Using default team data
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No team members found.</p>
          </div>
        ) : (
          /* Categorized Team Members Sections */
          <div className="space-y-16">
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
          </div>
        )}

        {/* Sign In Modal */}
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSwitchToSignUp={() => setShowSignInModal(false)}
        />
      </div>
    </div>
    </>
  )
}
