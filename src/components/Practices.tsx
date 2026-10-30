import { useRef, useState } from 'react'
import { links, offerings, services, systemMap } from '../content'
import { getLenis, ScrollTrigger, useGSAP } from '../lib/motion'
import { Heading, TextLink } from './ui'

const ranges = [
  [0, 9],
  [9, 15],
  [15, 21],
] as const
const practices = services.practices.map((p, i) => ({
  ...p,
  offerings: offerings.slice(...ranges[i]),
  // AI is layer 3, product layer 2, digital layer 1.
  layer: systemMap.layers[2 - i],
}))
const n = practices.length
const pad = (k: number) => String(k).padStart(2, '0')

export function Practices() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // While the track scrolls past, the window holds still and steps through the practices.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
      })
    },
    { scope: root },
  )

  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const target = top + ((i + 0.5) / n) * (el.offsetHeight - window.innerHeight)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target, { duration: 1.2 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const p = practices[active]

  return (
    <section ref={root} id="services" className="border-t border-line">
      <div className="frame pt-24 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <Heading label={services.eyebrow} text={services.title} />
          <div>
            <p data-fade className="text-[15px] leading-[1.7] text-fg-2">
              {services.body}
            </p>
            <div data-fade="0.1" className="mt-5">
              <TextLink href={links.services}>{services.directory}</TextLink>
            </div>
          </div>
        </div>
      </div>

      {/* Phones: each practice as a plain list. */}
      <div className="frame space-y-12 py-16 lg:hidden">
        {practices.map((q) => (
          <div key={q.name}>
            <p className="label">{q.count} offerings</p>
            <h3 className="mt-3 text-[22px] font-medium tracking-[-0.03em]">{q.name}</h3>
            <p className="mt-2 text-[15px] leading-[1.7] text-fg-2">{q.body}</p>
            <ul data-seq className="mt-6 border-b border-line">
              {q.offerings.map((o) => (
                <li key={o} className="border-t border-line py-3 text-[15px]">
                  {o}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div ref={track} className="relative hidden lg:block" style={{ height: `${n * 85 + 15}vh` }}>
        <div className="sticky top-0 flex h-screen items-center pt-16">
          <div className="frame grid w-full grid-cols-[17rem_1fr] items-center gap-14">
            <ul data-seq>
              {practices.map((q, i) => {
                const on = i === active
                return (
                  <li key={q.name} className="border-t border-line last:border-b">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className={`relative flex w-full items-baseline gap-3 py-4 text-left transition-colors duration-500 ${on ? 'text-fg' : 'text-fg-4 hover:text-fg-3'}`}
                    >
                      <span className="font-mono text-[11px]">{pad(i + 1)}</span>
                      <span className="text-[16px] font-medium tracking-[-0.02em]">{q.name}</span>
                      <span
                        className={`absolute inset-x-0 -top-px h-px origin-left bg-fg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'scale-x-100' : 'scale-x-0'}`}
                      />
                    </button>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="pb-4 text-[14px] leading-[1.65] text-fg-3">{q.body}</p>
                        <TextLink href={q.href} className="mb-5">
                          {services.explore}
                        </TextLink>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div data-fade className="overflow-hidden rounded-2xl border border-line-2 bg-s1">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5 text-[13px]">
                <span className="text-fg-3">
                  Services &nbsp;/&nbsp;{' '}
                  <span key={p.name} className="inline-block animate-[row-in_0.6s_var(--ease-out)_both] text-fg">
                    {p.name}
                  </span>
                </span>
                <span className="text-fg-3">
                  {p.count} of {offerings.length} offerings
                </span>
              </div>
              <div className="flex gap-1.5 border-b border-line px-5 py-2.5">
                {practices.map((q, i) => (
                  <span
                    key={q.name}
                    className={`rounded-md px-2.5 py-1 text-[12.5px] transition-colors duration-500 ${i === active ? 'bg-white/10 text-fg' : 'text-fg-4'}`}
                  >
                    {q.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-[2.5rem_1.3fr_0.8fr_1.2fr] gap-4 border-b border-line px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-4">
                <span>No.</span>
                <span>Offering</span>
                <span>Layer</span>
                <span>Outcome</span>
              </div>
              <ul key={active} className="h-[calc(9*2.875rem)]">
                {p.offerings.map((o, k) => (
                  <li
                    key={o}
                    className="grid h-[2.875rem] animate-[row-in_0.7s_var(--ease-out)_both] grid-cols-[2.5rem_1.3fr_0.8fr_1.2fr] items-center gap-4 border-b border-line px-5 text-[14px]"
                    style={{ animationDelay: `${80 + k * 55}ms` }}
                  >
                    <span className="font-mono text-[11px] text-fg-4">{pad(k + 1)}</span>
                    <span className="text-fg">{o}</span>
                    <span className="text-fg-3">{p.layer.label.split(' / ')[0]}</span>
                    <span className="truncate text-fg-2">{p.layer.outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
