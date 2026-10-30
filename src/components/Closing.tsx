import { useRef } from 'react'
import { contact, email, footer, links, portal } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Button, Title } from './ui'

export function Closing() {
  const root = useRef<HTMLElement>(null)

  // The horizon rises into view as the page reaches its end.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-horizon]',
          { y: 220 },
          { y: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 10%', scrub: 0.8 } },
        )
        gsap.fromTo(
          '[data-horizon-glow]',
          { opacity: 0 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'top 0%', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="relative overflow-hidden border-t border-line">
      <div className="wrap relative z-10 pt-28 text-center md:pt-40">
        <Title
          text={['Start a conversation. ', contact.lead]}
          className="mx-auto max-w-[42rem] text-[clamp(1.85rem,3.6vw,2.9rem)]"
        />
        <p data-reveal className="mx-auto mt-6 max-w-[30rem] text-[0.95rem] leading-relaxed text-fg-3">
          {contact.body}
        </p>
        <div data-reveal="0.1" className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Button href={links.contact}>{contact.cta}</Button>
          <Button href={`mailto:${email}`} variant="ghost">
            {email}
          </Button>
        </div>
      </div>

      {/* Horizon: a dark planet with a coloured rim. */}
      <div className="relative mt-24 h-[300px] md:mt-28 md:h-[360px]" aria-hidden>
        <div data-horizon className="absolute left-1/2 top-0 h-[2400px] w-[2400px] -translate-x-1/2 md:h-[3000px] md:w-[3000px]">
          <div
            data-horizon-glow
            className="absolute inset-0 rounded-full blur-[60px]"
            style={{
              background:
                'conic-gradient(from 270deg, transparent 20deg, #ff8c52 60deg, #a394ff 90deg, #4ea2ff 120deg, transparent 160deg)',
              opacity: 0.55,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 270deg, transparent 30deg, #ff8c52 62deg, #f2e9ff 90deg, #4ea2ff 118deg, transparent 150deg)',
            }}
          />
          <div className="absolute inset-[1.5px] rounded-full bg-black" />
          <div className="absolute inset-[1.5px] rounded-full bg-[radial-gradient(40%_6%_at_50%_0%,rgba(163,148,255,0.18),transparent)]" />
        </div>
      </div>

      <footer className="relative z-10 -mt-[150px] md:-mt-[170px]">
        <div className="wrap">
          <div className="grid gap-12 pb-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
              <a href="#top" className="flex items-center gap-2.5">
                <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[7px]" />
                <span className="text-[1rem] font-medium tracking-[-0.03em]">Surviant</span>
              </a>
              <p className="mt-4 max-w-[17rem] text-[0.85rem] leading-relaxed text-fg-3">{footer.blurb}</p>
              <p className="kicker mt-6 !text-[0.62rem]">{footer.locations}</p>
            </div>
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="kicker !text-[0.62rem]">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="text-[0.85rem] text-fg-2 transition-colors hover:text-fg">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="kicker !text-[0.62rem]">Contact</p>
              <ul className="mt-4 space-y-2.5 text-[0.85rem]">
                <li>
                  <a href={`mailto:${email}`} className="text-fg-2 transition-colors hover:text-fg">
                    {email}
                  </a>
                </li>
                <li className="pt-2 text-fg-4">
                  {portal.label} <span className="font-mono text-[0.65rem]">/ {portal.note}</span>
                </li>
                {portal.items.map((item) => (
                  <li key={item} className="text-fg-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-line py-6 text-[0.78rem] text-fg-4 sm:flex-row sm:items-center sm:justify-between">
            <p>{footer.legal}</p>
            <ul className="flex gap-5">
              {footer.legalLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-fg-2">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </section>
  )
}
