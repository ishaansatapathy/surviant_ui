import { useRef } from 'react'
import { offerings, services } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { practiceTones } from './ui'

// Offerings are listed AI (9), Product (6), Digital (6).
const toneOf = (i: number) => practiceTones[i < 9 ? 0 : i < 15 ? 1 : 2]

export function Offerings() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-cell]', {
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          stagger: { each: 0.035, from: 'random' },
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  const row = (items: string[], offset: number, reverse = false) => (
    <div className="flex w-max gap-2" style={{ animation: `marquee 50s linear infinite${reverse ? ' reverse' : ''}` }}>
      {[...items, ...items].map((o, i) => (
        <span key={`${o}-${i}`} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[0.82rem] text-fg-2">
          <span className={`h-1.5 w-1.5 rounded-full ${toneOf((i % items.length) + offset).bg}`} />
          {o}
        </span>
      ))}
    </div>
  )

  return (
    <section ref={root} aria-label="Offerings" className="mt-28 md:mt-36">
      <p data-reveal className="kicker text-center">
        {offerings.length} offerings / {services.practices.length} connected practices
      </p>

      <div className="mt-8 border-y border-line">
        <div className="wrap hidden lg:block">
          <ul className="grid grid-cols-7 border-l border-line">
            {offerings.map((o, i) => (
              <li
                key={o}
                data-cell
                className="group flex h-[4.5rem] items-center justify-center gap-2 border-b border-r border-line px-3 text-center text-[0.8rem] text-fg-3 transition-colors duration-300 hover:bg-white/[0.025] hover:text-fg [&:nth-last-child(-n+7)]:border-b-0"
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full opacity-60 transition-[opacity,box-shadow] duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_10px_currentColor] ${toneOf(i).bg} ${toneOf(i).text}`}
                />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 overflow-hidden py-5 lg:hidden" aria-hidden>
          {row(offerings.slice(0, 11), 0)}
          {row(offerings.slice(11), 11, true)}
        </div>
        <ul className="sr-only lg:hidden">
          {offerings.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
