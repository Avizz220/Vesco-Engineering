'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import SignInModal from '@/components/auth/SignInModal'

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
      <p className="text-gray-600 mb-8">Please sign in to view our achievements and milestones</p>
      <button
        onClick={onSignIn}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Sign In
      </button>
    </div>
  </div>
)

export default function AchievementsPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    participants: [] as string[],
    placement: '',
    linkedInLink: '',
    year: '',
    photo: null as File | null,
  })
  const router = useRouter()

  // Mock registered users for dropdown
  const registeredUsers = ['Ayesh Perera', 'Dilsha Fernando', 'Ravindu Jayasinghe', 'Shenal Dias', 'Upeka Fernando', 'Naduni de Silva', 'Dineth Jayawardena', 'Buwaneka Weerakoon']

  const handleAddParticipant = (participant: string) => {
    if (participant && !newAchievement.participants.includes(participant)) {
      setNewAchievement(prev => ({ ...prev, participants: [...prev.participants, participant] }))
    }
  }

  const handleRemoveParticipant = (participant: string) => {
    setNewAchievement(prev => ({ ...prev, participants: prev.participants.filter(p => p !== participant) }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAchievement(prev => ({ ...prev, photo: e.target.files![0] }))
    }
  }

  const handleSubmitAchievement = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New Achievement:', newAchievement)
    // Here you would typically send the data to your backend
    setShowAddAchievementModal(false)
    // Reset form
    setNewAchievement({
      name: '',
      description: '',
      participants: [],
      placement: '',
      linkedInLink: '',
      year: '',
      photo: null,
    })
  }

  const defaultImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'

  const achievements = useMemo(
    () => [
      {
        name: 'National Robotics Challenge',
        category: 'Robotics & Control',
        mentors: ['Eng. Priyanka Silva'],
        participants: ['Ayesh Perera', 'Dilsha Fernando', 'Ravindu Jayasinghe'],
        placement: 'Champion',
        year: '2025',
        link: 'https://www.linkedin.com',
        image: 'https://images.unsplash.com/photo-1582719478248-54e9f2af76ae?auto=format&fit=crop&w=1200&q=80',
        description: 'Autonomous robot designed for dynamic obstacle navigation and precision task execution.',
      },
      {
        name: 'Smart City Hackathon',
        category: 'Software & IoT',
        mentors: ['Dr. Malith Rodrigo'],
        participants: ['Shenal Dias', 'Upeka Fernando', 'Naduni de Silva'],
        placement: '1st Runner-up',
        year: '2024',
        link: 'https://www.linkedin.com',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        description: 'Built a city-ops command center with live IoT telemetry, congestion insights, and rapid alerting.',
      },
      {
        name: 'Green Energy Design Sprint',
        category: 'Electrical & Sustainability',
        mentors: ['Eng. Kasun Samarasinghe'],
        participants: ['Dineth Jayawardena', 'Buwaneka Weerakoon'],
        placement: '2nd Runner-up',
        year: '2024',
        link: 'https://www.linkedin.com',
        image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
        description: 'Designed a microgrid-ready inverter with smart load balancing for campus-scale deployment.',
      },
      {
        name: 'AI for Good Challenge',
        category: 'Machine Learning & AI',
        mentors: ['Dr. Harini Wijesinghe'],
        participants: ['Ishara Senanayake', 'Thivanka Gunasekara'],
        placement: 'Top 5 Finalist',
        year: '2023',
        link: 'https://www.linkedin.com',
        image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        description: 'Built a responsible AI pipeline for anomaly detection with transparent model monitoring.',
      },
    ],
    []
  )

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
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <div className="container mx-auto px-6">
          <div className="mb-10">
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
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Achievement
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg text-center">
              Competitions we have entered, mentored, and conquered — showcasing our cross-disciplinary engineering strength.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {achievements.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="relative w-full overflow-hidden bg-slate-100 aspect-[4/3]">
                  <Image
                    src={item.image || defaultImage}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-6"
                    priority={false}
                  />
                </div>
                <div className="relative p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-700/80">{item.category}</p>
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">{item.name}</h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-3 py-1 text-sm font-semibold border border-sky-200">
                      {item.year}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-emerald-500"></span>
                      <div>
                        <p className="font-semibold text-slate-900">Mentors</p>
                        <p className="text-slate-600">{item.mentors.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-amber-500"></span>
                      <div>
                        <p className="font-semibold text-slate-900">Participants</p>
                        <p className="text-slate-600">{item.participants.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-[6px] h-2 w-2 rounded-full bg-sky-500"></span>
                      <div>
                        <p className="font-semibold text-slate-900">Placement</p>
                        <p className="text-slate-600">{item.placement}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-500">Verified highlight</span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-sky-500 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5Zm-9 17H7V9h3v8Zm-1.5-9.14c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.75 1.75-1.75s1.75.78 1.75 1.75c0 .97-.78 1.76-1.75 1.76Zm11.5 9.14h-3v-4.15c0-.99-.02-2.26-1.38-2.26-1.38 0-1.6 1.07-1.6 2.18V17h-3V9h2.88v1.09h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2.01 3.6 4.63V17Z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Achievement Modal */}
      {showAddAchievementModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Admin Panel</p>
                <h3 className="text-xl font-semibold text-gray-900">Add New Achievement</h3>
              </div>
              <button
                onClick={() => setShowAddAchievementModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitAchievement} className="p-6 space-y-5">
              {/* Competition Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="competitionName">
                  Competition Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="competitionName"
                  type="text"
                  required
                  value={newAchievement.name}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="Enter competition name"
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
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="Describe the achievement..."
                />
              </div>

              {/* Participants */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">
                  Participants <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={(e) => {
                    handleAddParticipant(e.target.value)
                    e.target.value = ''
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                >
                  <option value="">Select participants...</option>
                  {registeredUsers.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newAchievement.participants.map(participant => (
                    <span
                      key={participant}
                      className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {participant}
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(participant)}
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

              {/* Placement and Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="placement">
                    Placement <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="placement"
                    type="text"
                    required
                    value={newAchievement.placement}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, placement: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., Champion, 1st Runner-up"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="year">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="year"
                    type="text"
                    required
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="2026"
                  />
                </div>
              </div>

              {/* LinkedIn Post Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="linkedInLink">
                  LinkedIn Post Link
                </label>
                <input
                  id="linkedInLink"
                  type="url"
                  value={newAchievement.linkedInLink}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, linkedInLink: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="https://linkedin.com/posts/..."
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="photo">
                  Competition Photo <span className="text-red-500">*</span>
                </label>
                <input
                  id="photo"
                  type="file"
                  required
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
                {newAchievement.photo && (
                  <p className="text-sm text-gray-600">Selected: {newAchievement.photo.name}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddAchievementModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  Add Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => setShowSignInModal(false)}
      />
    </>
  )
}
