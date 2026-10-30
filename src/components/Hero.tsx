import { ArrowRight, ArrowUp, Check, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { contact, footer, hero, howWeWork, links, offerings, services, systemMap } from '../content'
import { gsap, reducedMotion, SplitText, useGSAP } from '../lib/motion'
import { Button, Chip, phaseTones, practiceTones, tones, useInView, useSteps, WindowBar } from './ui'

type Stage = 'compose' | 'sent' | 'thinking' | 'answer' | 'reset'

/** The brief, written live: typed, sent, thought about, answered with a plan. */
function useBrief(running: boolean) {
  const lead = contact.lead
  const [stage, setStage] = useState<Stage>('compose')
  const [chars, setChars] = useState(0)
  const [rows, setRows] = useState(0)

  useEffect(() => {
    if (reducedMotion()) {
      setStage('answer')
      setChars(lead.length)
      setRows(3)
      return
    }
    if (!running) return
    let t = 0
    const after = (ms: number, fn: () => void) => (t = window.setTimeout(fn, ms))
    if (stage === 'compose') {
      if (chars < lead.length) after(chars === 0 ? 1300 : 22 + Math.random() * 34, () => setChars((c) => c + 1))
      else after(650, () => setStage('sent'))
    } else if (stage === 'sent') after(500, () => setStage('thinking'))
    else if (stage === 'thinking') after(1500, () => setStage('answer'))
    else if (stage === 'answer') {
      if (rows < 3) after(rows === 0 ? 700 : 650, () => setRows((r) => r + 1))
      else after(5200, () => setStage('reset'))
    } else
      after(700, () => {
        setChars(0)
        setRows(0)
        setStage('compose')
      })
    return () => window.clearTimeout(t)
  }, [running, stage, chars, rows, lead.length])

  return { lead, stage, chars, rows }
}

const stageRange = (i: number) => {
  const s = howWeWork.phases[i].stages
  return `${s[0].n}–${s[s.length - 1].n}`
}

function Composer({ text, caret, placeholder }: { text: string; caret?: boolean; placeholder?: string }) {
  return (
    <div className="rounded-xl border border-line-2 bg-s2 p-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)]">
      <p className="min-h-[2.6rem] text-[0.84rem] leading-snug text-fg">
        {text ? (
          <>
            {text}
            {caret && (
              <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em] animate-[caret_1s_steps(1)_infinite] bg-blue" />
            )}
          </>
        ) : (
          <span className="text-fg-4">{placeholder}</span>
        )}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="grid h-6 w-6 place-items-center rounded-md border border-line text-fg-3">
          <Plus className="h-3 w-3" />
        </span>
        <span className="flex items-center gap-2 text-[0.7rem] text-fg-3">
          {hero.location}
          <span className={`grid h-6 w-6 place-items-center rounded-md transition-colors ${text ? 'bg-fg text-black' : 'bg-s4 text-fg-3'}`}>
            <ArrowUp className="h-3 w-3" />
          </span>
        </span>
      </div>
    </div>
  )
}

