'use client'

import { useState } from 'react'
import ComingSoonModal from './ComingSoonModal'
import ElecHubModal from './ElecHubModal'

interface ServicesButtonsProps {
  className?: string
}

const ServicesButtons = ({ className }: ServicesButtonsProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [showElecHubModal, setShowElecHubModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const handleServiceClick = (serviceName: string) => {
    if (serviceName === 'ElecHub') {
      setShowElecHubModal(true)
    } else {
      setSelectedService(serviceName)
      setShowComingSoonModal(true)
    }
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
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 w-full sm:w-auto flex items-center justify-center gap-2 border border-blue-400/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
          </span>
          <span>ElecHub</span>
        </button>
      </div>

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        serviceName={selectedService}
      />

      <ElecHubModal
        isOpen={showElecHubModal}
        onClose={() => setShowElecHubModal(false)}
      />

      {/* Hidden preloader for seamless instant video playback */}
      <video
        src="/elechub.mp4"
        preload="auto"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        playsInline
        muted
      />
    </>
  )
}

export default ServicesButtons
