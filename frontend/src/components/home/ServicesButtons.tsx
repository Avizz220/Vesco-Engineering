'use client'

import { useState } from 'react'
import ComingSoonModal from './ComingSoonModal'

const ServicesButtons = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName)
    setShowComingSoonModal(true)
  }

  return (
    <>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-gray-700 font-medium text-lg">Our Services:</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleServiceClick('Prime Tronics')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Prime Tronics
              </button>
              <button
                onClick={() => handleServiceClick('Elechub')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Elechub
              </button>
            </div>
          </div>
        </div>
      </section>

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        serviceName={selectedService}
      />
    </>
  )
}

export default ServicesButtons
