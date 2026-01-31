'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  return (
    <>
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 text-center">
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
          <p className="text-base sm:text-lg mb-2">&copy; {currentYear} Team <span className="text-white font-bold">VES</span><span className="text-sm sm:text-base text-orange-400">CO</span>. All rights reserved.</p>
          <p className="text-sm sm:text-base text-gray-400">Vincere Engineering Services</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
