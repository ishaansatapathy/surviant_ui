import { ArrowRight } from 'lucide-react'
import type { ReactNode, RefObject } from 'react'
import type { Emphasized } from '../content'
import { gsap, SplitText, useGSAP } from '../lib/motion'

export const EASE = 'expo.out'

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
  const look = variant === 'light' ? 'bg-fg text-black hover:bg-white' : 'border border-line-2 text-fg hover:border-white/35'
  return (
    <a
      href={href}
      className={`group inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition-[background-color,border-color] duration-300 ${look} ${className}`}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-0.5" />
    </a>
  )
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-1.5 text-[14px] text-fg-2 transition-colors duration-300 hover:text-fg ${className}`}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:translate-x-0.5" />
    </a>
  )
}

/** Section header: a mono label, then the headline with its follow-through in grey. */
export function Heading({ label, text, className = '' }: { label: string; text: Emphasized; className?: string }) {
  return (
    <div className={className}>
      <p data-fade className="label">
        {label}
      </p>
      <h2 data-lines className="heading mt-5 text-balance text-[clamp(1.9rem,3vw,2.5rem)]">
        <span className="text-fg">{text[0]}</span>
        <span className="text-fg-3">{text[1]}</span>
      </h2>
    </div>
  )
}

/**
 * Page-wide scroll motion. Everything arrives once, in order, as it enters:
 * [data-lines]  headline lines slide up from behind a mask, one after another
 * [data-fade]   a block rises and fades in (value = delay)
 * [data-seq]    its children arrive one by one (value = delay)
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits: SplitText[] = []
        const once = (el: Element, start = 'top 88%') => ({ trigger: el, start, once: true })

        gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
          const split = SplitText.create(el, { type: 'lines', mask: 'lines' })
          splits.push(split)
          gsap.from(split.lines, { yPercent: 105, duration: 1.3, stagger: 0.1, ease: EASE, scrollTrigger: once(el) })
        })

        gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => {
          gsap.from(el, { opacity: 0, y: 24, duration: 1.3, delay: Number(el.dataset.fade || 0), ease: EASE, scrollTrigger: once(el, 'top 92%') })
        })

        gsap.utils.toArray<HTMLElement>('[data-seq]').forEach((el) => {
          gsap.from(el.children, {
            opacity: 0,
            y: 28,
            duration: 1.2,
            stagger: 0.1,
            delay: Number(el.dataset.seq || 0),
            ease: EASE,
            scrollTrigger: once(el, 'top 85%'),
          })
        })

        return () => splits.forEach((s) => s.revert())
      })
    },
    { scope },
  )
}
