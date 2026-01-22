import Hero from '@/components/home/Hero'
import Stats from '@/components/home/Stats'
import About from '@/components/home/About'
import ProjectSlider from '@/components/home/ProjectSlider'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <ProjectSlider />
      <About />
    </main>
  )
}
