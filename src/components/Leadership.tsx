import { useRef } from 'react'
import { leadership, links } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Eyebrow, Headline, TextLink } from './ui'

export function Leadership() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-person]').forEach((person) => {
          const frame = person.querySelector('[data-person-frame]')
          const img = person.querySelector('[data-person-img]')
          gsap.fromTo(
            frame,
            { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 24px)',
              duration: 1.6,
              ease: 'expo.out',
              scrollTrigger: { trigger: person, start: 'top 85%', once: true },
            },
          )
          gsap.fromTo(
            img,
            { yPercent: 0 },
            {
              yPercent: -13,
              ease: 'none',
              scrollTrigger: { trigger: person, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="leadership" className="relative z-10 border-t border-edge-soft py-28 md:py-40">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="self-start lg:sticky lg:top-32 lg:col-span-5">
          <Eyebrow>{leadership.eyebrow}</Eyebrow>
          <Headline text={leadership.title} className="mt-6 text-[clamp(2.5rem,4.6vw,4.75rem)]" />
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-dim">
            {leadership.body}
          </p>
          <div data-reveal className="mt-8">
            <TextLink href={links.about}>{leadership.link}</TextLink>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-6 lg:col-span-7">
          {leadership.people.map((person, i) => (
            <figure key={person.name} data-person className={i === 1 ? 'sm:mt-32' : ''}>
              <div
                data-person-frame
                className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-edge bg-panel"
              >
                <img
                  data-person-img
                  src={person.image}
                  alt={person.name}
                  loading="lazy"
                  className="absolute inset-x-0 top-0 h-[115%] w-full object-cover object-top grayscale transition-[scale,filter] duration-[1.2s] ease-expo group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-void/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white ring-1 ring-white/15 backdrop-blur-md">
                  {person.role.split(' / ')[1]}
                </span>
              </div>
              <figcaption className="mt-6">
                <p className="eyebrow">{person.role}</p>
                <p className="display mt-3 text-[2.6rem]">{person.name}</p>
                <p className="mt-3 leading-relaxed text-dim">{person.bio}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
