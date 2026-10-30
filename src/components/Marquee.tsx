import { useRef } from 'react'
import { projects } from '../data/projects'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'

// Every technology named across the recent work, most used first.
const counts = new Map<string, number>()
projects.forEach((p) => p.technologies.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
const tech = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
const rows = [tech.slice(0, 16), tech.slice(16, 32)]

export function Marquee() {
  const root = useRef<HTMLElement>(null)

  // Two rows run in opposite directions and briefly speed up with the scroll.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const loops = gsap.utils.toArray<HTMLElement>('[data-loop]').map((el, i) =>
          gsap.fromTo(el, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 60, ease: 'none', repeat: -1 }),
        )
        const boost = { v: 1 }
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 350)
            gsap.to(boost, {
              v,
              duration: 0.25,
              overwrite: true,
              onUpdate: () => loops.forEach((l) => l.timeScale(boost.v)),
              onComplete: () => gsap.to(boost, { v: 1, duration: 1.2, onUpdate: () => loops.forEach((l) => l.timeScale(boost.v)) }),
            })
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="overflow-hidden border-t border-line py-16 md:py-20">
      <p data-fade className="label text-center">
        Technologies across recent work
      </p>
      <div className="mt-10 space-y-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} data-loop className="flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-14 pr-14">
                {row.map((t) => (
                  <li key={t} className="whitespace-nowrap text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-[-0.03em] text-fg-4 transition-colors duration-300 hover:text-fg">
                    {t}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
