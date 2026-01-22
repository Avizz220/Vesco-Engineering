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
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
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

  // Load lottie-player only when settings modal is opened
  useEffect(() => {
    if (!showSettingsModal) return
    if (typeof window === 'undefined') return
    const scriptId = 'lottie-player'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [showSettingsModal])

  const navLinks = [
    { href: '/', label: 'Home', protected: false },
    { href: '/projects', label: 'Projects', protected: true },
    { href: '/achievements', label: 'Achievements', protected: true },
    { href: '/courses', label: 'Courses', protected: true },
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
                    onClick={() => setShowSettingsModal(true)}
                    className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                    aria-label="Open settings"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.89 3.31.877 2.42 2.42a1.724 1.724 0 0 0 1.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 0 0-1.065 2.572c.89 1.543-.877 3.31-2.42 2.42a1.724 1.724 0 0 0-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 0 0-2.573-1.065c-1.543.89-3.31-.877-2.42-2.42a1.724 1.724 0 0 0-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 0 0 1.065-2.572c-.89-1.543.877-3.31 2.42-2.42.996.575 2.248.16 2.573-1.066Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
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


      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Account</p>
                <h3 className="text-xl font-semibold text-gray-900">Profile & Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-6 flex flex-col items-center gap-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gradient-to-br from-slate-50 via-white to-sky-50">
                {/* Profile Picture - Centered at Top */}
                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-primary-100">
                      {user?.image ? (
                        <img src={user.image} alt={user.name || 'Profile'} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-primary-500 to-primary-700">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Searching Profile Animation */}
                <div className="w-full max-w-[200px]">
                  <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="/searching%20for%20profile%20(1).json"
                    style={{ height: '160px', width: '100%' }}
                  />
                </div>

                {/* Profile Details Card */}
                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">Account Details</p>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Full Name</span>
                      <span className="font-semibold text-gray-900">{user?.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Email Address</span>
                      <span className="font-medium text-gray-700 truncate ml-2">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">User ID</span>
                      <span className="font-mono text-xs text-gray-600">{user?.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Security</p>
                    <h4 className="text-lg font-semibold text-gray-900">Change password</h4>
                    <p className="text-sm text-gray-600">Update your password to keep your account secure.</p>
                  </div>
                  <div className="hidden md:block h-20 w-20">
                    <lottie-player
                      autoplay
                      loop
                      mode="normal"
                      src="/Forgot%20Password%20Animation.json"
                      style={{ height: '80px', width: '80px' }}
                    />
                  </div>
                </div>

                <div className="block md:hidden w-full">
                  <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="/Forgot%20Password%20Animation.json"
                    style={{ height: '120px', width: '100%' }}
                  />
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setPasswordMessage(null)
                    if (!newPassword || !confirmPassword) {
                      setPasswordMessage('Please enter and confirm your new password.')
                      return
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordMessage('New password and confirmation do not match.')
                      return
                    }
                    setPasswordMessage('Password updated (demo only).')
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="currentPassword">Current password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="newPassword">New password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="confirmPassword">Confirm new password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                      placeholder="Re-enter new password"
                    />
                  </div>

                  {passwordMessage && (
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      {passwordMessage}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                        setPasswordMessage(null)
                        setShowSettingsModal(false)
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-md"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
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

