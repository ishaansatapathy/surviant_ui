import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import type { Emphasized } from '../content'
import { gsap, SplitText, useGSAP } from '../lib/motion'

/** Accent colours. Every class is spelled out so Tailwind can see it. */
export const tones = {
  violet: { text: 'text-violet', bg: 'bg-violet', soft: 'bg-violet/10', ring: 'border-violet/25', border: 'border-violet', hex: '#a394ff' },
  blue: { text: 'text-blue', bg: 'bg-blue', soft: 'bg-blue/10', ring: 'border-blue/25', border: 'border-blue', hex: '#4ea2ff' },
  orange: { text: 'text-orange', bg: 'bg-orange', soft: 'bg-orange/10', ring: 'border-orange/25', border: 'border-orange', hex: '#ff8c52' },
  green: { text: 'text-green', bg: 'bg-green', soft: 'bg-green/10', ring: 'border-green/25', border: 'border-green', hex: '#3fd48c' },
  pink: { text: 'text-pink', bg: 'bg-pink', soft: 'bg-pink/10', ring: 'border-pink/25', border: 'border-pink', hex: '#ff74b1' },
  amber: { text: 'text-amber', bg: 'bg-amber', soft: 'bg-amber/10', ring: 'border-amber/25', border: 'border-amber', hex: '#ffc857' },
} as const

export type Tone = (typeof tones)[keyof typeof tones]

/** AI, Product, Digital. */
export const practiceTones = [tones.violet, tones.blue, tones.orange] as const
/** Think, Build, Sustain. */
export const phaseTones = [tones.violet, tones.blue, tones.green] as const

export function Button({
  href,
  children,
  variant = 'light',
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'light' | 'ghost'
  className?: string
}) {
  const look =
    variant === 'light'
      ? 'bg-fg text-black hover:bg-white'
      : 'border border-line-2 text-fg hover:border-white/30 hover:bg-white/[0.04]'
  return (
    <a
      href={href}
      className={`group inline-flex h-10 items-center gap-1.5 rounded-full px-[1.125rem] text-[0.875rem] font-medium transition-[background-color,border-color,transform] duration-300 active:scale-[0.98] ${look} ${className}`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
    </a>
  )
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-1 text-[0.875rem] text-fg-2 transition-colors hover:text-fg ${className}`}>
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

export function Kicker({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p data-reveal className={`kicker flex items-center gap-2 ${className}`}>
      {tone && <span className={`h-1.5 w-1.5 rounded-full ${tone.bg}`} />}
      {children}
    </p>
  )
}

/** Two-tone headline: the statement in white, the follow-through in grey. */
export function Title({
  text,
  as: Tag = 'h2',
  className = '',
}: {
  text: Emphasized
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
}) {
  return (
    <Tag data-words className={`display text-balance ${className}`}>
      <span className="text-fg">{text[0]}</span>
      <span className="text-fg-3">{text[1]}</span>
    </Tag>
  )
}

/** Title bar for the product windows used across the page. */
export function WindowBar({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`flex h-10 shrink-0 items-center gap-3 border-b border-line px-4 ${className}`}>
      <span className="flex gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
      </span>
      {children}
    </div>
  )
}

export function Chip({ children, tone, className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem] ${
        tone ? `${tone.ring} ${tone.soft} ${tone.text}` : 'border-line bg-white/[0.03] text-fg-2'
      } ${className}`}
    >
      {children}
    </span>
  )
}

/**
 * Page-wide scroll reveals:
 * [data-words]  headline words resolve from blur
 * [data-reveal] block fades up out of blur (value = delay)
 * [data-scrub]  words brighten from grey as the reader scrolls past
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits: SplitText[] = []

        gsap.utils.toArray<HTMLElement>('[data-words]:not([data-manual])').forEach((el) => {
          const split = SplitText.create(el, { type: 'words' })
          splits.push(split)
          gsap.from(split.words, {
            opacity: 0,
            y: 10,
            filter: 'blur(8px)',
            duration: 1.1,
            stagger: 0.03,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 16,
            filter: 'blur(6px)',
            duration: 1.1,
            delay: Number(el.dataset.reveal || 0),
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-scrub]').forEach((el) => {
          const split = SplitText.create(el, { type: 'words' })
          splits.push(split)
          gsap.fromTo(
            split.words,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
            },
          )
        })

        return () => splits.forEach((s) => s.revert())
      })
    },
    { scope },
  )
}

export function useInView(ref: RefObject<Element | null>, margin = '0px 0px -10% 0px', once = false) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, once])
  return inView
}

/** Steps a counter from 0 to `max` while `on`, holding at max; resets when off. */
export function useSteps(on: boolean, max: number, ms: number, startDelay = 300) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) {
      setN(0)
      return
    }
    if (n >= max) return
    const t = window.setTimeout(() => setN((v) => v + 1), n === 0 ? startDelay : ms)
    return () => window.clearTimeout(t)
  }, [on, n, max, ms, startDelay])
  return n
}
