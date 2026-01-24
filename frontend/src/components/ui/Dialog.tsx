'use client'

import React from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'confirm'
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

const Dialog: React.FC<DialogProps> = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null

  const isConfirmDialog = type === 'confirm'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
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
            ) : type === 'error' ? (
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* Buttons */}
        {isConfirmDialog ? (
          <div className="flex gap-3">
            <button
              onClick={onCancel || onClose}
              className="flex-1 font-semibold py-3 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 font-semibold py-3 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white"
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`w-full font-semibold py-3 rounded-lg transition-colors ${
              type === 'success'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Dialog
