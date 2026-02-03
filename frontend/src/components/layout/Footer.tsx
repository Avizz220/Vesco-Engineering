'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  return (
    <>
      {/* CTA Section */}
      <section className="relative overflow-hidden text-white py-10 sm:py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900" />
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Need Engineering Solutions?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 px-2">
            We're ready to bring your projects to life with innovative technology and expertise.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-center">
          <p className="text-base sm:text-lg mb-2 inline-flex items-center gap-3 flex-wrap justify-center">
            &copy; {currentYear} Team <span className="text-white font-bold">VES</span>. All rights reserved.
            <Image
              src="/WITH TEXT.png"
              alt="VES logo"
              width={90}
              height={90}
              className="h-14 w-auto"
            />
          </p>
          <p className="text-sm sm:text-base text-gray-400">Vincere Engineering Services</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
