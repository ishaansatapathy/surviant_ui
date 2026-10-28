import { ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { hero, howWeWork, leadership, links, offerings, recentWork, services, systemMap } from '../content'
import { projects } from '../data/projects'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/motion'
import { Button, Window } from './ui'

// Each layer, in order, with the practice and offerings behind it.
const layerPractice = [services.practices[2], services.practices[1], services.practices[0]]
const layerOfferings = [offerings.slice(15), offerings.slice(9, 15), offerings.slice(0, 9)]

// Scroll progress (0–1 across the pinned hero) where the window has opened, and where it closes.
const OPEN = 0.16
const CLOSE = 0.9

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** The system map as a live document: each layer writes itself as you scroll. */
function SystemWindow({ step, typed }: { step: number; typed: number }) {
  const layer = systemMap.layers[step]
  const practice = layerPractice[step]
  const list = layerOfferings[step]
  const written = clamp01(typed / 0.55)
  const body = layer.body.slice(0, Math.round(layer.body.length * written))

  return (
    <Window title={systemMap.eyebrow} className="h-full" bodyClassName="grid h-[calc(100%-2.25rem)] md:grid-cols-[14rem_1fr]">
      <aside className="hidden flex-col border-r border-edge-soft bg-void/50 p-5 md:flex">
        <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[6px] grayscale" />
        <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{systemMap.title.join('')}</p>
        <ol className="mt-3 space-y-1">
          {systemMap.layers.map((l, i) => (
            <li
              key={l.label}
              className={`flex items-center gap-3 rounded-md px-2.5 py-2 text-[0.8rem] transition-colors duration-500 ${
                i === step ? 'bg-raised text-fg' : i < step ? 'text-dim' : 'text-faint'
              }`}
            >
              <span className="font-mono text-[0.62rem]">0{i + 1}</span>
              {l.label.split(' / ')[1]}
            </li>
          ))}
        </ol>
        <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{howWeWork.eyebrow}</p>
        <ul className="mt-3 space-y-1">
          {howWeWork.phases.map((ph) => (
            <li key={ph.name} className="px-2.5 py-1.5 text-[0.8rem] text-faint">
              {ph.name}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-h-0 flex-col p-6 md:p-10">
        <div className="flex items-start justify-between gap-6">
          <p className="eyebrow">{layer.label}</p>
          <span className="font-mono text-[0.66rem] text-faint">0{step + 1} / 03</span>
        </div>

        <div key={step} className="mt-6 animate-[step-in_0.7s_var(--ease-expo)_both]">
          <h3 className="display text-[clamp(2.3rem,5vw,5.25rem)] leading-[1]">{layer.title}</h3>
          <p className="mt-6 min-h-[3.4em] max-w-xl text-[1.02rem] leading-relaxed text-dim md:text-xl">
            <span className="sr-only">{layer.body}</span>
            <span aria-hidden>
              {body}
              {written < 1 && (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-[caret_1s_steps(1)_infinite] bg-fg" />
              )}
            </span>
          </p>
          <p
            className={`mt-5 inline-flex items-center gap-2 rounded-full border border-edge px-3.5 py-1.5 text-[0.82rem] transition-all duration-500 ${
              written >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <ArrowRight className="h-3.5 w-3.5 text-silver" />
            {layer.outcome}
          </p>
        </div>

        <div className="mt-auto border-t border-edge-soft pt-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
            {practice.name} · {practice.count} offerings
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {list.map((o, i) => (
              <li
                key={o}
                className={`rounded-md border border-edge-soft bg-raised/60 px-2.5 py-1 text-[0.74rem] text-dim transition-all duration-500 ${
                  typed > 0.35 + (0.4 * i) / list.length ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Window>
  )
}

function ProjectPeek() {
  const p = projects[0]
  return (
    <Window title={recentWork.eyebrow} bodyClassName="p-4">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">{p.industry}</p>
      <p className="display mt-2 text-[1.3rem] leading-tight">{p.title}</p>
      <div className="mt-4 flex items-center justify-between border-t border-edge-soft pt-3">
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">{recentWork.timeToDevelop}</span>
        <span className="text-[0.72rem]">
          {p.months} {p.months === 1 ? 'month' : 'months'}
        </span>
      </div>
    </Window>
  )
}

function LeadershipPeek() {
  return (
    <Window title={leadership.eyebrow.split(' / ')[0]} bodyClassName="space-y-1.5 p-1.5">
      {leadership.people.map((person) => (
        <div key={person.name} className="relative aspect-[16/11] overflow-hidden rounded-lg bg-void">
          <img src={person.image} alt="" className="h-full w-full object-cover object-[center_18%] grayscale" />
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/85 to-transparent" />
          <span className="absolute bottom-2 left-2.5 text-[0.7rem] font-medium text-white">{person.name}</span>
        </div>
      ))}
    </Window>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState(0)

  useGSAP(
    () => {
      // Which layer is on screen, and how far it has written itself.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const q = clamp01((self.progress - OPEN) / (CLOSE - OPEN - 0.04)) * 3
          const s = Math.min(2, Math.floor(q))
          setStep(s)
          setTyped(Math.round(clamp01(q - s) * 100) / 100)
        },
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        SplitText.create('[data-hero-title]', {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 118, duration: 1.5, stagger: 0.1, ease: 'expo.out', delay: 0.1 }),
        })
        gsap.from('[data-hero-fade]', { y: 20, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', delay: 0.4 })
        gsap.from('[data-window]', { y: 120, opacity: 0, duration: 1.8, ease: 'expo.out', delay: 0.55 })

        // Copy leaves, the window rises and opens, side windows come into focus;
        // at the end everything closes and hands over to the next section.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
        })
        tl.to('[data-hero-copy]', { opacity: 0, y: -80, filter: 'blur(12px)', ease: 'power2.in', duration: OPEN }, 0)
          .fromTo(
            '[data-window-pos]',
            { y: () => window.innerHeight * 0.6, scale: 0.86 },
            { y: 0, scale: 1, ease: 'power2.inOut', duration: OPEN },
            0,
          )
          .fromTo(
            '[data-side]',
            { opacity: 0, filter: 'blur(14px)', x: (i: number) => (i ? 80 : -80) },
            { opacity: 1, filter: 'blur(0px)', x: 0, ease: 'power2.out', duration: 0.09, stagger: 0.03 },
            OPEN - 0.04,
          )
          .to(
            '[data-side]',
            { opacity: 0, filter: 'blur(14px)', x: (i: number) => (i ? 80 : -80), ease: 'power2.in', duration: 0.07 },
            CLOSE - 0.06,
          )
          .to(
            '[data-window-pos]',
            { scale: 0.9, y: -70, opacity: 0, filter: 'blur(8px)', ease: 'power2.in', duration: 1 - CLOSE },
            CLOSE,
          )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative z-10 h-[420vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Backdrop: masked dot field and a cold light from above. */}
        <div
          aria-hidden
          className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_30%,#000_20%,transparent_75%)]"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[-20%] h-[70vh] w-[min(1200px,130vw)] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[120px]"
        />

        <div data-hero-copy className="shell absolute inset-x-0 top-[17vh] text-center">
          <div data-hero-fade className="flex justify-center">
            <p className="inline-flex items-center gap-1 rounded-full border border-edge bg-panel/80 p-1 font-mono text-[0.64rem] uppercase tracking-[0.12em] backdrop-blur">
              <span className="rounded-full bg-raised px-3 py-1 text-fg">{hero.eyebrow}</span>
              <span className="hidden px-3 text-dim sm:inline">{hero.location}</span>
            </p>
          </div>
          <h1
            data-hero-title
            className="display mx-auto mt-7 max-w-[13em] text-balance text-[clamp(3rem,6.6vw,7.5rem)] leading-[0.96]"
          >
            {hero.title[0]}
            <em className="silver whitespace-nowrap">{hero.title[1]}</em>
          </h1>
          <p data-hero-fade className="mx-auto mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-dim md:text-lg">
            {hero.body}
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={links.contact}>{hero.primary}</Button>
            <Button href={links.services} variant="ghost">
              {hero.secondary}
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[12vh] flex justify-center px-4">
          <div data-window-pos className="relative w-[min(1120px,100%)] origin-top">
            <div data-window className="h-[66svh] max-h-[680px] md:h-[74vh]">
              <SystemWindow step={step} typed={typed} />
            </div>

            <div data-side className="absolute -left-28 bottom-[7%] hidden w-[14rem] opacity-0 xl:block">
              <ProjectPeek />
            </div>
            <div data-side className="absolute -right-28 top-[12%] hidden w-[12.5rem] opacity-0 xl:block">
              <LeadershipPeek />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
