'use client'

import { useEffect } from 'react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
  title?: string
}

export default function ErrorModal({ 
  isOpen, 
  onClose, 
  message = 'Something went wrong. Please try again.',
  title = 'Error'
}: ErrorModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2C3E87] bg-opacity-90"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center animate-scale-in">
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
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-[#2C3E87] mb-4">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8">
          {message}
        </p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          OK
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
