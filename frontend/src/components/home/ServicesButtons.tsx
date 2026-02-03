'use client'

import { useState } from 'react'
import ComingSoonModal from './ComingSoonModal'

interface ServicesButtonsProps {
  className?: string
}

const ServicesButtons = ({ className }: ServicesButtonsProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
    setShowComingSoonModal(true)
  }

  return (
    <>
      <div className={className}>
        <button
          onClick={() => handleServiceClick('Prime Tronics')}
          className="bg-blue-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          Prime Tronics
        </button>
        <button
          onClick={() => handleServiceClick('ElecHub')}
          className="bg-blue-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          ElecHub
        </button>
      </div>

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        serviceName={selectedService}
      />
    </>
  )
}

export default ServicesButtons
