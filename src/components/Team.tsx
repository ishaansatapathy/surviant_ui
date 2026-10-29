import { Mic, Video } from 'lucide-react'
import { useRef } from 'react'
import { leadership, links } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Headline, Kicker, TextLink } from './ui'

export function Team() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-person]').forEach((el, i) => {
          gsap.from(el, {
            y: 90,
            rotate: i ? 3 : -3,
            opacity: 0,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
          gsap.to(el.querySelector('img'), {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="leadership" className="py-28 md:py-40">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Kicker>{leadership.eyebrow}</Kicker>
          <Headline text={leadership.title} className="mt-6 text-[clamp(2.4rem,4.2vw,4rem)] leading-[1.04]" emClassName="text-ink-3" />
          <p data-rise className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-ink-2">
            {leadership.body}
          </p>
          <TextLink href={links.about} className="mt-7 text-ink">
            {leadership.link}
          </TextLink>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-5 lg:col-span-7">
          {leadership.people.map((p, i) => (
            <figure key={p.name} data-person className={i ? 'sm:mt-20' : ''}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-char">
                <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-x-0 top-0 h-[112%] w-full object-cover object-top" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/45 py-1.5 pl-2 pr-3 text-[0.82rem] font-medium text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#34c759]" />
                  {p.name}
                </span>
                <span className="absolute bottom-4 right-4 flex gap-1.5" aria-hidden>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md">
                    <Mic className="h-3.5 w-3.5" />
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md">
                    <Video className="h-3.5 w-3.5" />
                  </span>
                </span>
              </div>
              <figcaption className="px-1 pt-5">
                <p className="kicker">{p.role}</p>
                <p className="mt-2 leading-relaxed text-ink-2">{p.bio}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
