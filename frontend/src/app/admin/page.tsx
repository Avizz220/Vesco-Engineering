'use client'

import STATIC_PROJECTS from '@/data/projects'
import STATIC_ACHIEVEMENTS from '@/data/achievements'
import STATIC_TEAM_MEMBERS from '@/data/team'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-slate-50">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Projects</h3>
            <p className="text-3xl font-bold text-primary-600">{STATIC_PROJECTS.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Achievements</h3>
            <p className="text-3xl font-bold text-secondary-600">{STATIC_ACHIEVEMENTS.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Team Members</h3>
            <p className="text-3xl font-bold text-green-600">{STATIC_TEAM_MEMBERS.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
