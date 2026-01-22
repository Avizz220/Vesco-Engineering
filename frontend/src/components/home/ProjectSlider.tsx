"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import roboticImg from "@/assets/robotic.jpg"
import arduinoImg from "@/assets/arduino.jpg"
import aerospaceImg from "@/assets/aerospace.jpg"
import eieImg from "@/assets/eie.jpg"

const projects = [
  {
    title: "Autonomous Inspection Drone",
    blurb:
      "AI-guided aerial platform for precision inspections with live analytics and automated flight paths.",
    image: aerospaceImg.src,
    tech: ["AI/ML", "Computer Vision", "Edge Compute"],
  },
  {
    title: "Smart Robotics Lab",
    blurb:
      "Modular robotic stack with real-time sensing, ROS control, and human-in-the-loop safety layer.",
    image: roboticImg.src,
    tech: ["ROS", "LiDAR", "Python"],
  },
  {
    title: "IoT Energy Command",
    blurb:
      "Unified IoT control for renewable assets with predictive maintenance and adaptive load balancing.",
    image: arduinoImg.src,
    tech: ["IoT", "Predictive", "Realtime"],
  },
  {
    title: "Industrial Control Fabric",
    blurb:
      "High-availability control system with digital twins, secure OPC-UA bus, and KPI dashboards.",
    image: eieImg.src,
    tech: ["SCADA", "OPC-UA", "Dashboard"],
  },
]

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.35, ease: "easeIn" } },
}

export default function ProjectSlider() {
  const [index, setIndex] = useState(0)
  const length = projects.length

  const current = useMemo(() => projects[index], [index])

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % length)
    }, 4200)
    return () => clearInterval(id)
  }, [length])

  const goTo = (i: number) => setIndex((i + length) % length)

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900" />
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -right-10 top-6 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-200">Featured Work</p>
            <h2 className="text-3xl md:text-[34px] font-bold text-white mt-1">A glimpse into our builds</h2>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base">
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
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-100 text-xs font-semibold">
                    Live delivery
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-3">{current.title}</h3>
                  <p className="text-blue-100 mt-2 leading-relaxed text-sm md:text-base">{current.blurb}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {current.tech.map((tag) => (
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
                  <motion.img
                    key={current.image}
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.35, ease: "easeIn" } }}
                  />
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
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
