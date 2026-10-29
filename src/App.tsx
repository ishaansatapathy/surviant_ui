import { useEffect, useRef } from 'react'
import { Closing } from './components/Closing'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Practices } from './components/Practices'
import { Principles } from './components/Principles'
import { Process } from './components/Process'
import { SystemSlab } from './components/SystemSlab'
import { Team } from './components/Team'
import { useReveals } from './components/ui'
import { Work } from './components/Work'
import { scrollToTarget, startSmoothScroll } from './lib/motion'

export default function App() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return startSmoothScroll()
  }, [])

  // Same-page hash links go through Lenis.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest('a')
      if (!a?.hash) return
      const url = new URL(a.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname) return
      const target = document.querySelector(url.hash)
      if (!target) return
      e.preventDefault()
      scrollToTarget(target)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useReveals(root)

  return (
    <div ref={root}>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <SystemSlab />
        <Practices />
        <Process />
        <Principles />
        <Work />
        <Team />
        <Closing />
      </main>
    </div>
  )
}
