'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2">&copy; {currentYear} Team <span className="text-white font-bold">VES</span><span className="text-base text-orange-400">CO</span>. All rights reserved.</p>
          <p className="text-gray-400">Visionary Engineers Shaping Creative Opportunities</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
