import { Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { links, nav, recentWork } from '../content'
import { projects } from '../data/projects'
import { reducedMotion } from '../lib/motion'
import { Button, Kicker, Title, tones, useInView, WindowBar } from './ui'

// A spread of the fifteen: productivity, enterprise, nutrition, personal finance, fintech, travel.
const featured = [0, 1, 2, 7, 11, 13].map((i) => ({ ...projects[i], n: i + 1 }))
const cardTones = [tones.violet, tones.blue, tones.orange, tones.green, tones.pink, tones.amber]
const DURATION = 4000

export function Work() {
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const playing = inView && !hover
  const count = featured.length
  const p = featured[active]

  return (
    <section id="portfolio" className="overflow-hidden border-t border-line py-28 md:py-40">
      <div className="wrap text-center">
        <Kicker className="justify-center">{recentWork.eyebrow}</Kicker>
        <Title
          text={['Projects that drive results. ', 'From startup MVPs to enterprise solutions.']}
          className="mx-auto mt-5 max-w-[48rem] text-[clamp(1.85rem,3.4vw,2.75rem)]"
        />
      </div>

      <div role="tablist" aria-label="Industries" className="no-scrollbar mt-10 flex gap-2 overflow-x-auto px-5 md:justify-center">
        {featured.map((f, i) => (
          <button
            key={f.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`relative shrink-0 overflow-hidden rounded-full px-4 py-2 text-[0.82rem] transition-colors duration-300 ${
              i === active ? 'bg-white/[0.1] text-fg' : 'bg-white/[0.04] text-fg-3 hover:text-fg-2'
            }`}
          >
            {f.industry}
            {i === active && (
              <span
                key={`p-${i}`}
                onAnimationEnd={() => setActive((a) => (a + 1) % count)}
                className={`absolute inset-x-3 bottom-0 h-px origin-left ${cardTones[i].bg}`}
                style={
                  reducedMotion()
                    ? undefined
                    : { animation: `grow ${DURATION}ms linear forwards`, animationPlayState: playing ? 'running' : 'paused' }
                }
                aria-hidden
              />
            )}
          </button>
        ))}
      </div>

      <div
        ref={stage}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mx-auto mt-10 h-[26rem] max-w-[1400px] md:h-[30rem]"
      >
        {featured.map((f, i) => {
          let o = i - active
          if (o > count / 2) o -= count
          if (o < -count / 2) o += count
          const t = cardTones[i]
          const visible = Math.abs(o) <= 1
          return (
            <article
              key={f.title}
              aria-hidden={o !== 0}
              onClick={() => o !== 0 && setActive(i)}
              className={`absolute left-1/2 top-0 h-full w-[min(46rem,88vw)] overflow-hidden rounded-2xl border border-line-2 bg-s1 transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                o === 0 ? 'z-10' : 'cursor-pointer'
              } ${visible ? '' : 'pointer-events-none'}`}
              style={{
                transform: `translateX(calc(-50% + ${o * 104}%)) scale(${o === 0 ? 1 : 0.86})`,
                opacity: o === 0 ? 1 : visible ? 0.35 : 0,
                filter: o === 0 ? 'none' : 'blur(1px)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(90% 70% at 50% 0%, ${t.hex}40, transparent 65%)` }}
                aria-hidden
              />
              <div className="absolute inset-x-5 bottom-0 top-10 flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-black/80 backdrop-blur md:inset-x-14 md:top-14">
                <WindowBar>
                  <span className="truncate text-[0.74rem] text-fg-2">{f.title}</span>
                  <span className={`ml-auto font-mono text-[0.62rem] ${t.text}`}>
                    {String(f.n).padStart(2, '0')} / {projects.length}
                  </span>
                </WindowBar>
                <div className="grid min-h-0 flex-1 gap-6 p-5 md:grid-cols-[1.2fr_1fr] md:p-7">
                  <div>
                    <p className="kicker !text-[0.6rem]">{recentWork.keyFeatures}</p>
                    <ul className="mt-3 space-y-2">
                      {f.features.slice(0, 5).map((feat) => (
                        <li key={feat} className="flex gap-2.5 text-[0.82rem] leading-snug text-fg-2">
                          <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.text}`} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden space-y-5 md:block">
                    <div>
                      <p className="kicker !text-[0.6rem]">{recentWork.bestFor}</p>
                      <p className="mt-2 text-[0.82rem] leading-snug text-fg-2">{f.bestFor}</p>
                    </div>
                    <div>
                      <p className="kicker !text-[0.6rem]">{recentWork.technologies}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {f.technologies.slice(0, 6).map((tech) => (
                          <span key={tech} className="rounded-md border border-line bg-white/[0.03] px-2 py-0.5 font-mono text-[0.64rem] text-fg-2">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="kicker !text-[0.6rem]">{recentWork.timeToDevelop}</p>
                      <p className={`mt-2 text-[0.82rem] ${t.text}`}>
                        {f.months} {f.months === 1 ? 'month' : 'months'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="wrap mt-8">
        <div className="mx-auto flex max-w-[46rem] flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div key={p.title} className="animate-[fade_0.6s_ease-out]">
            <h3 className="text-[1.15rem] font-medium tracking-[-0.025em]">{p.title}</h3>
            <p className="mt-1.5 max-w-[30rem] text-[0.9rem] leading-relaxed text-fg-3">{p.description}</p>
          </div>
          <Button href={links.contact} variant="ghost" className="shrink-0">
            {nav.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}
