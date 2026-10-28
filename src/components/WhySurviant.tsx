import { useRef } from 'react'
import { whySurviant } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Eyebrow, Headline } from './ui'

const themes = [
  { card: 'bg-panel text-fg border border-edge', muted: 'text-dim', em: 'silver', rule: 'bg-edge' },
  { card: 'bg-raised text-fg border border-edge', muted: 'text-dim', em: 'silver', rule: 'bg-edge' },
  { card: 'bg-silver text-void', muted: 'text-void/60', em: 'text-void/55', rule: 'bg-void/15' },
  { card: 'bg-fg text-void', muted: 'text-void/60', em: 'text-void/50', rule: 'bg-void/15' },
]

export function WhySurviant() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-why-card]')
        cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) return
          const scrollTrigger = { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true }
          gsap.to(card.querySelector('[data-why-inner]'), { scale: 0.9 + i * 0.02, ease: 'none', scrollTrigger })
          gsap.to(card.querySelector('[data-why-shade]'), { opacity: 0.45, ease: 'none', scrollTrigger })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="why-surviant" className="relative z-10 py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>{whySurviant.eyebrow}</Eyebrow>
            <Headline text={whySurviant.title} className="mt-6 text-[clamp(2.75rem,6vw,6rem)]" />
          </div>
          <p data-reveal className="self-end text-lg leading-relaxed text-dim md:col-span-4 md:col-start-9">
            {whySurviant.body}
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          {whySurviant.items.map((item, i) => {
            const t = themes[i]
            return (
              <div
                key={item.label}
                data-why-card
                className="sticky mb-[10vh] last:mb-0"
                style={{ top: `calc(14vh + ${i * 1.6}rem)` }}
              >
                <article
                  data-why-inner
                  className={`relative flex h-[54svh] max-h-[32rem] min-h-[24rem] origin-top flex-col justify-between overflow-hidden rounded-[28px] p-7 md:p-12 ${t.card}`}
                >
                  <span
                    data-why-shade
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[28px] bg-void opacity-0"
                  />
                  <div className="flex items-center gap-4">
                    <p className={`eyebrow shrink-0 ${t.muted}`}>
                      [0{i + 1}] {item.label}
                    </p>
                    <span aria-hidden className={`h-px flex-1 ${t.rule}`} />
                  </div>
                  <div className="grid items-end gap-6 md:grid-cols-12 md:gap-10">
                    <h3 className="display text-[clamp(2.4rem,5.6vw,5.75rem)] leading-[1.02] md:col-span-8">
                      {item.title[0]}
                      <em className={t.em}>{item.title[1]}</em>
                    </h3>
                    <p className={`text-lg leading-relaxed md:col-span-4 ${t.muted}`}>{item.body}</p>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
