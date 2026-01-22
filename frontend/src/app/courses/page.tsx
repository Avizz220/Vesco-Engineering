'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import SignInModal from '@/components/auth/SignInModal'

const SignInRequired = ({ onSignIn, onClose }: { onSignIn: () => void; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
    <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div className="mb-6">
        <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-3">Sign In Required</h3>
      <p className="text-gray-600 mb-8">Please sign in to view our courses and enrollment options</p>
      <button
        onClick={onSignIn}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        Sign In
      </button>
    </div>
  </div>
)

interface Course {
  title: string
  category: string
  instructor: string
  duration: string
  level: string
  price: string
  description: string
  image: string
  features: string[]
}

export default function CoursesPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [coursesList, setCoursesList] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    conductedBy: '',
    duration: '',
    learningOutcomes: '',
    courseFee: '',
  })
  const router = useRouter()

  const handleEditCourse = (index: number) => {
    const course = coursesList[index]
    setNewCourse({
      name: course.title,
      description: course.description,
      conductedBy: course.instructor,
      duration: course.duration,
      learningOutcomes: course.features.join(', '),
      courseFee: course.price,
    })
    setEditingIndex(index)
    setShowAddCourseModal(true)
  }

  const handleDeleteCourse = (index: number) => {
    setCoursesList(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Course Data:', newCourse)
    
    if (editingIndex !== null) {
      // Update existing course
      setCoursesList(prev => prev.map((item, i) => 
        i === editingIndex ? {
          ...item,
          title: newCourse.name,
          description: newCourse.description,
          instructor: newCourse.conductedBy,
          duration: newCourse.duration,
          features: newCourse.learningOutcomes.split(',').map(s => s.trim()),
          price: newCourse.courseFee,
        } : item
      ))
      setEditingIndex(null)
    } else {
      // Add new course
      const newItem: Course = {
        title: newCourse.name,
        description: newCourse.description,
        instructor: newCourse.conductedBy,
        duration: newCourse.duration,
        features: newCourse.learningOutcomes.split(',').map(s => s.trim()),
        price: newCourse.courseFee,
        category: 'New Course',
        level: 'Intermediate',
        image: defaultImage,
      }
      setCoursesList(prev => [...prev, newItem])
    }
    
    setShowAddCourseModal(false)
    setNewCourse({
      name: '',
      description: '',
      conductedBy: '',
      duration: '',
      learningOutcomes: '',
      courseFee: '',
    })
  }

  const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'

  const initialCourses = useMemo<Course[]>(
    () => [
      {
        title: 'Full-Stack Web Development',
        category: 'Software Development',
        instructor: 'Eng. Ravindu Perera',
        duration: '12 weeks',
        level: 'Intermediate',
        price: 'LKR 35,000',
        description: 'Master modern web development with React, Node.js, and MongoDB. Build real-world applications from scratch.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        features: ['React & Next.js', 'Node.js & Express', 'MongoDB & Database Design', 'API Development', 'Deployment & DevOps'],
      },
      {
        title: 'PCB Design & Prototyping',
        category: 'Electronics',
        instructor: 'Eng. Kasun Silva',
        duration: '8 weeks',
        level: 'Intermediate',
        price: 'LKR 28,000',
        description: 'Learn professional PCB design using industry-standard tools. From schematic to fabrication-ready boards.',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80',
        features: ['Altium Designer', 'Schematic Capture', 'PCB Layout', 'Signal Integrity', 'Manufacturing Files'],
      },
      {
        title: 'Machine Learning Fundamentals',
        category: 'Artificial Intelligence',
        instructor: 'Dr. Harini Wijesinghe',
        duration: '10 weeks',
        level: 'Advanced',
        price: 'LKR 42,000',
        description: 'Deep dive into ML algorithms, neural networks, and practical AI applications with Python.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
        features: ['Python & TensorFlow', 'Neural Networks', 'Computer Vision', 'NLP Basics', 'Real-world Projects'],
      },
      {
        title: 'IoT Systems Development',
        category: 'Internet of Things',
        instructor: 'Eng. Dilshan Fernando',
        duration: '6 weeks',
        level: 'Beginner',
        price: 'LKR 22,000',
        description: 'Build connected devices with Arduino, ESP32, and cloud platforms. Hands-on IoT project experience.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80',
        features: ['Arduino & ESP32', 'Sensor Integration', 'MQTT & Cloud', 'Mobile Apps', 'Real IoT Projects'],
      },
      {
        title: 'Robotics & Control Systems',
        category: 'Robotics',
        instructor: 'Eng. Priyanka Silva',
        duration: '14 weeks',
        level: 'Advanced',
        price: 'LKR 48,000',
        description: 'Advanced robotics covering kinematics, control theory, and autonomous navigation systems.',
        image: 'https://images.unsplash.com/photo-1563194228-9f5e3f7af4c3?auto=format&fit=crop&w=1200&q=80',
        features: ['ROS Framework', 'Motion Planning', 'Computer Vision', 'PID Control', 'Autonomous Navigation'],
      },
      {
        title: 'Power Electronics & Drives',
        category: 'Electrical Engineering',
        instructor: 'Eng. Malith Rodrigo',
        duration: '9 weeks',
        level: 'Intermediate',
        price: 'LKR 32,000',
        description: 'Master power conversion, motor drives, and renewable energy systems with practical labs.',
        image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
        features: ['Power Converters', 'Motor Control', 'Renewable Energy', 'MATLAB Simulations', 'Lab Projects'],
      },
    ],
    []
  )
  React.useEffect(() => {
    setCoursesList(initialCourses)
  }, [initialCourses])
  if (!authLoading && !isAuthenticated) {
    return (
      <>
        <SignInRequired
          onSignIn={() => setShowSignInModal(true)}
          onClose={() => router.push('/')}
        />
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSwitchToSignUp={() => setShowSignInModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-600/80 mb-3">Professional Training</p>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Our Courses</h1>
              </div>
              <div className="flex-1 flex justify-end">
                {user?.isAdmin && (
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Course
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg text-center">
              Expert-led courses designed by industry professionals. Learn cutting-edge skills with hands-on projects and real-world applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {coursesList.map((course, index) => (
              <div
                key={course.title + index}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative w-full overflow-hidden bg-slate-100 aspect-[4/3]">
                  <Image
                    src={course.image || defaultImage}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {user?.isAdmin && (
                      <>
                        <button
                          onClick={() => handleEditCourse(index)}
                          className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-sky-50 transition-colors"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-600">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(index)}
                          className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-red-600">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </>
                    )}
                    <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1 text-xs font-semibold shadow-md">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="relative p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-700/80 mb-1">{course.category}</p>
                      <h3 className="text-xl font-semibold text-slate-900 leading-snug">{course.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-emerald-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-slate-600">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-sky-500">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-slate-600">{course.duration}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-2">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">What you'll learn</p>
                    <ul className="space-y-1.5">
                      {course.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Course Fee</p>
                      <p className="text-2xl font-bold text-slate-900">{course.price}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-700">Enrollment</p>
                <h3 className="text-xl font-semibold text-gray-900">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
                <h4 className="text-base font-semibold text-slate-900 mb-1">Course Fee: {selectedCourse.price}</h4>
                <p className="text-sm text-slate-600">Duration: {selectedCourse.duration} • Instructor: {selectedCourse.instructor}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-900">How to Enroll</h4>
                <ol className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">1</span>
                    <span>Contact our course coordinator using the details below</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">2</span>
                    <span>Deposit the course fee to the provided bank account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">3</span>
                    <span>Send the payment slip/receipt to confirm your enrollment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-xs">4</span>
                    <span>Receive confirmation and course access details within 24 hours</span>
                  </li>
                </ol>
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-3">
                <h4 className="text-base font-semibold text-slate-900">Contact & Payment Details</h4>
                
                <div className="bg-slate-50 rounded-lg p-3 space-y-2.5">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Course Coordinator</p>
                      <p className="text-sm text-slate-600">Eng. Ravindu Jayasinghe</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="text-sm text-slate-600">+94 77 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary-600 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-sm text-slate-600">courses@teamvesco.lk</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-blue-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                    </svg>
                    Bank Account Details
                  </h5>
                  <div className="space-y-1.5 text-sm text-slate-700">
                    <p><span className="font-semibold">Bank:</span> Commercial Bank</p>
                    <p><span className="font-semibold">Account Name:</span> VESCO Engineering Team</p>
                    <p><span className="font-semibold">Account Number:</span> 1234567890</p>
                    <p><span className="font-semibold">Branch:</span> Colombo 07</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href="mailto:courses@teamvesco.lk"
                  className="px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-md"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-sky-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{editingIndex !== null ? 'Edit Course' : 'Add New Course'}</h3>
              </div>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="p-6 space-y-5">
              {/* Course Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="courseName">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="courseName"
                  type="text"
                  required
                  value={newCourse.name}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="Enter course name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="Describe the course..."
                />
              </div>

              {/* Conducted By and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="conductedBy">
                    Conducted By <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="conductedBy"
                    type="text"
                    required
                    value={newCourse.conductedBy}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, conductedBy: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., Eng. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800" htmlFor="duration">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="duration"
                    type="text"
                    required
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                    placeholder="e.g., 8 weeks"
                  />
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="learningOutcomes">
                  Learning Outcomes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="learningOutcomes"
                  required
                  value={newCourse.learningOutcomes}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, learningOutcomes: e.target.value }))}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                  placeholder="List the key learning outcomes (one per line or comma separated)"
                />
              </div>

              {/* Course Fee */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800" htmlFor="courseFee">
                  Course Fee <span className="text-red-500">*</span>
                </label>
                <input
                  id="courseFee"
                  type="text"
                  required
                  value={newCourse.courseFee}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, courseFee: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  placeholder="e.g., LKR 35,000"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-md"
                >
                  {editingIndex !== null ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSwitchToSignUp={() => setShowSignInModal(false)}
      />
    </>
  )
}
