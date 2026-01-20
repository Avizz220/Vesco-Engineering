import { useEffect, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        if (options?.triggerOnce) {
          observer.disconnect()
        }
      } else if (!options?.triggerOnce) {
        setInView(false)
      }
    }, options)

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, inView] as const
}
