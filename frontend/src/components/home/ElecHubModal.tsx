'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Calculator,
  ShieldCheck,
  Network,
  Box,
  BarChart3,
  Volume2,
  VolumeX,
  Mail,
  Phone,
  FileText,
  Loader2,
  CheckCircle2,
  Target,
  ArrowLeft
} from 'lucide-react'

interface ElecHubModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ElecHubModal({ isOpen, onClose }: ElecHubModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDescription) {
          setShowDescription(false)
          if (videoRef.current) {
            videoRef.current.play().catch(() => {})
          }
        } else {
          onClose()
        }
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, showDescription, onClose])

  // Reset video state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowDescription(false)
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsVideoReady(true))
            .catch(() => {
              // Browser autoplay policy fallback
            })
        }
      }
    } else {
      setIsVideoReady(false)
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isOpen])

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  const handleOpenDescription = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setShowDescription(true)
  }

  const handleCloseDescription = () => {
    setShowDescription(false)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const features = [
    {
      icon: Calculator,
      title: 'Load Calculations',
      desc: 'Accurate demand calculations, diversity factors, and real-time electrical load balancing.',
      badge: 'Core Engine'
    },
    {
      icon: ShieldCheck,
      title: 'BS 7671 Verification',
      desc: 'Circuit breaker & cable selection in strict accordance with BS 7671 standards, with fully documented verification steps.',
      badge: 'Standards Compliant'
    },
    {
      icon: Network,
      title: 'Single Line Diagram (SLD)',
      desc: 'Automatic generation of single line schematics using standardized electrical engineering symbols.',
      badge: 'Auto Schematics'
    },
    {
      icon: Box,
      title: '3D Visualisation',
      desc: 'Interactive 3D model visualisation of cable installation methods, raceways, and spatial clearances.',
      badge: 'Spatial 3D'
    },
    {
      icon: BarChart3,
      title: 'Estimates & Project Management',
      desc: "Integrated Engineer's Estimates, Bills of Quantities (BOQ), and seamless project workflow coordination.",
      badge: 'End-to-End'
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Main Video Preview Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100"
          >
            {/* Header */}
            <div className="px-5 sm:px-7 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    ELEC-HUB
                  </h2>
                  <span className="hidden sm:inline text-slate-600 font-light">|</span>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-400 uppercase">
                    Software Launch Preview
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Faculty of Engineering, University of Ruhuna{' '}
                  <span className="text-slate-600">•</span>{' '}
                  <span className="hidden sm:inline">Dept. of Electrical & Information Engineering</span>
                  <span className="sm:hidden">Dept. of EIE</span>
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Card */}
            <div className="p-3 sm:p-5 bg-slate-950">
              <div className="aspect-video w-full relative bg-black rounded-xl overflow-hidden border border-slate-800/80 shadow-inner">
                {/* Smooth Loading Spinner */}
                {!isVideoReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 transition-opacity">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-400 mt-2 font-medium">Loading preview...</span>
                  </div>
                )}

                <video
                  ref={videoRef}
                  src="/elechub.mp4"
                  preload="auto"
                  controls
                  playsInline
                  autoPlay
                  muted={isMuted}
                  loop
                  onCanPlay={() => setIsVideoReady(true)}
                  onLoadedData={() => setIsVideoReady(true)}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    isVideoReady ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Sound Toggle Floating Button */}
                <button
                  onClick={toggleSound}
                  className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-900 border border-white/20 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>Click for Sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Esc</kbd> to exit preview
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handleOpenDescription}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Description</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition-colors border border-slate-700 whitespace-nowrap"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>

          {/* Description Pop-up Modal */}
          <AnimatePresence>
            {showDescription && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleCloseDescription}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Pop-up Panel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                  className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 text-gray-900"
                >
                  {/* Pop-up Header */}
                  <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl sm:text-2xl font-bold text-black">
                          ELEC-HUB
                        </h3>
                        <span className="text-xs sm:text-sm font-bold text-black px-2.5 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                          Platform Description
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">
                        Faculty of Engineering, University of Ruhuna • Dept. of Electrical & Information Engineering
                      </p>
                    </div>

                    <button
                      onClick={handleCloseDescription}
                      aria-label="Close description"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-black" />
                    </button>
                  </div>

                  {/* Pop-up Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {/* Platform Overview */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <h4 className="text-base font-bold text-black mb-2">
                        Integrated Electrical Installation Design Software
                      </h4>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        We are excited to introduce <span className="font-bold text-black">ELEC-HUB</span>, an integrated electrical installation design platform developed by the undergraduates of the <span className="font-bold text-black">Department of Electrical and Information Engineering, Faculty of Engineering, University of Ruhuna</span>.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-2 font-medium">
                        ELEC-HUB brings the essential stages of electrical engineering design into one unified, intelligent, and standards-compliant system.
                      </p>
                    </div>

                    {/* Essential Workflow Stages */}
                    <div>
                      <h4 className="text-base font-bold text-black mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-black" />
                        Essential Workflow Stages & Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {features.map((item) => {
                          const Icon = item.icon
                          return (
                            <div
                              key={item.title}
                              className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 transition-colors flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2.5">
                                  <div className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-black">
                                    <Icon className="w-4 h-4 text-black" />
                                  </div>
                                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-black">
                                    {item.badge}
                                  </span>
                                </div>
                                <h5 className="font-bold text-black text-sm mb-1">
                                  {item.title}
                                </h5>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
                      <h4 className="text-sm font-bold text-black mb-1.5 flex items-center gap-2">
                        <Target className="w-4 h-4 text-black" />
                        Our Mission & Vision
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Our goal is to make standards-compliant electrical design faster, clearer, more efficient, and more accessible for engineering students and industry professionals across Sri Lanka.
                      </p>
                    </div>

                    {/* Inquiries & Collaboration Strip */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h5 className="font-bold text-black text-sm sm:text-base">
                          Are you interested in ELEC-HUB?
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
                          For more details or inquiries, feel free to contact us via email or phone.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                        <a
                          href="mailto:contact@vesco.lk?subject=ELEC-HUB%20Software%20Inquiry"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-sm whitespace-nowrap shrink-0"
                        >
                          <Mail className="w-4 h-4 shrink-0 text-white" />
                          <span className="whitespace-nowrap">Inquire Now</span>
                        </a>

                        <a
                          href="tel:0711103585"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-black font-medium text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
                        >
                          <Phone className="w-4 h-4 shrink-0 text-black" />
                          <span className="whitespace-nowrap">0711103585</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Pop-up Footer */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={handleCloseDescription}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-black font-medium text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-black" />
                      <span>Back to Video</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowDescription(false)
                        onClose()
                      }}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  )
}
