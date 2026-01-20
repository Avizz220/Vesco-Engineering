'use client'

import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <>
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interested in Joining Us?
          </h2>
          <p className="text-xl md:text-2xl mb-8">
            We're always looking for passionate individuals to join our team!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Get in Touch
          </Link>
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
