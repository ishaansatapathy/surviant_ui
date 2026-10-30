import { Check } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { contact, howWeWork, links } from '../content'
import { gsap, ScrollTrigger, scrollToTarget, useGSAP } from '../lib/motion'
import { Chip, Kicker, phaseTones, TextLink, Title, useInView, useSteps, WindowBar } from './ui'

const [think, build, sustain] = howWeWork.phases

function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-2 bg-black ${className}`}>
      <WindowBar>
        <span className="truncate text-[0.74rem] text-fg-2">{title}</span>
      </WindowBar>
      {children}
    </div>
  )
}

/** Think: the brief is read, the direction is checked off, the plan gets reviewed. */
function ThinkVisual({ on }: { on: boolean }) {
  const n = useSteps(on, think.stages.length + 1, 900, 600)
  const tone = phaseTones[0]
  return (
    <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
      <Panel title={think.stages[0].outcome}>
        <div className="p-5">
          <p className="kicker !text-[0.6rem]">{think.stages[0].name}</p>
          <p className="mt-3 text-[0.84rem] leading-relaxed text-fg-2">{think.stages[0].body}</p>
          <div className={`mt-5 border-l-2 py-1 pl-4 ${tone.border}`}>
            <p className={`font-mono text-[0.6rem] uppercase tracking-wider ${tone.text}`}>Constraint</p>
            <p className="mt-1.5 text-[0.84rem] leading-snug text-fg">{contact.lead}</p>
          </div>
        </div>
      </Panel>
      <Panel title={think.outcome}>
        <ul className="p-3">
          {think.stages.map((s, i) => {
            const done = i < n
            return (
              <li key={s.n} className="flex items-start gap-3 rounded-lg px-2 py-2.5">
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-500 ${
                    done ? `${tone.ring} ${tone.soft} ${tone.text}` : 'border-line-2 text-transparent'
                  }`}
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[0.82rem] transition-colors duration-500 ${done ? 'text-fg' : 'text-fg-3'}`}>
                    <span className="font-mono text-[0.7rem] text-fg-4">{s.n} </span>
                    {s.name}
                  </span>
                  <span className={`mt-1 block text-[0.72rem] transition-opacity duration-500 ${done ? `${tone.text} opacity-100` : 'opacity-0'}`}>
                    {s.outcome}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
        <div className="border-t border-line px-5 py-3">
          <Chip tone={n > think.stages.length ? phaseTones[2] : undefined} className="transition-colors duration-500">
            <Check className="h-3 w-3" />
            {think.stages[2].outcome}
          </Chip>
        </div>
      </Panel>
    </div>
  )
}

const increments = ['Increment 1', 'Increment 2', 'Increment 3', 'Increment 4']
const checks = ['Software behavior', 'AI quality', 'Failure paths', 'Performance', 'Accessibility', 'Release conditions']

/** Build: increments move through review, and the evidence for release fills in. */
function BuildVisual({ on }: { on: boolean }) {
  const shipped = useSteps(on, increments.length, 1100, 500)
  const tested = useSteps(on, checks.length, 520, 900)
  const tone = phaseTones[1]
  return (
    <div className="grid gap-4">
      <Panel title={build.stages[0].outcome}>
        <div className="relative px-5 py-6">
          <div className="absolute left-10 right-10 top-1/2 h-px bg-line" aria-hidden />
          <div
            className={`absolute left-10 top-1/2 h-px origin-left ${tone.bg} transition-transform duration-1000 ease-out`}
            style={{ right: '2.5rem', transform: `scaleX(${Math.min(shipped, increments.length - 1) / (increments.length - 1)})` }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-4 gap-2">
            {increments.map((inc, i) => {
              const state = i < shipped - 1 || shipped === increments.length ? 'shipped' : i === shipped - 1 ? 'review' : 'queued'
              return (
                <li key={inc} className="flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border bg-black px-2.5 py-1 text-[0.68rem] transition-colors duration-500 ${
                      state === 'shipped'
                        ? 'border-green/30 text-green'
                        : state === 'review'
                          ? `${tone.ring} ${tone.text}`
                          : 'border-line text-fg-4'
                    }`}
                  >
                    {state === 'review' ? (
                      <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
                    ) : (
                      <span className={`h-1.5 w-1.5 rounded-full ${state === 'shipped' ? 'bg-green' : 'bg-fg-4'}`} />
                    )}
                    <span className="hidden sm:inline">{inc}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </Panel>
      <Panel title={build.stages[1].outcome}>
        <ul className="grid gap-x-8 px-5 py-3 md:grid-cols-2">
          {checks.map((c, i) => {
            const done = i < tested
            return (
              <li key={c} className="flex items-center gap-3 border-b border-line py-2.5 text-[0.8rem] md:[&:nth-last-child(-n+2)]:border-0">
                <span className={`w-36 shrink-0 transition-colors duration-500 ${done ? 'text-fg' : 'text-fg-3'}`}>{c}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className={`block h-full origin-left rounded-full transition-[transform,background-color] duration-700 ease-out ${done ? 'bg-green' : tone.bg}`}
                    style={{ transform: `scaleX(${done ? 1 : 0})` }}
                  />
                </span>
                <Check className={`h-3.5 w-3.5 transition-opacity duration-500 ${done ? 'text-green opacity-100' : 'opacity-0'}`} />
              </li>
            )
          })}
        </ul>
      </Panel>
    </div>
  )
}

