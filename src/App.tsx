import { useEffect, useRef } from 'react'
import { Closing, Footer } from './components/Closing'
import { Hero } from './components/Hero'
import { Leadership } from './components/Leadership'
import { Marquee } from './components/Marquee'
import { Nav } from './components/Nav'
import { Practices } from './components/Practices'
import { Process } from './components/Process'
import { useReveals } from './components/ui'
import { Why } from './components/Why'
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
    <div ref={root} className="isolate">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-fg px-5 py-3 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Practices />
        <Process />
        <Why />
        <Work />
        <Leadership />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}
