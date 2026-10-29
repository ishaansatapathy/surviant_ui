import { Check } from 'lucide-react'
import { useRef } from 'react'
import { links, nav, recentWork } from '../content'
import { projects } from '../data/projects'
import { gsap, useGSAP } from '../lib/motion'
import { Button, Headline, Kicker, Window } from './ui'

// A spread of the fifteen: productivity, enterprise, consumer, education, finance, travel.
const featured = [0, 1, 2, 4, 7, 13].map((i) => ({ ...projects[i], n: i + 1 }))
const covers = ['bg-lilac', 'bg-mint', 'bg-butter', 'bg-tang', 'bg-cream', 'bg-char']

export function Work() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth + 64
        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="portfolio" className="overflow-hidden py-24 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0">
      <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Kicker>{recentWork.eyebrow}</Kicker>
          <Headline text={recentWork.title} className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)]" emClassName="text-ink-3" />
        </div>
        <p data-rise className="text-[1.02rem] leading-relaxed text-ink-2 lg:col-span-4 lg:col-start-9">
          {recentWork.body}
        </p>
      </div>

      <div
        ref={track}
        data-lenis-prevent-horizontal
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 md:px-8 lg:mt-14 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]"
      >
        {featured.map((p, i) => {
          const dark = covers[i] === 'bg-char'
          return (
            <article key={p.title} className="w-[min(25rem,84vw)] shrink-0 snap-start">
              <div className={`flex h-[18.5rem] items-end rounded-[24px] p-5 ${covers[i]}`}>
                <Window className={dark ? '!border-white/10' : ''} bodyClassName="px-5 pb-5 pt-3">
                  <p className="kicker">{p.industry}</p>
                  <h3 className="serif mt-2 text-[1.6rem] leading-[1.05]">{p.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2 text-[0.82rem] leading-snug text-ink-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-tang" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Window>
              </div>
              <div className="px-1 pt-5">
                <p className="leading-relaxed text-ink-2">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span key={t} className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[0.68rem] text-ink-2">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[0.72rem] text-ink-3">
                  {String(p.n).padStart(2, '0')} / {projects.length} · {recentWork.timeToDevelop}: {p.months}{' '}
                  {p.months === 1 ? 'month' : 'months'}
                </p>
              </div>
            </article>
          )
        })}

        <article className="flex w-[min(22rem,84vw)] shrink-0 snap-start flex-col justify-between rounded-[24px] border border-line bg-white p-8">
          <p className="serif text-[6rem] leading-none">{projects.length}</p>
          <div>
            <p className="serif text-[1.8rem] leading-tight">{recentWork.title.join('')}</p>
            <Button href={links.contact} variant="tang" className="mt-6">
              {nav.cta}
            </Button>
          </div>
        </article>
      </div>
    </section>
  )
}
