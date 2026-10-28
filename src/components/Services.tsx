import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { links, services } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Eyebrow, Headline, TextLink, trackSpotlight } from './ui'

export function Services() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-practice]', {
          y: 60,
          opacity: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-practices]', start: 'top 82%', once: true },
        })
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count)
          const counter = { v: 0 }
          gsap.to(counter, {
            v: target,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v)).padStart(2, '0')
            },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="services" className="relative z-10 py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <Eyebrow>{services.eyebrow}</Eyebrow>
            <Headline text={services.title} className="mt-6 text-[clamp(2.5rem,5.2vw,5.25rem)]" />
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
            <p data-reveal className="text-lg leading-relaxed text-dim">
              {services.body}
            </p>
            <div data-reveal>
              <TextLink href={links.services}>{services.directory}</TextLink>
            </div>
          </div>
        </div>

        <div
          data-practices
          className="mt-16 grid overflow-hidden rounded-2xl border border-edge bg-edge gap-px md:mt-24 lg:grid-cols-3"
        >
          {services.practices.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              data-practice
              onPointerMove={trackSpotlight}
              className="spotlight group flex min-h-[30rem] flex-col justify-between bg-panel p-7 transition-colors duration-500 hover:bg-[#101014] md:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[0.7rem] text-faint">[0{i + 1}]</span>
                <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:text-accent" />
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span aria-hidden data-count={p.count} className="display text-[5.5rem] leading-none text-fg">
                    {String(p.count).padStart(2, '0')}
                  </span>
                  <span aria-hidden className="eyebrow">
                    offerings
                  </span>
                  <span className="sr-only">{p.count} offerings</span>
                </div>
                <h3 className="display mt-8 text-[2.5rem] transition-colors duration-500 group-hover:text-accent">
                  {p.name}
                </h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-dim lg:min-h-[5.1rem]">{p.body}</p>
                <p className="mt-6 border-t border-edge pt-5 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.06em] text-faint">
                  {[...p.tags, 'and more'].join(' / ')}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-[0.92rem] font-medium text-fg">
                  {services.explore}
                  <span className="h-px w-6 bg-accent transition-all duration-500 ease-expo group-hover:w-10" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
