'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live real-time clock updating every second
  useEffect(() => {
    setCurrentDateTime(new Date())
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Handle scroll to services section when navigating from other pages
  useEffect(() => {
    if (pathname === '/' && window.location.hash === '#services') {
      setTimeout(() => {
        const servicesSection = document.getElementById('services')
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [pathname])

  const formattedDate = currentDateTime
    ? currentDateTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const formattedTime = currentDateTime
    ? currentDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/#services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ]

  const handleNavClick = (href: string) => {
    if (href === '/') {
      router.push('/')
      return
    }

    if (href === '/#services') {
      if (pathname !== '/') {
        router.push('/#services')
      } else {
        const servicesSection = document.getElementById('services')
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      return
    }

    router.push(href)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-3xl font-bold hover:opacity-90 transition-all flex items-center gap-2 pl-0">
              <Image
                src="/WITH TEXT.png"
                alt="VES logo"
                width={420}
                height={140}
                className="h-12 sm:h-14 lg:h-16 w-auto origin-left scale-[1.45] sm:scale-[1.65] lg:scale-[1.8]"
                priority
              />
            </Link>

            {/* Navigation Links with more generous horizontal gap */}
            <div className="hidden lg:flex items-center space-x-12 xl:space-x-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => {
                    if (link.href === '/#services') {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }
                  }}
                  className={`text-base xl:text-lg font-medium transition-colors hover:text-primary-600 ${
                    pathname === link.href ? 'text-primary-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Date & Time Display without border or background pill */}
            <div className="hidden lg:flex items-center gap-2 text-sm xl:text-base font-medium select-none">
              <span className="font-semibold text-gray-900 tracking-tight">
                {formattedTime}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-600 whitespace-nowrap">
                {formattedDate}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-white">
          <div className="container mx-auto px-6 py-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-3xl font-bold hover:opacity-90 transition-all flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/WITH TEXT.png"
                  alt="VES logo"
                  width={480}
                  height={160}
                  className="h-24 sm:h-32 w-auto"
                  priority
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 p-2"
                aria-label="Close mobile menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-6 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false)
                    if (link.href === '/#services') {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }
                  }}
                  className={`text-xl font-medium transition-colors hover:text-primary-600 ${
                    pathname === link.href ? 'text-primary-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Date & Time */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-sm font-medium">
              <span className="font-semibold text-gray-900 tabular-nums">
                {formattedTime}
              </span>
              <span className="text-gray-500">
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
