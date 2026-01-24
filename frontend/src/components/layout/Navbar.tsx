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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    github: '',
    linkedin: '',
    position: '',
  })
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout, updateProfile } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        github: user.github || '',
        linkedin: user.linkedin || '',
        position: user.position || '',
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
    { href: '/projects', label: 'Projects', protected: true },
    { href: '/achievements', label: 'Achievements', protected: true },
    { href: '/courses', label: 'Courses', protected: true },
    { href: '/team', label: 'Team', protected: true },
    { href: '/contact', label: 'Contact', protected: true },
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
                  className={`text-lg font-medium transition-colors hover:text-primary-600 ${
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
                    onClick={() => setShowLogoutConfirm(true)}
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
                          github: profileData.github,
                          linkedin: profileData.linkedin,
                          position: profileData.position,
                        })
                        setProfileMessage('Profile updated successfully!')
                        setIsEditingProfile(false)
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
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-800" htmlFor="profilePosition">Position</label>
                      <input
                        id="profilePosition"
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-800" htmlFor="profileGithub">GitHub Profile</label>
                      <input
                        id="profileGithub"
                        type="url"
                        value={profileData.github}
                        onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-800" htmlFor="profileLinkedin">LinkedIn Profile</label>
                      <input
                        id="profileLinkedin"
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                        disabled={!isEditingProfile}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="https://linkedin.com/in/username"
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

