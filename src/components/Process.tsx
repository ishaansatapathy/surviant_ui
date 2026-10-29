import { useRef, useState } from 'react'
import { howWeWork, links } from '../content'
import { gsap, scrollToTarget, ScrollTrigger, useGSAP } from '../lib/motion'
import { Headline, Kicker, TextLink, Window } from './ui'

const backdrops = ['bg-lilac', 'bg-mint', 'bg-butter']

export function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-phase]').forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-phase]').forEach((panel) => {
          gsap.from(panel.querySelectorAll('[data-stage]'), {
            y: 24,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: { trigger: panel.querySelector('[data-stage-list]'), start: 'top 78%', once: true },
          })
          gsap.fromTo(
            panel.querySelector('[data-backdrop]'),
            { clipPath: 'inset(12% 8% 12% 8% round 28px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              ease: 'none',
              scrollTrigger: { trigger: panel.querySelector('[data-backdrop]'), start: 'top bottom', end: 'top 40%', scrub: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="how-we-work" className="border-t border-line py-28 md:py-40">
      <div className="wrap">
        <div className="max-w-3xl">
          <Kicker>{howWeWork.eyebrow}</Kicker>
          <Headline text={howWeWork.title} className="mt-6 text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[1.02]" emClassName="text-ink-3" />
          <p data-rise className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-ink-2">
            {howWeWork.body}
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[15rem_1fr] lg:gap-20">
          {/* Phase tabs */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <ul>
                {howWeWork.phases.map((ph, i) => (
                  <li key={ph.name}>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`phase-${ph.name.toLowerCase()}`)
                        if (el) scrollToTarget(el)
                      }}
                      className={`relative flex w-full items-baseline justify-between border-b border-line py-3.5 text-left transition-colors duration-300 ${
                        active === i ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                      }`}
                    >
                      <span className="text-[0.98rem]">{ph.name}</span>
                      <span className="font-mono text-[0.7rem]">
                        {ph.stages[0].n}–{ph.stages[ph.stages.length - 1].n}
                      </span>
                      <span
                        className={`absolute -bottom-px left-0 h-[2px] bg-ink transition-[width] duration-500 ease-out ${
                          active === i ? 'w-full' : 'w-0'
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <TextLink href={links.howWeWork} className="mt-8 text-[0.9rem] text-ink">
                {howWeWork.link}
              </TextLink>
            </div>
          </div>

          {/* Phases */}
          <div className="space-y-28 md:space-y-40">
            {howWeWork.phases.map((ph, i) => (
              <article key={ph.name} id={`phase-${ph.name.toLowerCase()}`} data-phase>
                <p className="kicker">{ph.label}</p>
                <h3 data-lines className="serif mt-4 text-[clamp(2.6rem,4.4vw,4rem)]">
                  {ph.name}
                </h3>
                <p data-rise className="mt-5 max-w-xl text-[1.08rem] leading-relaxed text-ink-2">
                  {ph.body}
                </p>

                <div data-backdrop className={`mt-10 rounded-[28px] p-4 sm:p-8 md:p-12 ${backdrops[i]}`}>
                  <Window bodyClassName="px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
                    <ol data-stage-list className="divide-y divide-line">
                      {ph.stages.map((s) => (
                        <li key={s.n} data-stage className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
                          <span className="font-mono text-[0.8rem] text-tang">{s.n}</span>
                          <div>
                            <p className="text-[1.05rem] font-semibold">{s.name}</p>
                            <p className="mt-1.5 leading-relaxed text-ink-2">{s.body}</p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[0.8rem] text-ink-2">
                              <span className="text-ink-3">{howWeWork.outcomeLabel}</span>
                              {s.outcome}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-paper">
                      <span className="kicker !text-white/50">{howWeWork.outcomeLabel}</span>
                      <span className="serif text-[1.6rem] italic">{ph.outcome}</span>
                    </div>
                  </Window>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
