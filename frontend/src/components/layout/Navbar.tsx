'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout, updateProfile, changePassword, refreshUserProfile } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Refresh user profile when navbar mounts to get latest image
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUserProfile()
    }
  }, [isAuthenticated])

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

  // Load lottie-player and initialize profile data when settings modal is opened
  useEffect(() => {
    if (!showSettingsModal) return
    if (typeof window === 'undefined') return
    
    // Reset edit mode and initialize profile data from user
    setIsEditingProfile(false)
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      })
    }
    
    const scriptId = 'lottie-player'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [showSettingsModal, user])

  const navLinks = [
    { href: '/', label: 'Home', protected: false },
    { href: '/projects', label: 'Projects', protected: false },
    { href: '/achievements', label: 'Achievements', protected: false },
    { href: '/courses', label: 'Courses', protected: true, hidden: true },
    { href: '/team', label: 'Team', protected: false },
    { href: '/#services', label: 'Services', protected: false },
    { href: '/contact', label: 'Contact', protected: false },
  ]

  // Helper function to get the correct profile image URL
  const getProfileImageUrl = () => {
    if (!user?.image) return "/profilepic.png"
    
    // If it's a full URL (Google image or external), use as is
    if (user.image.startsWith('http://') || user.image.startsWith('https://')) {
      return user.image
    }
    
    // If it's a relative path (uploaded image), prepend the API URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
    return `${baseUrl}${user.image}`
  }

  const handleNavClick = (href: string, isProtected: boolean) => {
    if (href === '/') {
      router.push('/')
      return
    }

    // Handle services anchor link
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
            <Link href="/" className="text-3xl font-bold hover:opacity-90 transition-all flex items-center gap-3">
              <span className="text-primary-600">VES</span>
              <Image
                src="/WITH TEXT.png"
                alt="VES logo"
                width={120}
                height={120}
                className="h-16 w-auto"
                priority
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
              {navLinks.filter(link => !link.hidden).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => {
                    if (link.protected && !isAuthenticated) {
                      e.preventDefault()
                      setShowSignInModal(true)
                      router.push('/')
                    }
                  }}
                  className={`text-base xl:text-lg font-medium transition-colors hover:text-primary-600 ${
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => user?.isGoogleUser ? setShowProfileModal(true) : setShowSettingsModal(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <img 
                      src={getProfileImageUrl()} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">{user?.name}</span>
                  </button>
                  {!user?.isGoogleUser && (
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
                  )}
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="px-4 xl:px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowSignInModal(true)}
                    className="px-4 xl:px-6 py-2.5 text-gray-700 font-medium hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="px-4 xl:px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-700"
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

      {/*  Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-white">
          <div className="container mx-auto px-6 py-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-3xl font-bold hover:opacity-90 transition-all flex items-center gap-3">
                <span className="text-primary-600">VES</span>
                <Image
                  src="/WITH TEXT.png"
                  alt="VES logo"
                  width={180}
                  height={120}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700"
                aria-label="Close mobile menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-6 mb-8">
              {navLinks.filter(link => !link.hidden).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => {
                    if (link.protected && !isAuthenticated) {
                      e.preventDefault()
                      setShowSignInModal(true)
                      setIsMobileMenuOpen(false)
                      router.push('/')
                    } else {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                  className={`text-xl font-medium transition-colors hover:text-primary-600 ${
                    pathname === link.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      user?.isGoogleUser ? setShowProfileModal(true) : setShowSettingsModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <img 
                      src={getProfileImageUrl()} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-black font-medium text-base">{user?.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowSignInModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:text-primary-600 hover:border-primary-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setShowSignUpModal(true)
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8 max-h-[85vh]">
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

            <div className="grid md:grid-cols-2 gap-0" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {/* LEFT: Profile Information Section with Scrolling */}
              <div className="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                {/* Profile Picture - Centered at Top */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-primary-100">
                      <img 
                        src={getProfileImageUrl()} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                {/* Searching Profile Animation */}
                <div className="w-full max-w-[180px] mx-auto">
                  <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="/searching%20for%20profile%20(1).json"
                    style={{ height: '120px', width: '100%' }}
                  />
                </div>

                {/* Profile Edit Form */}
                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">Profile Information</p>
                  
                  <form
                    id="profile-form"
                    className="space-y-3"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setProfileMessage(null)
                      try {
                        await updateProfile({
                          name: profileData.name,
                          email: profileData.email,
                        })
                        setProfileMessage('Profile updated successfully! Please sign in again.')
                        setIsEditingProfile(false)
                        // Wait 2 seconds then logout
                        setTimeout(() => {
                          logout()
                          setShowSettingsModal(false)
                          router.push('/')
                        }, 2000)
                      } catch (error) {
                        setProfileMessage('Failed to update profile')
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-800" htmlFor="profileName">Full Name</label>
                      <input
                        id="profileName"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-800" htmlFor="profileEmail">Email Address</label>
                      <input
                        id="profileEmail"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    {profileMessage && (
                      <div className={`text-sm font-medium ${profileMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {profileMessage}
                      </div>
                    )}
                  </form>

                  {/* Edit/Save Profile Button - Shows at bottom */}
                  <div className="pt-3 pb-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        if (!isEditingProfile) {
                          setIsEditingProfile(true)
                          setProfileMessage(null)
                        } else {
                          const form = document.querySelector('form[id="profile-form"]') as HTMLFormElement
                          if (form) {
                            const event = new Event('submit', { bubbles: true, cancelable: true })
                            form.dispatchEvent(event)
                          }
                        }
                      }}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md"
                    >
                      {isEditingProfile ? 'Save Data' : 'Edit Data'}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT: Security/Password Section with Scrolling */}
              <div className="p-6 bg-white overflow-y-auto flex flex-col gap-3" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Security</p>
                    <h4 className="text-lg font-semibold text-gray-900">Change password</h4>
                    <p className="text-sm text-gray-600">Update your password to keep your account secure.</p>
                  </div>
                  <div className="hidden md:block h-16 w-16 flex-shrink-0">
                    <lottie-player
                      autoplay
                      loop
                      mode="normal"
                      src="/Forgot%20Password%20Animation.json"
                      style={{ height: '64px', width: '64px' }}
                    />
                  </div>
                </div>

                <div className="block md:hidden w-full">
                  <lottie-player
                    autoplay
                    loop
                    mode="normal"
                    src="/Forgot%20Password%20Animation.json"
                    style={{ height: '100px', width: '100%' }}
                  />
                </div>

                <form
                  className="space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setPasswordMessage(null)
                    
                    if (!currentPassword) {
                      setPasswordMessage('Please enter your current password.')
                      return
                    }
                    if (!newPassword || !confirmPassword) {
                      setPasswordMessage('Please enter and confirm your new password.')
                      return
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordMessage('New password and confirmation do not match.')
                      return
                    }
                    if (newPassword.length < 6) {
                      setPasswordMessage('New password must be at least 6 characters long.')
                      return
                    }

                    try {
                      await changePassword(currentPassword, newPassword)
                      setPasswordMessage('Password changed successfully! Please sign in again with your new password.')
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      // Wait 2 seconds then logout
                      setTimeout(() => {
                        logout()
                        setShowSettingsModal(false)
                        router.push('/')
                      }, 2000)
                    } catch (error: any) {
                      setPasswordMessage(error.message || 'Failed to update password')
                    }
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="currentPassword">Current password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="newPassword">New password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-800" htmlFor="confirmPassword">Confirm new password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                    />
                  </div>

                  {passwordMessage && (
                    <p className={`text-sm rounded-lg px-3 py-2 ${
                      passwordMessage.includes('success') || passwordMessage.includes('successfully')
                        ? 'text-green-700 bg-green-50 border border-green-200'
                        : 'text-red-700 bg-red-50 border border-red-200'
                    }`}>
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

                {/* Reset Password via Email */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordMessage('Password reset email sent to ' + user?.email)
                    }}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Reset password via email
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">We'll send you a link to reset your password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal for Google Users (Read-only) - Enhanced UI */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-fadeIn">
            {/* Header with Gradient Background */}
            <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-5 text-white">
              {/* Close Button */}
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Profile Section */}
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture with Ring */}
                <div className="relative mb-3">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-3 border-white shadow-xl ring-2 ring-blue-400/50">
                    <img 
                      src="/profilepic.png" 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-green-500 border-3 border-white shadow-md"></div>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-bold mb-0.5 tracking-tight">{user?.name}</h2>
                <p className="text-blue-100 text-xs font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {/* Google Account Badge - Enhanced with colored icon */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                {/* Colored Google Icon */}
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Google Account</p>
                  <p className="text-xs text-gray-500">Signed in with Google</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="bg-white border-2 border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Account Details</h3>
                </div>
                
                <div className="space-y-2">
                  {/* Full Name */}
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Security</p>
                      <p className="text-sm font-bold text-green-700">Protected by Google</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-blue-900 font-medium">Account Management</p>
                  <p className="text-xs text-blue-700 leading-relaxed mt-0.5">
                    Managed through your Google Account settings.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
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

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout()
                    setShowLogoutConfirm(false)
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

