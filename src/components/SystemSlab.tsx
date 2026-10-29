import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { offerings, services, systemMap } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Headline, Kicker, Scribble } from './ui'

const rows = [offerings.slice(0, 11), offerings.slice(11)]

/** Dark slab that opens up as it arrives: offerings ticker, then the system map. */
export function SystemSlab() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-slab]',
          { scale: 0.93, borderRadius: 72 },
          {
            scale: 1,
            borderRadius: 36,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true },
          },
        )
        gsap.from('[data-layer]', {
          y: 50,
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-layers]', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="system-map" className="relative z-10 px-2 md:px-3">
      <div data-slab className="origin-top overflow-hidden rounded-[36px] bg-char text-paper">
        {/* Offerings ticker */}
        <div className="border-b border-white/10 py-9 md:py-12" aria-label={services.eyebrow}>
          <p className="kicker text-center !text-white/45">{services.eyebrow}</p>
          <div className="mt-7 space-y-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            {rows.map((row, r) => (
              <div
                key={r}
                className="flex w-max animate-[marquee_60s_linear_infinite]"
                style={{ animationDirection: r ? 'reverse' : 'normal' }}
                aria-hidden={r ? true : undefined}
              >
                {[0, 1].map((copy) => (
                  <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy ? true : undefined}>
                    {row.map((o) => (
                      <li
                        key={o}
                        className={`serif flex items-center whitespace-nowrap text-[clamp(1.8rem,3.4vw,3rem)] leading-tight ${
                          r ? 'italic text-white/40' : 'text-paper'
                        }`}
                      >
                        <span className="px-5 md:px-7">{o}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-tang" />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* System map */}
        <div className="wrap py-20 md:py-28">
          <div className="text-center">
            <Kicker className="justify-center !text-white/45">{systemMap.eyebrow}</Kicker>
            <Headline text={systemMap.title} className="mx-auto mt-6 max-w-[14em] text-[clamp(2.6rem,5.6vw,5.4rem)]" emClassName="text-tang" />
          </div>

          <ol data-layers className="mt-16 grid gap-px overflow-hidden rounded-[24px] bg-white/10 md:mt-20 md:grid-cols-3">
            {systemMap.layers.map((l, i) => (
              <li key={l.label} data-layer className="flex flex-col bg-char p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.8rem] text-tang">0{i + 1}</span>
                  <span className="kicker !text-white/40">{l.label.split(' / ')[1]}</span>
                </div>
                <h3 className="serif mt-14 text-[2.1rem] leading-[1.05] md:mt-20">{l.title}</h3>
                <p className="mt-4 leading-relaxed text-white/60">{l.body}</p>
                <p className="mt-8 inline-flex items-center gap-2 border-t border-white/10 pt-5 text-[0.92rem] text-paper">
                  <ArrowRight className="h-4 w-4 text-tang" />
                  {l.outcome}
                </p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-20 max-w-4xl text-center md:mt-28">
            <Kicker className="justify-center !text-white/45">{systemMap.result.label}</Kicker>
            <p data-rise className="serif mt-6 text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.1]">
              {systemMap.result.body[0]}
              <span className="relative inline-block">
                <em>{systemMap.result.body[1]}</em>
                <Scribble className="-bottom-1.5 left-0 h-3.5 w-full text-tang" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
