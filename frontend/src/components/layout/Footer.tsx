'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const services = [
    {
      title: 'Web Development',
      detail: 'Full-stack experiences, portals, and dashboards built to scale.',
      icon: '/web_development.png',
      accent: 'from-sky-500/15 via-blue-500/10 to-cyan-400/15',
    },
    {
      title: 'Software Services',
      detail: 'Custom applications, integrations, and workflow automation.',
      icon: '/web_development.png',
      accent: 'from-blue-500/15 via-blue-400/10 to-sky-400/15',
    },
    {
      title: 'Electronic Circuit Designs',
      detail: 'PCBs, control systems, and rapid prototyping tuned for reliability.',
      icon: '/electronic.png',
      accent: 'from-emerald-500/12 via-emerald-400/10 to-lime-400/12',
    },
    {
      title: 'Electrical Services',
      detail: 'Power distribution, commissioning, and dependable maintenance.',
      icon: '/electrical.png',
      accent: 'from-purple-500/12 via-indigo-500/10 to-blue-500/12',
    },
    {
      title: 'Machine Learning & AI',
      detail: 'Data pipelines, predictive models, and smart automation.',
      icon: '/ai.png',
      accent: 'from-indigo-500/12 via-violet-500/10 to-sky-400/12',
    },
    {
      title: 'Mechanical & Manufacturing',
      detail: 'Product design, fabrication, and small-batch builds.',
      icon: '/mechanical.png',
      accent: 'from-amber-500/12 via-orange-500/10 to-rose-400/12',
    },
    {
      title: 'IoT Services',
      detail: 'Sensing, connectivity, and edge-to-cloud visibility for devices.',
      icon: '/iot_6080697.png',
      accent: 'from-teal-500/12 via-cyan-500/10 to-emerald-400/12',
    },
  ]

  return (
    <>
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Need Engineering Solutions?
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            We're ready to bring your projects to life with innovative technology and expertise.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Services spotlight */}
      <section className="relative bg-black text-white py-14">
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(8,47,73,0.25),transparent_30%),radial-gradient(circle_at_60%_70%,rgba(34,197,94,0.14),transparent_26%)]" aria-hidden></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-2xl mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-sky-200/80 mb-2">Services</p>
            <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-white">What we build and deliver</h3>
            <p className="text-gray-300 text-base md:text-lg">Focused engineering from software to hardware with connected, reliable systems.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md p-[1px] shadow-lg"
              >
                <div className="relative h-full rounded-[9px] bg-gradient-to-br from-white/5 to-white/0 p-4 md:p-5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} blur-2xl opacity-75`} aria-hidden></div>
                  <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Image src={service.icon} alt={service.title} width={36} height={36} className="h-9 w-9 object-contain" />
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-sky-200/90">Signature</span>
                        <h4 className="text-lg font-semibold text-white leading-snug">{service.title}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{service.detail}</p>
                    <div className="flex items-center gap-2 text-sky-200 text-sm font-semibold">
                      <span className="inline-block h-[1px] w-8 bg-sky-300/80"></span>
                      <span>Learn more</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2">&copy; {currentYear} Team VESCO. All rights reserved.</p>
          <p className="text-gray-400">Visionary Engineers Shaping Creative Opportunities</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
