'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone } from 'lucide-react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
}

const ComingSoonModal = ({ isOpen, onClose, serviceName }: ComingSoonModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{serviceName}</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                    Coming Soon
                  </span>
                  <p className="text-gray-600 text-base">
                    We're working hard to bring you <span className="font-semibold text-gray-900">{serviceName}</span>. 
                    Get in touch with us for more information or to be notified when we launch.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Us</h3>
                  
                  <div className="space-y-3">
                    <a
                      href="mailto:contact@ves.lk"
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">contact@vesco.lk</span>
                    </a>
                    
                    <a
                      href="tel:0711103585"
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">0711103585</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ComingSoonModal
