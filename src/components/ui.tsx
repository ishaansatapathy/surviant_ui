import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import type { Emphasized } from '../content'
import { gsap, SplitText, useGSAP } from '../lib/motion'

type ButtonVariant = 'ink' | 'paper' | 'tang'

const buttonStyles: Record<ButtonVariant, string> = {
  ink: 'bg-ink text-paper hover:bg-black',
  paper: 'bg-white text-ink ring-1 ring-line hover:ring-ink-3',
  tang: 'bg-tang text-white hover:bg-tang-deep',
}

export function Button({
  href,
  children,
  variant = 'ink',
  className = '',
}: {
  href: string
  children: string
  variant?: ButtonVariant
  className?: string
}) {
  return (
    <a
      href={href}
      className={`group inline-flex h-12 items-center gap-2 rounded-full px-6 text-[0.95rem] font-medium transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.98] ${buttonStyles[variant]} ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
    </a>
  )
}

export function TextLink({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-1.5 font-medium ${className}`}>
      <span className="underline decoration-current/25 underline-offset-[5px] transition-[text-decoration-color] group-hover:decoration-current">
        {children}
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

/** Serif headline whose trailing phrase is set in italic. */
export function Headline({
  text,
  as: Tag = 'h2',
  className = '',
  emClassName = '',
}: {
  text: Emphasized
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  emClassName?: string
}) {
  return (
    <Tag data-lines className={`serif ${className}`}>
      {text[0]}
      <em className={emClassName}>{text[1]}</em>
    </Tag>
  )
}

/** A light product window: grey traffic lights and a warm paper sheet. */
export function Window({ children, className = '', bodyClassName = '' }: { children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-line bg-sheet shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_30px_60px_-30px_rgba(40,30,10,0.35),0_8px_20px_-12px_rgba(40,30,10,0.18)] ${className}`}
    >
      <div className="flex gap-1.5 px-5 pt-4" aria-hidden>
        <span className="h-3 w-3 rounded-full bg-[#dcd7cc]" />
        <span className="h-3 w-3 rounded-full bg-[#dcd7cc]" />
        <span className="h-3 w-3 rounded-full bg-[#dcd7cc]" />
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/** Hand-drawn marker stroke, drawn in when its parent reveals. */
export function Scribble({ className = '', manual = false }: { className?: string; manual?: boolean }) {
  return (
    <svg
      data-scribble
      data-manual={manual ? '' : undefined}
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d="M3 15 C 60 6, 120 5, 178 9 S 268 17, 297 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
      />
    </svg>
  )
}

/** Section kicker: a small tangerine square and mono label. */
export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`kicker flex items-center gap-2 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-[2px] bg-tang" />
      {children}
    </p>
  )
}

/**
 * Page-wide scroll reveals:
 *  [data-lines]     headlines rise line by line out of a mask
 *  [data-rise]      blocks fade up
 *  [data-scribble]  marker strokes draw in
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-lines]:not([data-manual])').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.2,
                stagger: 0.08,
                ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })
        gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            delay: Number(el.dataset.rise || 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
        gsap.utils.toArray<SVGElement>('[data-scribble]:not([data-manual]) path').forEach((path) => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: path.closest('section') ?? path, start: 'top 70%', once: true },
          })
        })
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-scribble] path', { strokeDashoffset: 0 })
      })
    },
    { scope },
  )
}

export function useInView(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
