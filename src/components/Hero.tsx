import { useRef } from 'react'
import { contact, hero, howWeWork, links, offerings, services, systemMap } from '../content'
import { projects } from '../data/projects'
import { gsap, SplitText, useGSAP } from '../lib/motion'
import { Button, EASE } from './ui'

const stats = [
  { n: services.practices.length, label: 'Connected practices' },
  { n: offerings.length, label: 'Offerings' },
  { n: howWeWork.phases.reduce((sum, p) => sum + p.stages.length, 0), label: 'Delivery stages' },
  { n: projects.length, label: 'Recent projects' },
]

// Two columns on phones, four from tablet up; rules sit between cells only.
const statCells = ['', 'border-l pl-6 md:pl-8', 'border-t md:border-l md:border-t-0 md:pl-8', 'border-l border-t pl-6 md:border-t-0 md:pl-8']

// Offerings that drift around the brief: [label, left, top, scroll speed].
const chips = [
  ['Agentic Systems', '2%', '14px', 0.6],
  ['Legacy Modernization', '7%', '118px', 1],
  ['RAG & Retrieval', '0%', '222px', 0.75],
  ['Cloud & DevOps', '79%', '0px', 0.9],
  ['Workflow Automation', '84%', '104px', 0.55],
  ['Voice AI', '81%', '214px', 1.1],
] as const

