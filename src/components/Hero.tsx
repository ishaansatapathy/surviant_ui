import { Mail, MapPin, Mic, Phone, Users, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { contact, email, hero, howWeWork, leadership, links, offerings } from '../content'
import { gsap, reducedMotion, SplitText, useGSAP } from '../lib/motion'
import { Button, Scribble, useInView, Window } from './ui'

type Stage = 'typing' | 'thinking' | 'plan' | 'clear'

/**
 * The brief, written live: the constraint is typed in, then the plan
 * (Think, Build, Sustain) fills itself in underneath. Loops while visible.
 */
function useBriefLoop(running: boolean) {
  const lead = contact.lead
  const [stage, setStage] = useState<Stage>('typing')
  const [chars, setChars] = useState(0)
  const [rows, setRows] = useState(0)

  useEffect(() => {
    if (reducedMotion()) {
      setStage('plan')
      setChars(lead.length)
      setRows(3)
      return
    }
    if (!running) return
    let t: number
    const after = (ms: number, fn: () => void) => {
      t = window.setTimeout(fn, ms)
    }
    if (stage === 'typing') {
      if (chars < lead.length) after(chars === 0 ? 900 : 24 + Math.random() * 30, () => setChars((c) => c + 1))
      else after(500, () => setStage('thinking'))
    } else if (stage === 'thinking') {
      after(1100, () => setStage('plan'))
    } else if (stage === 'plan') {
      if (rows < 3) after(rows === 0 ? 150 : 750, () => setRows((r) => r + 1))
      else after(4200, () => setStage('clear'))
    } else {
      after(650, () => {
        setChars(0)
        setRows(0)
        setStage('typing')
      })
    }
    return () => window.clearTimeout(t)
  }, [running, stage, chars, rows, lead.length])

  return { lead, stage, chars, rows }
}

function BriefWindow({ running }: { running: boolean }) {
  const { lead, stage, chars, rows } = useBriefLoop(running)
  const typing = stage === 'typing'
  const active = Math.max(0, rows - 1)

  return (
    <Window className="h-full" bodyClassName="relative flex h-[calc(100%-1.75rem)] flex-col px-6 pb-6 md:px-8">
      <p className="serif mt-5 text-[1.75rem] md:text-[2.1rem]">{contact.title.join('')}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[0.78rem] text-ink-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1">
          <MapPin className="h-3.5 w-3.5" />
          {hero.location}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1">
          <Users className="h-3.5 w-3.5" />
          {leadership.people.length}
        </span>
      </div>

      <div className={`mt-5 text-[0.86rem] leading-snug transition-opacity duration-500 ${stage === 'clear' ? 'opacity-0' : ''}`}>
        <p className="text-[0.92rem] leading-relaxed text-ink">
          <span className="sr-only">{lead}</span>
          <span aria-hidden>
            {lead.slice(0, chars)}
            {typing && <span className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.2em] animate-[caret_1s_steps(1)_infinite] bg-tang" />}
          </span>
        </p>

        <div className="relative mt-4 space-y-3 border-t border-dashed border-line pt-4">
          {/* Shown between the brief and the plan. */}
          <div
            className={`absolute left-0 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[0.75rem] text-ink-2 shadow-sm transition-all duration-500 ${
              stage === 'thinking' ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
            }`}
            aria-hidden
          >
            <span className="h-3 w-3 animate-[spin_0.9s_linear_infinite] rounded-full border-[1.5px] border-tang border-t-transparent" />
            {howWeWork.title.join('').split('.')[0]}
          </div>

          {howWeWork.phases.map((ph, i) => (
            <div
              key={ph.name}
              className={`transition-all duration-700 ease-out ${i < rows ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
            >
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-ink">{ph.name}</span>
                <span className="text-[0.78rem] text-tang">
                  {howWeWork.outcomeLabel} {ph.outcome}
                </span>
              </p>
              <p className="mt-1 text-ink-2">{ph.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase switch, like a notes / enhanced toggle. */}
      <div className="mt-auto flex justify-center pt-4" aria-hidden>
        <div className="relative grid grid-cols-3 rounded-full border border-line bg-cream p-1 text-[0.78rem]">
          <span
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-sm transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${active * 100}%)`, opacity: rows ? 1 : 0 }}
          />
          {howWeWork.phases.map((ph, i) => (
            <span
              key={ph.name}
              className={`relative z-10 px-4 py-1.5 text-center transition-colors duration-300 ${rows && i === active ? 'text-ink' : 'text-ink-3'}`}
            >
              {ph.name}
            </span>
          ))}
        </div>
      </div>
    </Window>
  )
}

function CallTiles() {
  return (
    <div className="rounded-[16px] bg-[#111] p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]">
      <div className="space-y-1.5">
        {leadership.people.map((p) => (
          <div key={p.name} className="relative aspect-square overflow-hidden rounded-[11px] bg-char">
            <img src={p.image} alt={p.name} className="h-full w-full object-cover object-[center_15%]" />
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[0.62rem] font-medium text-white backdrop-blur">
              {p.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 py-1.5" aria-hidden>
        <span className="grid h-5 w-7 place-items-center rounded-full bg-white/15 text-white">
          <Mic className="h-3 w-3" />
        </span>
        <span className="grid h-5 w-7 place-items-center rounded-full bg-white/15 text-white">
          <Video className="h-3 w-3" />
        </span>
        <span className="grid h-5 w-7 place-items-center rounded-full bg-[#ff3b30] text-white">
          <Phone className="h-3 w-3 rotate-[135deg]" />
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.15 })
        const title = SplitText.create('[data-hero-title]', { type: 'lines' })
        tl.from(title.lines, { y: 50, opacity: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out' })
          .from('[data-hero-fade]', { y: 20, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out' }, 0.25)
          .from(
            '[data-hero-piece]',
            { y: 90, opacity: 0, filter: 'blur(10px)', duration: 1.5, stagger: 0.1, ease: 'expo.out' },
            0.3,
          )
          .to('[data-scribble] path', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.9)

        gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
          gsap.to(el, {
            y: -Number(el.dataset.depth) * 60,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        })
        return () => title.revert()
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-scribble] path', { strokeDashoffset: 0 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[0.95fr_1.1fr] lg:gap-12">
        <div>
          <p data-hero-fade className="inline-flex items-center gap-2 rounded-full bg-cream py-1 pl-1 pr-3.5 text-[0.82rem] text-ink-2">
            <span className="rounded-full bg-tang px-2.5 py-0.5 text-[0.72rem] font-medium text-white">{hero.location}</span>
            {hero.eyebrow}
          </p>

          <h1 data-hero-title className="serif mt-7 text-[clamp(3.1rem,6.3vw,6.1rem)] leading-[0.98]">
            {hero.title[0]}
            <span className="relative inline-block whitespace-nowrap">
              <em className="font-[360]">{hero.title[1]}</em>
              <Scribble manual className="-bottom-2 left-[-2%] h-4 w-[104%] text-tang" />
            </span>
          </h1>

          <p data-hero-fade className="mt-8 max-w-[29rem] text-[1.12rem] leading-relaxed text-ink-2">
            {hero.body}
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
            <Button href={links.contact}>{hero.primary}</Button>
            <Button href={links.services} variant="paper">
              {hero.secondary}
            </Button>
          </div>
          <a
            data-hero-fade
            href={`mailto:${email}`}
            className="mt-8 inline-flex items-center gap-2 text-[0.88rem] text-ink-3 transition-colors hover:text-ink"
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>

        {/* Product composition */}
        <div ref={stage} className="relative h-[480px] sm:h-[560px] lg:h-[min(640px,74vh)] lg:min-h-[560px]">
          <div data-hero-piece className="absolute left-0 top-[12%] h-[76%] w-[40%]">
            <div
              data-depth="0.4"
              className="h-full w-full rounded-[10px] bg-tang bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.16)_0_1px,transparent_1px_10px)]"
            />
          </div>
          <div data-hero-piece className="absolute right-0 top-0 h-[62%] w-[48%]">
            <div data-depth="0.7" className="h-full w-full overflow-hidden rounded-[10px] bg-char p-4">
              <ul className="columns-2 gap-4 font-mono text-[0.6rem] uppercase leading-[1.9] tracking-wider text-white/25" aria-hidden>
                {offerings.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </div>

          <div data-hero-piece className="absolute left-[4%] top-[6%] z-10 h-[88%] w-[92%] sm:left-[11%] sm:w-[68%]">
            <div data-depth="0.15" className="h-full">
              <BriefWindow running={inView} />
            </div>
          </div>

          <div data-hero-piece className="absolute bottom-[3%] right-0 z-20 hidden w-[9.5rem] sm:block lg:-right-2">
            <div data-depth="1.2">
              <CallTiles />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
