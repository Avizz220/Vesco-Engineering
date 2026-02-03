"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import roboticImg from "@/assets/robotic.jpg"
import { API_URL, IMAGE_URL_PREFIX } from "@/lib/api"

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.35, ease: "easeIn" } },
}

export default function ProjectSlider() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const length = projects.length

  const MAX_DESCRIPTION_CHARS = 200

  const truncateDescriptionByChars = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return { text, isTruncated: false }
    return {
      text: text.substring(0, maxChars).trim() + "...",
      isTruncated: true,
    }
  }

  const handleViewMore = (projectId: string) => {
    sessionStorage.setItem("openProjectId", projectId)
    router.push("/projects")
  }

  // Fetch real projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL}/projects`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()

        if (data.success && data.projects.length > 0) {
          const transformedProjects = data.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl
              ? project.imageUrl.startsWith("http")
                ? project.imageUrl
                : `${IMAGE_URL_PREFIX}${project.imageUrl}`
              : roboticImg.src,
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
          }))

          const seedProjectKeywords = [
            "autonomous robot",
            "smart home",
            "e-commerce",
            "autonomous inspection",
            "drone",
            "sample",
            "test",
            "demo",
          ]

          const realProjects = transformedProjects.filter((project: Project) => {
            const titleLower = project.title.toLowerCase()
            const descLower = project.description.toLowerCase()
            return !seedProjectKeywords.some(
              (keyword) => titleLower.includes(keyword) || descLower.includes(keyword)
            )
          })

          setProjects(realProjects)
          setIndex(0)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Keep fallback projects if fetch fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const current = useMemo(() => projects[index], [index, projects])

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % length)
    }, 4200)
    return () => clearInterval(id)
  }, [length])

  const goTo = (i: number) => setIndex((i + length) % length)

  if (isLoading || projects.length === 0) {
    return null
  }

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900" />
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-blue-200">Featured Work</p>
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white mt-1">A glimpse into our builds</h2>
            <p className="text-blue-100 mt-1.5 sm:mt-2 max-w-2xl text-sm md:text-base">
              Real engineering outcomes across autonomy, energy, control, and robotics—crafted for reliability and scale.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Previous project"
              onClick={() => goTo(index - 1)}
              className="h-10 w-10 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              aria-label="Next project"
              onClick={() => goTo(index + 1)}
              className="h-10 w-10 rounded-full bg-white text-slate-900 hover:bg-blue-50 transition shadow-lg"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="order-2 md:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-100 text-xs font-semibold">
                    Live delivery
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 sm:mt-3">{current.title}</h3>
                  <p className="text-blue-100 mt-1.5 sm:mt-2 leading-relaxed text-sm md:text-base">
                    {truncateDescriptionByChars(current.description, MAX_DESCRIPTION_CHARS).text}
                  </p>
                  {truncateDescriptionByChars(current.description, MAX_DESCRIPTION_CHARS).isTruncated && (
                    <button
                      onClick={() => handleViewMore(current.id)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition"
                    >
                      View More
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                    {current.technologies.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.imageUrl}
                    className="relative h-full w-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.35, ease: "easeIn" } }}
                  >
                    <Image
                      src={current.imageUrl}
                      alt={current.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={current.imageUrl.includes('localhost:5000')}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = roboticImg.src
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 flex justify-center gap-2 sm:gap-3">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