const signals = ['Monitoring', 'Documentation', 'Maintenance', 'Response path']
const nextMoves = ['Improve a workflow', 'Add a capability', 'Simplify what exists']

/** Sustain: the live system is watched, and the evidence points at the next move. */
function SustainVisual({ on }: { on: boolean }) {
  const lit = useSteps(on, signals.length, 380, 700)
  const pick = useSteps(on, nextMoves.length, 1300, 2200)
  const line = useRef<SVGPathElement>(null)

  useGSAP(() => {
    if (!on || !line.current) return
    gsap.fromTo(line.current, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
  }, [on])

  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
      <Panel title={sustain.stages[0].outcome}>
        <div className="p-5">
          <div className="flex items-center gap-2 text-[0.74rem] text-fg-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px] shadow-green" />
            {sustain.stages[0].name}
          </div>
          <svg viewBox="0 0 300 110" className="mt-4 h-32 w-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="sustain-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#3fd48c" stopOpacity="0.22" />
                <stop offset="1" stopColor="#3fd48c" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[28, 55, 82].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
            ))}
            <path
              d="M0 80 C24 78 36 70 60 72 S96 52 120 58 S160 74 180 56 S220 34 240 40 S280 22 300 18 V110 H0Z"
              fill="url(#sustain-fill)"
              className={`transition-opacity duration-1000 ${on ? 'opacity-100' : 'opacity-0'}`}
            />
            <path
              ref={line}
              d="M0 80 C24 78 36 70 60 72 S96 52 120 58 S160 74 180 56 S220 34 240 40 S280 22 300 18"
              fill="none"
              stroke="#3fd48c"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </svg>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {signals.map((s, i) => (
              <li key={s} className="flex items-center justify-between rounded-lg border border-line bg-s2 px-3 py-2 text-[0.74rem]">
                <span className={i < lit ? 'text-fg-2' : 'text-fg-4'}>{s}</span>
                <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${i < lit ? 'bg-green' : 'bg-fg-4'}`} />
              </li>
            ))}
          </ul>
        </div>
      </Panel>
      <Panel title={sustain.stages[1].name}>
        <div className="p-5">
          <p className="text-[0.8rem] leading-relaxed text-fg-3">{sustain.stages[1].body}</p>
          <ul className="mt-4 space-y-1.5">
            {nextMoves.map((m, i) => (
              <li
                key={m}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[0.78rem] transition-colors duration-500 ${
                  i === pick - 1 ? 'border-green/30 bg-green/10 text-fg' : 'border-line text-fg-3'
                }`}
              >
                <span className={`h-3 w-3 rounded-full border transition-colors duration-500 ${i === pick - 1 ? 'border-green bg-green' : 'border-line-2'}`} />
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[0.66rem] text-green">{sustain.stages[1].outcome}</p>
        </div>
      </Panel>
    </div>
  )
}

