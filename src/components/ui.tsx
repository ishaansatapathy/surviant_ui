import { ArrowUpRight } from 'lucide-react'
import {
  useEffect,
  useState,
  type ElementType,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import type { Emphasized } from '../content'

type ButtonVariant = 'primary' | 'ghost'

const buttonStyles: Record<ButtonVariant, { base: string; icon: string }> = {
  primary: {
    base: 'bg-fg text-void hover:bg-white',
    icon: 'bg-void text-fg',
  },
  ghost: {
    base: 'bg-white/[0.03] text-fg ring-1 ring-edge backdrop-blur hover:ring-faint',
    icon: 'bg-raised text-fg group-hover:bg-fg group-hover:text-void',
  },
}

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string
  children: string
  variant?: ButtonVariant
  className?: string
}) {
  const s = buttonStyles[variant]
  return (
    <a
      href={href}
      className={`group inline-flex h-11 items-center gap-3 rounded-full pl-5 pr-1.5 text-[0.92rem] font-medium transition-colors duration-500 ${s.base} ${className}`}
    >
      <span className="relative block overflow-hidden leading-6">
        <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-500 ${s.icon}`}>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
      </span>
    </a>
  )
}

export function TextLink({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  return (
    <a href={href} className={`group inline-flex items-center gap-2 text-[0.92rem] font-medium text-fg ${className}`}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-expo group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

/** Mono label with a small accent square, e.g. "■ SERVICES / THREE CONNECTED PRACTICES". */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-2.5 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-[1px] bg-accent" />
      {children}
    </p>
  )
}

/** Serif headline with the trailing phrase set in brushed-silver italic. */
export function Headline({
  as: Tag = 'h2',
  text,
  className = '',
  emClassName = 'silver',
  split = true,
}: {
  as?: ElementType
  text: Emphasized
  className?: string
  emClassName?: string
  split?: boolean
}) {
  return (
    <Tag className={`display ${className}`} data-split={split ? '' : undefined}>
      {text[0]}
      <em className={emClassName}>{text[1]}</em>
    </Tag>
  )
}

/** macOS-style app window chrome. */
export function Window({
  title,
  children,
  className = '',
  bodyClassName = '',
}: {
  title?: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-edge bg-panel shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.02)_inset] ${className}`}
    >
      <div className="flex h-9 items-center gap-3 border-b border-edge-soft bg-raised/70 px-3.5">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#2e2e33]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2e2e33]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2e2e33]" />
        </span>
        {title && (
          <span className="mx-auto min-w-0 truncate rounded-md bg-void/70 px-3 py-0.5 font-mono text-[0.62rem] tracking-wide text-faint">
            {title}
          </span>
        )}
        <span className="w-[42px] shrink-0" aria-hidden />
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/** Feeds pointer position into the .spotlight gradient. */
export function trackSpotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function useInView(ref: RefObject<Element | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
