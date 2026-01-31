'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from '@/hooks/useInView'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: (
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Image
            src="/robot-hand.png"
            alt="Robotics & Automation"
            fill
            className="object-contain"
          />
        </div>
      ),
      title: 'Robotics & Automation',
      description: 'Building intelligent robots and automated systems for real-world applications.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Image
            src="/ai-robot.png"
            alt="Artificial Intelligence"
            fill
            className="object-contain"
          />
        </div>
      ),
      title: 'Artificial Intelligence',
      description: 'Developing AI-powered solutions to solve complex problems efficiently.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Image
            src="/market-research.png"
            alt="Innovation & Research"
            fill
            className="object-contain"
          />
        </div>
      ),
      title: 'Innovation & Research',
      description: 'Pioneering new technologies and conducting cutting-edge research.',
    },
    {
      icon: (
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <Image
            src="/growth.png"
            alt="Competition Success"
            fill
            className="object-contain"
          />
        </div>
      ),
      title: 'Competition Success',
      description: 'Consistently winning national and international engineering competitions.',
    },
  ]

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            About VES
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-orange-500 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            VES (Vincere Engineering Services) is a student-led engineering team
            committed to excellence, innovation, and making a positive impact through technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-4 sm:p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
            >
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 sm:p-8 md:p-12 border border-gray-200"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Our Mission</h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center">
              To empower students with practical engineering skills, foster innovation through collaborative
              projects, and contribute to society by developing technology-driven solutions. We believe in
              learning by doing, pushing boundaries, and inspiring the next generation of engineers.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
