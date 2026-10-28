import { useRef } from 'react'
import { howWeWork, links } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Eyebrow, Headline, TextLink } from './ui'

const themes = [
  { panel: 'bg-panel text-fg border border-edge', word: 'silver', muted: 'text-dim', line: 'border-edge', chip: 'bg-raised' },
  { panel: 'bg-silver text-void', word: 'text-void', muted: 'text-void/60', line: 'border-void/15', chip: 'bg-void/[0.07]' },
  { panel: 'bg-raised text-fg border border-edge', word: 'text-fg', muted: 'text-dim', line: 'border-edge', chip: 'bg-white/[0.04]' },
]

export function HowWeWork() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth
        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        })
        gsap.utils.toArray<HTMLElement>('[data-phase-word]').forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 10 },
            {
              xPercent: -10,
              ease: 'none',
              scrollTrigger: { trigger: el, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="how-we-work" className="relative z-10 overflow-hidden py-24 lg:h-svh lg:py-0">
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60" />
      <div
        ref={track}
        className="relative flex flex-col gap-5 px-5 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-6 lg:pr-[8vw]"
      >
        <div className="flex shrink-0 flex-col justify-center pb-8 lg:w-[34rem] lg:pb-0 lg:pr-10">
          <Eyebrow>{howWeWork.eyebrow}</Eyebrow>
          <Headline text={howWeWork.title} className="mt-6 text-[clamp(2.5rem,4.4vw,4.5rem)]" />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-dim">{howWeWork.body}</p>
          <TextLink href={links.howWeWork} className="mt-8">
            {howWeWork.link}
          </TextLink>
        </div>

        {howWeWork.phases.map((phase, i) => {
          const t = themes[i]
          return (
            <article
              key={phase.name}
              className={`relative flex shrink-0 flex-col overflow-hidden rounded-[28px] p-7 md:p-10 lg:h-[80svh] lg:w-[min(66rem,74vw)] lg:p-12 ${t.panel}`}
            >
              <div className="flex items-center justify-between">
                <p className={`eyebrow ${t.muted}`}>{phase.label}</p>
                <span className={`font-mono text-xs ${t.muted}`}>0{i + 1} / 03</span>
              </div>

              <div className="mt-10 grid flex-1 items-end gap-10 lg:mt-0 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <h3
                    data-phase-word
                    className={`display italic leading-[0.82] text-[clamp(5rem,12vw,12.5rem)] ${t.word}`}
                  >
                    {phase.name}
                  </h3>
                  <p className={`mt-8 max-w-md text-lg leading-relaxed ${t.muted}`}>{phase.body}</p>
                </div>

                <div className="lg:col-span-5">
                  <ol>
                    {phase.stages.map(([n, name]) => (
                      <li key={n} className={`flex items-baseline gap-5 border-t py-4 ${t.line}`}>
                        <span className={`font-mono text-xs ${t.muted}`}>{n}</span>
                        <span className="text-[1.02rem] font-medium">{name}</span>
                      </li>
                    ))}
                  </ol>
                  <div className={`mt-6 rounded-2xl p-5 ${t.chip}`}>
                    <p className={`eyebrow ${t.muted}`}>{howWeWork.outcomeLabel}</p>
                    <p className="display mt-2 text-[2rem] leading-[1.05]">{phase.outcome}</p>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="shell pointer-events-none absolute inset-x-0 bottom-6 hidden lg:block" aria-hidden>
        <div className="flex items-center gap-4">
          <span className="eyebrow">01</span>
          <span className="relative block h-px flex-1 bg-edge">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
          <span className="eyebrow">07</span>
        </div>
      </div>
    </section>
  )
}
