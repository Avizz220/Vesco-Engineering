'use client'

import React from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error'
  title: string
  message: string
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {type === 'success' ? (
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className={`w-full font-semibold py-3 rounded-lg transition-colors ${
            type === 'success'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default Dialog
