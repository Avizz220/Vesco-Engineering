'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeIndex, setActiveIndex] = useState(0)

  const services = [
    { name: 'Web Development', image: '/web_dev.jpg' },
    { name: 'Software Services', image: '/software_service.jpg' },
    { name: 'Solid Work Designs', image: '/solid.png' },
    { name: 'Electrical Services', image: '/elec_service.jpg' },
    { name: 'Machine Learning & AI', image: '/ai_and_ml.jpg' },
    { name: 'IoT Services', image: '/iot_servicesjpg.jpg' },
  ]

  useEffect(() => {
    if (!inView) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [inView, services.length])

  return (
    <section id="services" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-700 leading-tight">
              Expertise Across Engineering Service Disciplines
            </h2>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="text-teal-700 font-semibold">VES</span><span className="text-orange-500 font-semibold text-base">CO</span> provides <span className="font-semibold">engineering service solutions</span> across a wide range of technical disciplines, ensuring the right expertise is available when and where your project needs it.
            </p>

            <div className="pt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Engineering Services Include:</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className={`flex items-center text-lg transition-all duration-500 ${
                      activeIndex === index 
                        ? 'text-blue-600 font-bold translate-x-2 scale-105' 
                        : 'text-gray-700 font-normal'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-4 transition-all duration-500 ${
                      activeIndex === index ? 'bg-blue-600 w-3 h-3' : 'bg-teal-600'
                    }`}></span>
                    {service.name}
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="text-gray-700 pt-4 leading-relaxed">
              Each service is delivered with <span className="font-semibold">industry experience, technical competence, and innovative solutions</span>.
            </p>
          </motion.div>

          {/* Right side - Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={services[activeIndex].image}
                  alt={services[activeIndex].name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Stats
