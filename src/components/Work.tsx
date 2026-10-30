import { useRef } from 'react'
import { links, recentWork } from '../content'
import { projects } from '../data/projects'
import { gsap, useGSAP } from '../lib/motion'
import { Button } from './ui'

const picks = [0, 1, 2, 3, 7, 9, 11, 13]
// Where each card comes to rest around the headline, and its resting tilt.
const spots = [
  { left: '3%', top: '11%', r: -7 },
  { left: '22%', top: '7%', r: 4 },
  { left: '57%', top: '8%', r: -3 },
  { left: '78%', top: '12%', r: 6 },
  { left: '2%', top: '62%', r: 5 },
  { left: '22%', top: '70%', r: -5 },
  { left: '59%', top: '69%', r: 4 },
  { left: '79%', top: '61%', r: -6 },
]
const light = new Set([1, 6])

function Card({ index, k }: { index: number; k: number }) {
  const p = projects[index]
  const isLight = light.has(k)
  return (
    <article
      className={`flex w-[clamp(13.5rem,17vw,15.5rem)] flex-col rounded-2xl border p-5 ${
        isLight ? 'border-transparent bg-[#f2f2f0] text-black' : 'border-line-2 bg-[#111] text-fg'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${isLight ? 'text-black/50' : 'text-fg-3'}`}>{p.industry}</span>
        <span className={`font-mono text-[10px] ${isLight ? 'text-black/40' : 'text-fg-4'}`}>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-8 text-[17px] font-medium leading-snug tracking-[-0.025em]">{p.title}</h3>
      <p className={`mt-2 line-clamp-2 text-[13px] leading-[1.55] ${isLight ? 'text-black/60' : 'text-fg-3'}`}>{p.description}</p>
      <p className={`mt-4 border-t pt-3 text-[12.5px] ${isLight ? 'border-black/10 text-black/70' : 'border-line text-fg-2'}`}>
        {p.months} {p.months === 1 ? 'month' : 'months'} to develop
      </p>
    </article>
  )
}

export function Work() {
  const root = useRef<HTMLElement>(null)

  // Desktop: while the section holds, the project cards fly up from below and settle around the headline.
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: '[data-fly-track]', start: 'top 70%', end: 'bottom bottom', scrub: 1 },
        })
        tl.from('[data-fly-copy] > *', { opacity: 0, y: 40, stagger: 0.08, duration: 0.6 }, 0)
        gsap.utils.toArray<HTMLElement>('[data-fly]').forEach((el, i) => {
          const r = spots[i].r
          tl.fromTo(
            el,
            { y: () => window.innerHeight * (0.95 + (i % 3) * 0.12), x: (i % 4 < 2 ? -1 : 1) * 80, rotate: r * 5, opacity: 0 },
            { y: 0, x: 0, rotate: r, opacity: 1, duration: 1 },
            0.15 + i * 0.16,
          )
        })
        tl.to({}, { duration: 0.4 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="portfolio" className="border-t border-line">
      {/* Phones: a plain stack. */}
      <div className="frame py-24 lg:hidden">
        <p data-fade className="label">
          {recentWork.eyebrow}
        </p>
        <h2 data-lines className="heading mt-5 text-[2rem]">
          <span className="text-fg">Projects that </span>
          <span className="text-fg-3">drive results.</span>
        </h2>
        <p data-fade className="mt-5 text-[15px] leading-[1.7] text-fg-2">
          {recentWork.body}
        </p>
        <div data-seq className="mt-10 grid gap-3 sm:grid-cols-2">
          {picks.map((index, k) => (
            <Card key={index} index={index} k={k} />
          ))}
        </div>
      </div>

      <div data-fly-track className="relative hidden h-[260vh] lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div data-fly-copy className="absolute left-1/2 top-1/2 z-10 w-[30rem] -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="label">{recentWork.eyebrow}</p>
            <h2 className="heading mt-5 text-[clamp(2.2rem,3.4vw,2.9rem)]">
              <span className="text-fg">Projects that </span>
              <span className="text-fg-3">drive results.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[26rem] text-[15px] leading-[1.7] text-fg-2">{recentWork.body}</p>
            <div className="mt-7">
              <Button href={links.contact} variant="ghost">
                Start a project
              </Button>
            </div>
          </div>
          {picks.map((index, k) => (
            <div key={index} data-fly className="absolute" style={{ left: spots[k].left, top: spots[k].top }}>
              <Card index={index} k={k} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
