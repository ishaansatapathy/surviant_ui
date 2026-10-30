import { useRef } from 'react'
import { leadership, links } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Kicker, TextLink, Title } from './ui'

export function Leadership() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-portrait]').forEach((el, i) => {
          const img = el.querySelector('img')
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
            .fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', delay: i * 0.12 })
            .from(img, { scale: 1.25, duration: 1.8, ease: 'expo.out' }, '<')
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="leadership" className="border-t border-line py-28 md:py-40">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Kicker>{leadership.eyebrow}</Kicker>
            <Title text={leadership.title} className="mt-5 text-[clamp(1.75rem,3vw,2.4rem)]" />
            <p data-reveal className="mt-5 text-[0.95rem] leading-relaxed text-fg-3">
              {leadership.body}
            </p>
            <TextLink href={links.about} className="mt-5">
              {leadership.link}
            </TextLink>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {leadership.people.map((p) => (
            <article key={p.name} className="group overflow-hidden rounded-2xl border border-line bg-s1">
              <div data-portrait className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover object-[center_20%] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[0.72rem] text-fg backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-green" />
                  {p.name}
                </span>
              </div>
              <div className="p-6">
                <p className="kicker !text-[0.62rem]">{p.role}</p>
                <h3 className="mt-3 text-[1.15rem] font-medium tracking-[-0.025em]">{p.name}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-fg-3">{p.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