const visuals = [ThinkVisual, BuildVisual, SustainVisual]

function Phase({ i }: { i: number }) {
  const ph = howWeWork.phases[i]
  const tone = phaseTones[i]
  const stage = useRef<HTMLDivElement>(null)
  const on = useInView(stage, '0px 0px -25% 0px', true)
  const Visual = visuals[i]
  return (
    <article data-phase id={`phase-${ph.name.toLowerCase()}`} className="border-b border-line last:border-b-0">
      <div className="px-6 py-12 md:px-12 md:py-16">
        <p className={`font-mono text-[0.68rem] uppercase tracking-[0.12em] ${tone.text}`}>{ph.label}</p>
        <p data-words className="mt-4 max-w-[36rem] text-[clamp(1.2rem,2vw,1.55rem)] font-medium leading-[1.3] tracking-[-0.03em]">
          <span className="text-fg">{ph.outcome}. </span>
          <span className="text-fg-3">{ph.body}</span>
        </p>
      </div>
      <div ref={stage} className="relative overflow-hidden border-t border-line bg-s1 px-4 py-8 md:px-12 md:py-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(45% 70% at 80% 0%, ${tone.hex}1c, transparent 75%)` }}
          aria-hidden
        />
        <div className="relative">
          <Visual on={on} />
        </div>
      </div>
      <ol className={`grid border-t border-line ${ph.stages.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {ph.stages.map((s) => (
          <li key={s.n} className="border-t border-line p-6 first:border-t-0 md:border-l md:border-t-0 md:p-8 md:first:border-l-0">
            <p className={`font-mono text-[0.68rem] ${tone.text}`}>{s.n}</p>
            <h4 className="mt-3 text-[0.95rem] font-medium tracking-[-0.015em]">{s.name}</h4>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-fg-3">{s.body}</p>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-wider text-fg-4">
              {howWeWork.outcomeLabel} <span className="text-fg-2">{s.outcome}</span>
            </p>
          </li>
        ))}
      </ol>
    </article>
  )
}

export function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-phase]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="how-we-work" className="border-t border-line pt-28 md:pt-40">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker>{howWeWork.eyebrow}</Kicker>
            <Title text={howWeWork.title} className="mt-5 text-[clamp(1.85rem,3.4vw,2.75rem)]" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p data-reveal className="text-[0.95rem] leading-relaxed text-fg-3">
              {howWeWork.body}
            </p>
            <TextLink href={links.howWeWork} className="mt-4">
              {howWeWork.link}
            </TextLink>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-line">
        <div className="wrap !px-0 md:!px-8">
          <div className="border-line md:border-x lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden border-r border-line lg:block">
              <nav aria-label="Phases" className="sticky top-16 py-10">
                <ol>
                  {howWeWork.phases.map((ph, i) => {
                    const on = i === active
                    return (
                      <li key={ph.name} className="relative">
                        <span
                          className={`absolute inset-y-0 left-0 w-px transition-colors duration-500 ${on ? phaseTones[i].bg : 'bg-transparent'}`}
                          aria-hidden
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById(`phase-${ph.name.toLowerCase()}`)
                            if (el) scrollToTarget(el)
                          }}
                          className={`block w-full px-6 py-2 text-left text-[0.9rem] transition-colors duration-500 ${on ? 'text-fg' : 'text-fg-4 hover:text-fg-3'}`}
                        >
                          {ph.name}
                        </button>
                        <div
                          className={`grid px-6 transition-[grid-template-rows,opacity] duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            {ph.stages.map((s) => (
                              <p key={s.n} className="flex gap-2 py-1 text-[0.74rem] leading-snug text-fg-3">
                                <span className="font-mono text-fg-4">{s.n}</span>
                                {s.name}
                              </p>
                            ))}
                            <span className="block h-2" />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </nav>
            </aside>
            <div>
              {howWeWork.phases.map((ph, i) => (
                <Phase key={ph.name} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
