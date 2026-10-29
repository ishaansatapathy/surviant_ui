import { ArrowUpRight, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { links, offerings, services } from '../content'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import { Headline, Kicker, TextLink, useInView } from './ui'

// Offerings are listed AI → Product → Digital, in the same order as the practices.
const ranges = [offerings.slice(0, 9), offerings.slice(9, 15), offerings.slice(15)]
const tints = ['bg-lilac', 'bg-mint', 'bg-butter']

function OfferingList({ items, running, offset }: { items: string[]; running: boolean; offset: number }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!running || reducedMotion()) return
    let id: number
    const start = window.setTimeout(() => {
      id = window.setInterval(() => setActive((a) => (a + 1) % items.length), 1500)
    }, offset)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(id)
    }
  }, [running, items.length, offset])

  return (
    <div className="h-[22rem] rounded-2xl border border-black/5 bg-white/80 p-2 shadow-[0_12px_30px_-18px_rgba(40,30,10,0.4)] backdrop-blur">
      <ul className="space-y-0.5">
        {items.map((o, i) => (
          <li
            key={o}
            className={`flex items-center justify-between rounded-xl px-3 py-[0.45rem] text-[0.86rem] transition-colors duration-500 ${
              i === active ? 'bg-ink text-paper' : 'text-ink-2'
            }`}
          >
            {o}
            <Check className={`h-3.5 w-3.5 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Practices() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const running = useInView(grid)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-practice]', {
          y: 80,
          opacity: 0,
          rotate: (i: number) => (i - 1) * 2,
          duration: 1.3,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: grid.current, start: 'top 82%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="services" className="py-28 md:py-40">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker>{services.eyebrow}</Kicker>
            <Headline text={services.title} className="mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02]" emClassName="text-ink-3" />
          </div>
          <div data-rise className="lg:col-span-4 lg:col-start-9">
            <p className="text-[1.05rem] leading-relaxed text-ink-2">{services.body}</p>
            <TextLink href={links.services} className="mt-5 text-ink">
              {services.directory}
            </TextLink>
          </div>
        </div>

        <div ref={grid} className="mt-16 grid gap-4 md:mt-20 lg:grid-cols-3">
          {services.practices.map((p, i) => (
            <div key={p.name} data-practice className="flex">
            <a
              href={p.href}
              className={`group flex w-full flex-col rounded-[28px] p-3 transition-transform duration-500 ease-out hover:-translate-y-1.5 ${tints[i]}`}
            >
              <div className="transition-transform duration-500 ease-out group-hover:-rotate-1">
                <OfferingList items={ranges[i]} running={running} offset={i * 500} />
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
                <p className="font-mono text-[0.75rem] text-ink-2">
                  {p.count} offerings
                </p>
                <h3 className="serif mt-2 text-[2.3rem]">{p.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-2">{p.body}</p>
                <span className="mt-7 inline-flex items-center gap-1.5 font-medium">
                  {services.explore}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
