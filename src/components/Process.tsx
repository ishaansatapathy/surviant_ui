import { useRef, useState } from 'react'
import { howWeWork, links } from '../content'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { Heading, TextLink } from './ui'

const phases = howWeWork.phases
const stages = phases.flatMap((p, phase) => p.stages.map((s) => ({ ...s, phase })))
const N = stages.length

export function Process() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(1)

  // Scrolling moves the work across the board: each stage card lands in its phase in turn.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          setShown(Math.min(N, 1 + Math.floor(self.progress * N)))
        },
      })
    },
    { scope: root },
  )

  const current = stages[shown - 1]

  return (
    <section ref={root} id="how-we-work" className="border-t border-line">
      <div className="frame pt-24 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <Heading label={howWeWork.eyebrow} text={howWeWork.title} />
          <div>
            <p data-fade className="text-[15px] leading-[1.7] text-fg-2">
              {howWeWork.body}
            </p>
            <div data-fade="0.1" className="mt-5">
              <TextLink href={links.howWeWork}>{howWeWork.link}</TextLink>
            </div>
          </div>
        </div>
      </div>

      {/* Phones: the phases as plain lists. */}
      <div className="frame space-y-10 py-16 lg:hidden">
        {phases.map((p) => (
          <div key={p.name}>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[20px] font-medium tracking-[-0.03em]">{p.name}</h3>
              <span className="text-[13px] text-fg-3">{p.outcome}</span>
            </div>
            <ul data-seq className="mt-4 space-y-2">
              {p.stages.map((s) => (
                <li key={s.n} className="rounded-xl border border-line-2 bg-s1 p-4">
                  <p className="label !text-[10px]">Stage {s.n}</p>
                  <p className="mt-2 text-[15px] font-medium">{s.name}</p>
                  <p className="mt-1 text-[13.5px] text-fg-3">{s.outcome}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div ref={track} className="relative hidden lg:block" style={{ height: `${N * 32 + 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center pt-16">
          <div className="frame w-full">
            <div className="flex items-center gap-6">
              <p className="text-[14px] text-fg">
                Stage {current.n} <span className="text-fg-3">of {String(N).padStart(2, '0')}</span>
              </p>
              <div className="relative h-px flex-1 bg-line">
                <span ref={bar} className="absolute inset-0 origin-left bg-fg" style={{ transform: 'scaleX(0)' }} />
              </div>
              <p key={current.n} className="animate-[row-in_0.6s_var(--ease-out)_both] text-[14px] text-fg-2">
                {current.name}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {phases.map((p, col) => {
                const cards = stages.map((s, i) => ({ s, i })).filter(({ s }) => s.phase === col)
                const landed = cards.filter(({ i }) => i < shown).length
                return (
                  <div key={p.name} className="flex min-h-[27rem] flex-col rounded-2xl border border-line bg-s1 p-3">
                    <div className="flex items-baseline justify-between px-2 pb-4 pt-2">
                      <span className="flex items-baseline gap-2.5">
                        <span className="text-[15px] font-medium tracking-[-0.02em]">{p.name}</span>
                        <span className="font-mono text-[11px] text-fg-3">
                          {landed}/{cards.length}
                        </span>
                      </span>
                      <span className="text-[12.5px] text-fg-3">{p.outcome}</span>
                    </div>
                    <div className="space-y-2">
                      {cards.map(({ s, i }) => {
                        const on = i < shown
                        return (
                          <article
                            key={s.n}
                            className={`rounded-xl border bg-[#141414] p-4 transition-[translate,rotate,opacity,border-color] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              on ? 'translate-x-0 translate-y-0 rotate-0 opacity-100' : 'translate-x-16 -translate-y-6 rotate-6 opacity-0'
                            } ${i === shown - 1 ? 'border-white/35' : 'border-line-2'}`}
                          >
                            <p className="label !text-[10px]">Stage {s.n}</p>
                            <p className="mt-2.5 text-[15px] font-medium leading-snug tracking-[-0.02em]">{s.name}</p>
                            <p className="mt-1.5 text-[13px] text-fg-3">{s.outcome}</p>
                          </article>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
