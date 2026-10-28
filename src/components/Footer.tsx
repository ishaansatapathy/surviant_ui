import { useRef } from 'react'
import { email, footer, links, nav } from '../content'
import { gsap, SplitText, useGSAP } from '../lib/motion'
import { Button } from './ui'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-wordmark]', { type: 'chars', charsClass: 'wordmark-char' })
        gsap.from(split.chars, {
          yPercent: 100,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: '[data-wordmark-wrap]', start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative z-10 overflow-hidden pt-20 md:pt-28">
      <div className="shell grid gap-14 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <a href="/" className="flex items-center gap-3" aria-label="Surviant home">
            <img src="/images/surviant-logo.jpg" alt="" className="h-9 w-9 rounded-[7px] ring-1 ring-edge" />
            <span className="text-[1rem] font-semibold tracking-tight">{nav.name}</span>
          </a>
          <p className="mt-6 max-w-xs leading-relaxed text-dim">{footer.blurb}</p>
          <a
            href={`mailto:${email}`}
            className="mt-4 inline-block font-medium text-fg underline decoration-accent/50 underline-offset-[6px] hover:decoration-accent"
          >
            {email}
          </a>
        </div>

        <div className="md:col-span-4">
          <p className="display text-[2.4rem] leading-[1.05]">{footer.prompt.title}</p>
          <p className="mt-3 max-w-xs leading-relaxed text-dim">{footer.prompt.body}</p>
          <Button href={links.contact} className="mt-7">
            {footer.prompt.cta}
          </Button>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-2">
            <p className="eyebrow">{col.title}</p>
            <ul className="mt-5 space-y-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[0.93rem] text-dim transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div data-wordmark-wrap className="shell mt-20 md:mt-28" aria-hidden>
        <p
          data-wordmark
          className="display select-none overflow-hidden bg-linear-to-b from-fg to-fg/5 bg-clip-text pb-[0.06em] text-center text-[min(25vw,23rem)] leading-[0.82] tracking-[-0.035em] text-transparent"
        >
          Surviant
        </p>
      </div>

      <div className="shell mt-6 flex flex-col gap-4 border-t border-edge-soft py-7 text-sm text-faint md:flex-row md:items-center md:justify-between">
        <p>{footer.legal}</p>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs uppercase tracking-[0.1em]">{footer.locations}</span>
          {footer.legalLinks.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
