'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import SignInModal from '@/components/auth/SignInModal'
import SignUpModal from '@/components/auth/SignUpModal'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', protected: false },
    { href: '/projects', label: 'Projects', protected: true },
    { href: '/achievements', label: 'Achievements', protected: true },
    { href: '/team', label: 'Team', protected: true },
    { href: '/contact', label: 'Contact', protected: true },
    { href: '/admin', label: 'Admin', protected: true },
  ]

  const handleNavClick = (href: string, isProtected: boolean) => {
    if (href === '/') {
      router.push('/')
      return
    }

    if (isProtected && !isAuthenticated) {
      setShowSignInModal(true)
      router.push('/')
      return
    }

    router.push(href)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              VESCO
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, !!link.protected)}
                  className={`text-lg font-medium transition-colors hover:text-primary-600 ${
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="px-6 py-2.5 text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => {
          setShowSignInModal(false)
          setShowSignUpModal(true)
        }}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false)
          setShowSignInModal(true)
        }}
      />
    </>
  )
}

export default Navbar

