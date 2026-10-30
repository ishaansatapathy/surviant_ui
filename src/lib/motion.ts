import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export const getLenis = () => lenis

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step. */
export function startSmoothScroll() {
  if (reducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.95, touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: Element) {
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.4 })
  else target.scrollIntoView()
}