function Workspace({ running }: { running: boolean }) {
  const { lead, stage, chars, rows } = useBrief(running)
  const composing = stage === 'compose'
  const thread = stage === 'sent' || stage === 'thinking' || stage === 'answer'
  const sidebarItems = ['Services', 'How We Work', 'Work', 'About']

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-2 bg-s1 shadow-[0_50px_140px_-40px_rgba(0,0,0,1)]">
      <WindowBar>
        <span className="font-mono text-[0.7rem] text-fg-3">surviant / {links.contact.slice(1)}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.7rem] text-fg-3">
          <span className="h-1.5 w-1.5 rounded-full bg-green shadow-[0_0_8px] shadow-green" />
          {hero.location}
        </span>
      </WindowBar>

      <div className="flex h-[440px] md:h-[500px]">
        {/* Sidebar */}
        <aside className="hidden w-[200px] shrink-0 flex-col border-r border-line p-3 md:flex">
          <div className="flex items-center gap-2 px-1.5 py-1">
            <img src="/images/surviant-logo.jpg" alt="" className="h-5 w-5 rounded-[5px]" />
            <span className="text-[0.82rem] font-medium">Surviant</span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-s2 px-2.5 py-1.5 text-[0.74rem] text-fg-3">
            Search
            <kbd className="font-mono text-[0.65rem] text-fg-4">⌘K</kbd>
          </div>
          <ul className="mt-3 space-y-0.5 text-[0.78rem]">
            <li className="rounded-md bg-white/[0.06] px-2 py-1.5 text-fg">{contact.cta}</li>
            {sidebarItems.map((s) => (
              <li key={s} className="px-2 py-1.5 text-fg-3">
                {s}
              </li>
            ))}
          </ul>
          <p className="kicker mt-6 px-2 !text-[0.6rem]">Practices</p>
          <ul className="mt-2 space-y-0.5 text-[0.76rem]">
            {services.practices.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2 px-2 py-1.5 text-fg-2">
                <span className={`h-2 w-2 rounded-[3px] ${practiceTones[i].bg}`} />
                <span className="truncate">{p.name}</span>
                <span className="ml-auto font-mono text-[0.65rem] text-fg-4">{p.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto px-2 font-mono text-[0.65rem] text-fg-4">{offerings.length} offerings</p>
        </aside>

        {/* Conversation */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-5 text-[0.78rem]">
            <span className="text-fg-2">{contact.title.join('')}</span>
            <span className="font-mono text-[0.65rem] text-fg-4">{howWeWork.phases.map((p) => p.name).join(' / ')}</span>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {/* Greeting + composer before sending */}
            <div
              className={`absolute inset-x-5 top-1/2 -translate-y-1/2 transition-[opacity,transform,filter] duration-700 ease-out md:inset-x-10 ${
                composing ? 'opacity-100' : 'pointer-events-none -translate-y-[65%] opacity-0 blur-sm'
              }`}
            >
              <p className="text-center text-[1.3rem] font-medium tracking-[-0.035em] text-fg md:text-[1.45rem]">{footer.prompt.title}</p>
              <div className="mt-5">
                <Composer text={lead.slice(0, chars)} caret={composing} placeholder={footer.prompt.body} />
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {services.practices.map((p, i) => (
                  <Chip key={p.name}>
                    <span className={`h-1.5 w-1.5 rounded-full ${practiceTones[i].bg}`} />
                    {p.name}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Thread */}
            <div
              className={`absolute inset-0 overflow-hidden px-5 pt-5 transition-opacity duration-500 md:px-10 ${
                thread ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-s3 px-4 py-2.5 text-[0.82rem] leading-snug text-fg">
                {lead}
              </div>

              <div className="relative mt-5 min-h-[1.5rem]">
                <p
                  className={`shimmer absolute left-0 top-0 text-[0.82rem] font-medium transition-opacity duration-300 ${
                    stage === 'thinking' || stage === 'sent' ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Thinking
                </p>
                <p
                  className={`text-[0.84rem] leading-relaxed text-fg-2 transition-[opacity,filter] duration-700 ${
                    stage === 'answer' ? 'opacity-100 blur-0' : 'opacity-0 blur-[3px]'
                  }`}
                >
                  {contact.body}
                </p>
              </div>

              <ul className="mt-4 space-y-2">
                {howWeWork.phases.map((ph, i) => (
                  <li
                    key={ph.name}
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-line bg-s2 px-3.5 py-2.5 transition-[opacity,transform,filter] duration-700 ease-out ${
                      stage === 'answer' && i < rows ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-2 opacity-0 blur-[2px]'
                    }`}
                  >
                    <span className={`grid h-6 w-6 place-items-center rounded-md ${phaseTones[i].soft} ${phaseTones[i].text}`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.82rem] text-fg">
                        {ph.name}
                        <span className="text-fg-3"> · {ph.outcome}</span>
                      </span>
                      <span className="hidden truncate text-[0.74rem] text-fg-3 sm:block">{ph.body}</span>
                    </span>
                    <span className={`font-mono text-[0.65rem] ${phaseTones[i].text}`}>{stageRange(i)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`shrink-0 px-5 pb-5 transition-opacity duration-500 md:px-10 ${thread ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden
          >
            <Composer text="" placeholder={footer.prompt.body} />
          </div>
        </div>

        {/* System panel */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-l border-line p-5 lg:flex">
          <p className="kicker !text-[0.6rem]">{systemMap.eyebrow.split(' / ')[0]}</p>
          <ul className="mt-4 space-y-5">
            {systemMap.layers.map((l, i) => {
              const tone = [tones.orange, tones.blue, tones.violet][i]
              const done = stage === 'answer' && rows > i
              return (
                <li key={l.title}>
                  <p className={`font-mono text-[0.62rem] ${tone.text}`}>{l.label.split(' / ')[0]}</p>
                  <p className="mt-1 text-[0.8rem] text-fg">{l.title}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full origin-left rounded-full ${tone.bg} transition-transform duration-[1400ms] ease-out`}
                      style={{ transform: `scaleX(${done ? 1 : 0.06})` }}
                    />
                  </div>
                  <p className={`mt-1.5 text-[0.72rem] text-fg-3 transition-opacity duration-700 ${done ? 'opacity-100' : 'opacity-0'}`}>
                    {l.outcome}
                  </p>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>
    </div>
  )
}

/** Floating card: stage 05, its checks ticking off. */
function TestCard({ running }: { running: boolean }) {
  const stage = howWeWork.phases[1].stages[1]
  const checks = ['Software behavior', 'AI quality', 'Failure paths', 'Performance', 'Accessibility']
  const n = useSteps(running, checks.length, 650, 2600)
  return (
    <div className="w-[236px] rounded-xl border border-line-2 bg-s2/90 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
      <p className="font-mono text-[0.62rem] text-blue">Stage {stage.n}</p>
      <p className="mt-1 text-[0.82rem] text-fg">{stage.name}</p>
      <ul className="mt-3 space-y-1.5">
        {checks.map((c, i) => (
          <li key={c} className="flex items-center gap-2 text-[0.74rem]">
            <span
              className={`grid h-4 w-4 place-items-center rounded-full border transition-colors duration-500 ${
                i < n ? 'border-green bg-green text-black' : 'border-line-2 text-transparent'
              }`}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className={i < n ? 'text-fg-2' : 'text-fg-4'}>{c}</span>
          </li>
        ))}
      </ul>
      <p className={`mt-3 text-[0.7rem] transition-opacity duration-700 ${n === checks.length ? 'text-green opacity-100' : 'opacity-0'}`}>
        {stage.outcome}
      </p>
    </div>
  )
}

/** Floating card: stage 06, a live system trace. */
function RunCard() {
  const stage = howWeWork.phases[2].stages[0]
  return (
    <div className="w-[230px] rounded-xl border border-line-2 bg-s2/90 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.62rem] text-green">Stage {stage.n}</p>
        <span className="inline-flex items-center gap-1 text-[0.62rem] text-fg-3">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Live
        </span>
      </div>
      <p className="mt-1 text-[0.82rem] text-fg">{stage.name}</p>
      <svg viewBox="0 0 200 56" className="mt-3 h-14 w-full" aria-hidden>
        <defs>
          <linearGradient id="run-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3fd48c" stopOpacity="0.28" />
            <stop offset="1" stopColor="#3fd48c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 40 C20 38 26 30 44 32 S70 18 88 24 S118 36 132 22 S166 10 200 14 V56 H0Z" fill="url(#run-fill)" />
        <path
          data-run-line
          d="M0 40 C20 38 26 30 44 32 S70 18 88 24 S118 36 132 22 S166 10 200 14"
          fill="none"
          stroke="#3fd48c"
          strokeWidth="1.5"
          pathLength={1}
          strokeDasharray="1"
        />
      </svg>
      <p className="mt-2 text-[0.7rem] text-fg-3">{stage.outcome}</p>
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const inView = useInView(tilt)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(title.current, { type: 'words' })
        gsap
          .timeline({ delay: 0.1 })
          .from('[data-hero-in]', { opacity: 0, y: 12, filter: 'blur(10px)', duration: 1.3, stagger: 0.09, ease: 'expo.out' }, 0)
          .from(split.words, { opacity: 0, y: 10, filter: 'blur(14px)', duration: 1.3, stagger: 0.05, ease: 'expo.out' }, 0.1)
          .from('[data-hero-window]', { opacity: 0, y: 120, duration: 1.8, ease: 'expo.out' }, 0.5)
          .from('[data-hero-glow]', { opacity: 0, duration: 2.4, ease: 'power2.out' }, 0.9)
          .from('[data-hero-side]', { opacity: 0, y: 40, filter: 'blur(8px)', duration: 1.4, stagger: 0.18, ease: 'expo.out' }, 1.3)
          .fromTo('[data-run-line]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 1.6)

        // The window starts tipped back and settles flat as the page scrolls.
        gsap.fromTo(
          tilt.current,
          { rotateX: 16, scale: 0.92 },
          {
            rotateX: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: tilt.current, start: 'top 100%', end: 'top 20%', scrub: 0.6 },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
          gsap.to(el, {
            y: -Number(el.dataset.depth) * 120,
            ease: 'none',
            scrollTrigger: { trigger: tilt.current, start: 'top 80%', end: 'bottom top', scrub: true },
          })
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative pt-32 md:pt-40">
      <div className="wrap text-center">
        <a
          data-hero-in
          href={links.services}
          className="group inline-flex items-center gap-2 rounded-full border border-line-2 py-1 pl-1 pr-3 text-[0.8rem] text-fg-2 transition-colors hover:border-white/25"
        >
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.7rem] font-medium text-fg">{hero.location}</span>
          {hero.eyebrow}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 ref={title} className="display mx-auto mt-7 max-w-[17ch] text-balance text-[clamp(2.4rem,5vw,3.6rem)]">
          <span className="text-fg">{hero.title[0]}</span>
          <span className="text-fg-3">{hero.title[1]}</span>
        </h1>

        <p data-hero-in className="mx-auto mt-5 max-w-[32rem] text-[1rem] leading-relaxed text-fg-3 md:text-[1.0625rem]">
          {hero.body}
        </p>
        <div data-hero-in className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Button href={links.contact}>{hero.primary}</Button>
          <Button href="#services" variant="ghost">
            {hero.secondary}
          </Button>
        </div>
      </div>

      <div className="wrap mt-16 md:mt-20 [perspective:1800px]">
        <div ref={tilt} className="relative origin-top [transform-style:preserve-3d]">
          {/* Light leaking over the window's top edge */}
          <div data-hero-glow className="pointer-events-none absolute inset-x-[8%] -top-24 h-56" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_25%_70%,rgba(255,140,82,0.35),transparent),radial-gradient(45%_60%_at_55%_75%,rgba(163,148,255,0.4),transparent),radial-gradient(45%_60%_at_82%_70%,rgba(78,162,255,0.38),transparent)] blur-2xl" />
          </div>
          <div className="pointer-events-none absolute inset-x-[12%] top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden />

          <div data-hero-window className="relative">
            <Workspace running={inView} />
          </div>

          <div data-hero-side className="absolute -bottom-16 -left-20 z-20 hidden xl:block">
            <div data-depth="0.35">
              <TestCard running={inView} />
            </div>
          </div>
          <div data-hero-side className="absolute -bottom-24 -right-16 z-20 hidden xl:block">
            <div data-depth="0.6">
              <RunCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
