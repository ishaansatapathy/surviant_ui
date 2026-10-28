import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { recentWork } from '../content'
import { projects } from '../data/projects'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import { Eyebrow, Headline, useInView, Window } from './ui'

const AUTOPLAY_MS = 4000
const pad = (n: number) => String(n).padStart(2, '0')

export function RecentWork() {
  const stage = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [held, setHeld] = useState(false)
  const touchX = useRef(0)
  const inView = useInView(stage)
  const total = projects.length
  const project = projects[index]
  const running = !held && inView && !reducedMotion()

  const go = (next: number, dir: number) => {
    setDirection(dir)
    setIndex((next + total) % total)
  }

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => go(index + 1, 1), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [index, running])

  const first = useRef(true)
  useGSAP(
    () => {
      if (first.current) {
        first.current = false
        return
      }
      gsap.fromTo(
        '[data-card-shell]',
        { rotate: direction * 1, scale: 0.985, y: 10 },
        { rotate: 0, scale: 1, y: 0, duration: 0.55, ease: 'expo.out' },
      )
      gsap.fromTo(
        '[data-card-part]',
        { y: 18 * direction, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.03, ease: 'expo.out' },
      )
    },
    { dependencies: [index], scope: stage },
  )

  const extra = project.features.length - recentWork.visibleFeatures

  return (
    <section id="portfolio" className="relative z-10 py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>{recentWork.eyebrow}</Eyebrow>
            <Headline text={recentWork.title} className="mt-6 text-[clamp(2.75rem,6vw,6rem)]" />
          </div>
          <p data-reveal className="self-end text-lg leading-relaxed text-dim md:col-span-4 md:col-start-9">
            {recentWork.body}
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
          {/* Index */}
          <ol data-lenis-prevent className="no-scrollbar hidden max-h-[44rem] overflow-y-auto lg:block">
            {projects.map((p, i) => (
              <li key={p.title}>
                <button
                  type="button"
                  onClick={() => go(i, i >= index ? 1 : -1)}
                  aria-current={i === index}
                  className={`group flex w-full items-baseline gap-4 border-t border-edge-soft py-3 text-left transition-colors duration-300 ${
                    i === index ? 'text-fg' : 'text-faint hover:text-dim'
                  }`}
                >
                  <span className={`font-mono text-[0.68rem] ${i === index ? 'text-accent' : ''}`}>{pad(i + 1)}</span>
                  <span className="flex-1 text-[0.92rem] leading-snug">{p.title}</span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 ${
                      i === index ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>

          {/* Card stack: autoplay pauses while hovered or focused; swipe on touch. */}
          <div
            ref={stage}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
            }}
          >
            <div className="relative pb-6">
              <span aria-hidden className="absolute inset-x-10 bottom-0 top-10 rounded-xl border border-edge-soft bg-panel/40" />
              <span aria-hidden className="absolute inset-x-5 bottom-3 top-5 rounded-xl border border-edge-soft bg-panel/70" />

              <div data-card-shell className="relative">
                <Window title={`${recentWork.eyebrow} — ${pad(index + 1)} / ${pad(total)}`} bodyClassName="p-7 md:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-xs text-faint">
                      <span className="text-accent">{pad(index + 1)}</span> / {pad(total)}
                    </span>
                    <span className="rounded-full border border-edge bg-raised px-3.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-accent">
                      {project.industry}
                    </span>
                  </div>

                  <h3 data-card-part className="display mt-8 text-[clamp(2.3rem,4.4vw,4.25rem)] leading-[1.02]">
                    {project.title}
                  </h3>
                  <p data-card-part className="mt-4 max-w-2xl text-lg leading-relaxed text-dim">
                    {project.description}
                  </p>

                  <div data-card-part className="mt-10 grid gap-10 border-t border-edge pt-8 md:grid-cols-2">
                    <div>
                      <p className="eyebrow">{recentWork.keyFeatures}</p>
                      <ul className="mt-4 space-y-2.5">
                        {project.features.slice(0, recentWork.visibleFeatures).map((f) => (
                          <li key={f} className="flex gap-3 text-[0.93rem] leading-snug text-fg/90">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      {extra > 0 && <p className="mt-3 pl-7 text-sm font-medium text-accent">+{extra} more features</p>}
                    </div>

                    <div className="flex flex-col gap-8">
                      <div>
                        <p className="eyebrow">{recentWork.technologies}</p>
                        <ul className="mt-4 flex flex-wrap gap-1.5">
                          {project.technologies.map((t) => (
                            <li
                              key={t}
                              className="rounded-md border border-edge-soft bg-raised px-2 py-1 font-mono text-[0.66rem] text-dim"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="eyebrow">{recentWork.bestFor}</p>
                          <p className="mt-2 text-[0.9rem] leading-snug">{project.bestFor}</p>
                        </div>
                        <div>
                          <p className="eyebrow">{recentWork.timeToDevelop}</p>
                          <p className="mt-2 text-[0.9rem] font-semibold">
                            {project.months} {project.months === 1 ? 'month' : 'months'}
                          </p>
                          <div className="mt-2 flex gap-1" aria-hidden>
                            {Array.from({ length: 6 }, (_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 w-4 rounded-sm transition-colors duration-500 ${
                                  i < project.months ? 'bg-accent' : 'bg-edge'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Window>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              Project {index + 1} of {total}: {project.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
