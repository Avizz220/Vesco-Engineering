'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { TeamMember } from '@/types'
import { useState } from 'react'
import { IMAGE_URL_PREFIX } from '@/lib/api'

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  isOwnProfile?: boolean
  isAdmin?: boolean
  onEdit?: (member: TeamMember) => void
  onDelete?: (memberId: string) => void
  onViewProjects?: (memberName: string) => void
}

const TeamMemberCard = ({ member, index, isOwnProfile, isAdmin, onEdit, onDelete, onViewProjects }: TeamMemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100"
    >
      {/* Member Image */}
      <div className="relative h-80 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {member.imageUrl ? (
          <Image
            src={member.imageUrl.startsWith('http') ? member.imageUrl : `${IMAGE_URL_PREFIX}${member.imageUrl}`}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <svg
              className="w-32 h-32 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
        {/* Role Badge */}
        <div className="absolute top-4 right-4 bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
          {member.role}
        </div>
        
        {/* Edit Button for Own Profile */}
        {isOwnProfile && onEdit && (
          <button
            onClick={() => onEdit(member)}
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-blue-50 transition-colors z-10"
            title="Edit Your Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-blue-600">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}

        {/* Delete Button for Admins (including their own profile) */}
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(member.id)}
            className="absolute bottom-4 left-4 bg-red-500/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-red-600 transition-colors z-10"
            title="Delete Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Member Info */}
      <div className="p-6">
        {/* Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {member.name}
        </h3>

        {/* Role Subtext */}
        <p className="text-blue-600 font-semibold mb-3 text-sm">
          {member.role}
        </p>

        {/* Bio */}
        {member.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {member.bio}
          </p>
        )}

        {/* Joined Date */}
        {member.joinedDate && (
          <p className="text-gray-500 text-xs mb-4">
            Joined: {new Date(member.joinedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </p>
        )}

        {/* Social Links */}
        <div className="flex gap-2 pt-4 border-t border-blue-100 mb-4">
          {/* LinkedIn */}
          {member.linkedinUrl && (
            <Link
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              title="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </Link>
          )}

          {/* GitHub */}
          {member.githubUrl && (
            <Link
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          )}

          {/* Email */}
          {member.email && (
            <Link
              href={`mailto:${member.email}`}
              className="flex-1 flex items-center justify-center bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              title="Send Email"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </Link>
          )}
        </div>

        {/* View Projects Button */}
        <button
          onClick={() => onViewProjects?.(member.name)}
          className="w-full block text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 transform hover:scale-105 shadow-sm hover:shadow-md"
        >
          View Projects
        </button>
      </div>
    </motion.div>
  )
}

export default TeamMemberCard