const phaseStages = howWeWork.phases.map((p) => `Stages ${p.stages[0].n}–${p.stages.at(-1)!.n}`)
const pad = (n: number) => String(n).padStart(2, '0')

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = SplitText.create('[data-intro-title] > span', { type: 'lines', mask: 'lines' })
        const typed = root.current!.querySelector<HTMLElement>('[data-typed]')!
        const full = typed.textContent ?? ''
        typed.textContent = ''

        const tl = gsap.timeline({ defaults: { ease: EASE, duration: 1.3 } })
        tl.from('[data-intro-label]', { opacity: 0, y: 14 }, 0.1)
          .from(title.lines, { yPercent: 105, stagger: 0.12, duration: 1.5 }, 0.2)
          .from('[data-intro-body]', { opacity: 0, y: 22 }, 0.6)
          .from('[data-intro-cta] > *', { opacity: 0, y: 18, stagger: 0.08 }, 0.72)
          .from('[data-brief]', { opacity: 0, y: 60, scale: 0.97, duration: 1.6 }, 0.85)
          .from('[data-chip-inner]', { opacity: 0, scale: 0.86, stagger: 0.12, duration: 1.1 }, 1.2)

        // The brief writes itself, then the plan fills in beneath it.
        const chars = { n: 0 }
        tl.to(chars, { n: full.length, duration: full.length * 0.024, ease: 'none', onUpdate: () => (typed.textContent = full.slice(0, Math.round(chars.n))) }, 1.5)
        tl.from('[data-brief-row]', { opacity: 0, y: 12, stagger: 0.16, duration: 1 }, '>-0.1')

        tl.from('[data-intro-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.8, ease: 'expo.inOut' }, 1)
        tl.from('[data-intro-stat]', { opacity: 0, y: 20, stagger: 0.09 }, 1.3)
        gsap.utils.toArray<HTMLElement>('[data-intro-n]').forEach((el, i) => {
          const v = { n: 0 }
          tl.to(v, { n: Number(el.dataset.introN), duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = pad(Math.round(v.n))) }, 1.35 + i * 0.09)
        })

        // Each chip floats on its own slow breath.
        gsap.utils.toArray<HTMLElement>('[data-chip-inner]').forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 7 : -7, duration: 2.8 + (i % 3) * 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 + i * 0.2 })
        })

        return () => {
          title.revert()
          typed.textContent = full
        }
      })

      // Desktop: the three layers spread out from behind the brief as the page scrolls.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = root.current!.querySelector<HTMLElement>('[data-stage]')!
        const brief = stage.querySelector<HTMLElement>('[data-brief]')!
        // Layout positions inside the stage, unaffected by any transform in flight.
        const centre = (el: HTMLElement) => {
          let x = el.offsetWidth / 2
          let y = el.offsetHeight / 2
          for (let n: HTMLElement | null = el; n && n !== stage; n = n.offsetParent as HTMLElement | null) {
            x += n.offsetLeft
            y += n.offsetTop
          }
          return { x, y }
        }
        const from = (card: HTMLElement) => ({ x: stage.clientWidth / 2 - centre(card).x, y: centre(brief).y - centre(card).y })
        gsap.utils.toArray<HTMLElement>('[data-layer]').forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              x: () => from(card).x,
              y: () => from(card).y,
              scale: 0.82,
              rotate: (i - 1) * -5,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
              opacity: 1,
              ease: 'none',
              immediateRender: true,
              // From the very top of the page until the stage nears the top of the screen.
              scrollTrigger: {
                start: 0,
                end: () => stage.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.14,
                scrub: 0.9,
                invalidateOnRefresh: true,
              },
            },
          )
        })
        gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((el) => {
          gsap.to(el, { y: -140 * Number(el.dataset.chip), ease: 'none', scrollTrigger: { trigger: stage, start: 'top 80%', end: 'bottom top', scrub: true } })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="pt-16">
      <div className="frame pb-16 pt-24 md:pt-32">
        <p data-intro-label className="label">
          {hero.location} &nbsp;—&nbsp; {hero.eyebrow}
        </p>
        <div className="mt-7 grid gap-10 lg:grid-cols-[1.9fr_1fr] lg:items-end lg:gap-16">
          <h1 data-intro-title className="heading text-[clamp(2.3rem,4.2vw,3.3rem)] !leading-[1.06]">
            <span className="block text-fg">{hero.title[0].trim()}</span>
            <span className="block text-fg-3">{hero.title[1]}</span>
          </h1>
          <div>
            <p data-intro-body className="max-w-[26rem] text-[16px] leading-[1.65] text-fg-2">
              {hero.body}
            </p>
            <div data-intro-cta className="mt-8 flex flex-wrap gap-2.5">
              <Button href={links.contact}>{hero.primary}</Button>
              <Button href="#services" variant="ghost">
                {hero.secondary}
              </Button>
            </div>
          </div>
        </div>

        <div data-stage className="relative mt-20 flex flex-col gap-3 lg:mt-24 lg:block lg:h-[580px]">
          {chips.map(([label, left, top, speed]) => (
            <span key={label} data-chip={speed} className="absolute hidden lg:block" style={{ left, top }}>
              <span data-chip-inner className="block rounded-full border border-line-2 bg-black px-3.5 py-1.5 text-[12.5px] text-fg-2">
                {label}
              </span>
            </span>
          ))}

          <div data-brief className="relative z-10 rounded-2xl border border-line-2 bg-s1 lg:absolute lg:left-1/2 lg:top-0 lg:w-[600px] lg:-translate-x-1/2">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="text-[13px] text-fg-2">{contact.title.join('')}</span>
              <span className="label !text-[10px]">{hero.location}</span>
            </div>
            <div className="px-5 pb-5 pt-5">
              <p className="label !text-[10px]">The brief</p>
              <p className="mt-2.5 min-h-[3.2em] text-[17px] leading-[1.5] tracking-[-0.015em] text-fg">
                <span data-typed>{contact.lead}</span>
                <span className="ml-0.5 inline-block h-[1.05em] w-px translate-y-[0.18em] animate-[blink_1s_steps(1)_infinite] bg-fg" aria-hidden />
              </p>
              <ul className="mt-4 border-b border-line">
                {howWeWork.phases.map((p, i) => (
                  <li key={p.name} data-brief-row className="grid grid-cols-[5rem_1fr_auto] items-baseline gap-4 border-t border-line py-2.5 text-[14px]">
                    <span className="text-fg">{p.name}</span>
                    <span className="text-fg-2">{p.outcome}</span>
                    <span className="font-mono text-[11px] text-fg-4">{phaseStages[i]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="grid gap-3 lg:absolute lg:inset-x-0 lg:top-[330px] lg:grid-cols-3 lg:gap-6">
            {systemMap.layers.map((l) => {
              const [layer, practice] = l.label.split(' / ')
              return (
                <li key={l.title} data-layer className="flex flex-col rounded-2xl border border-line-2 bg-s1 p-5 lg:min-h-[236px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label !text-[10px]">{layer}</span>
                    <span className="text-[12.5px] text-fg-3">{practice}</span>
                  </div>
                  <h3 className="mt-6 text-[17px] font-medium tracking-[-0.025em]">{l.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-fg-3">{l.body}</p>
                  <p className="mt-auto border-t border-line pt-3 text-[13.5px] text-fg">{l.outcome}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="relative">
        <span data-intro-rule className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
        <dl className="frame grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} data-intro-stat className={`border-line py-8 md:py-10 ${statCells[i]}`}>
              <dd data-intro-n={s.n} className="heading text-[clamp(2rem,3.4vw,2.75rem)] tabular-nums">
                {pad(s.n)}
              </dd>
              <dt className="mt-2 text-[14px] text-fg-3">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
