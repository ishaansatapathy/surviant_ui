import { useRef } from 'react'
import { leadership, links } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { EASE, Heading, TextLink } from './ui'

export function Leadership() {
  const root = useRef<HTMLElement>(null)

  // Each portrait opens upward while the photograph settles inside it.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-portrait]').forEach((el, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 82%', once: true }, delay: i * 0.15 })
            .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
            .from(el.querySelector('img'), { scale: 1.2, duration: 2, ease: EASE }, 0.3)
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="leadership" className="border-t border-line">
      <div className="frame py-24 md:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <Heading label={leadership.eyebrow} text={leadership.title} />
          <div>
            <p data-fade className="text-[15px] leading-[1.7] text-fg-2">
              {leadership.body}
            </p>
            <div data-fade="0.1" className="mt-5">
              <TextLink href={links.about}>{leadership.link}</TextLink>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-3 lg:grid-cols-2">
          {leadership.people.map((p) => (
            <article key={p.name} className="group flex gap-5 rounded-2xl border border-line-2 bg-s1 p-4 md:gap-7 md:p-5">
              <div data-portrait className="aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-xl md:w-40">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover object-[center_20%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div data-seq className="flex flex-col py-1">
                <p className="label !text-[10px]">{p.role}</p>
                <h3 className="mt-3 text-[20px] font-medium tracking-[-0.03em]">{p.name}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-fg-3">{p.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
