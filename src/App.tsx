import { useEffect, useRef } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowWeWork } from './components/HowWeWork'
import { Leadership } from './components/Leadership'
import { Marquee } from './components/Marquee'
import { RecentWork } from './components/RecentWork'
import { Result } from './components/Result'
import { Services } from './components/Services'
import { WhySurviant } from './components/WhySurviant'
import { scrollToTarget, startSmoothScroll } from './lib/motion'
import { useReveals } from './lib/useReveals'

export default function App() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return startSmoothScroll()
  }, [])

  // Route same-page hash links through Lenis.
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
        href="#main-content"
        className="sr-only z-[200] rounded-full bg-fg px-5 py-3 text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {/* Edge rails, like a spec sheet's margins. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-10 items-center justify-center 2xl:flex"
      >
        <span className="-rotate-90 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.3em] text-faint">
          Software / AI / Systems
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-10 items-center justify-center 2xl:flex"
      >
        <span className="rotate-90 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.3em] text-faint">
          Bay Area / India
        </span>
      </div>
      <Header />
      <main id="main-content">
        <Hero />
        <Result />
        <Marquee />
        <Services />
        <HowWeWork />
        <WhySurviant />
        <RecentWork />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
