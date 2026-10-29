import { useRef } from 'react'
import { contact, email, footer, links, nav } from '../content'
import { gsap, useGSAP } from '../lib/motion'
import { Button, Scribble } from './ui'

/** The big ask, then the footer on a dark slab. */
export function Closing() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-ask-word]', {
          yPercent: 100,
          duration: 1.4,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-ask]', start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  const words = contact.title[0].trim().split(' ')

  return (
    <section ref={root} id="contact">
      <div data-ask className="wrap pb-16 pt-10 text-center md:pb-24">
        <h2 className="serif text-[clamp(4rem,14vw,13rem)] leading-[0.9]">
          {words.map((w) => (
            <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-ask-word className="inline-block pr-[0.22em]">
                {w}
              </span>
            </span>
          ))}
          <span className="relative inline-block overflow-hidden pb-[0.12em] align-bottom">
            <em data-ask-word className="inline-block pr-[0.06em]">
              {contact.title[1]}
            </em>
          </span>
        </h2>
        <div className="relative mx-auto h-5 w-[min(36rem,70vw)]">
          <Scribble className="inset-0 h-full w-full text-tang" />
        </div>
      </div>

      <footer className="px-2 pb-2 md:px-3 md:pb-3">
        <div className="rounded-[36px] bg-char text-paper">
          <div className="wrap grid gap-14 py-16 md:py-20 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p data-rise className="serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.12]">
                {contact.lead}
              </p>
              <p data-rise className="mt-5 max-w-lg leading-relaxed text-white/60">
                {contact.body}
              </p>
              <div data-rise className="mt-8 flex flex-wrap items-center gap-5">
                <Button href={links.contact} variant="tang">
                  {contact.cta}
                </Button>
                <a href={`mailto:${email}`} className="text-white/80 underline decoration-white/25 underline-offset-[6px] hover:decoration-white">
                  {email}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-5 lg:col-start-8">
              {footer.columns.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <p className="kicker !text-white/40">{col.title}</p>
                  <ul className="mt-5 space-y-3">
                    {col.items.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="text-white/75 transition-colors hover:text-white">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="wrap flex flex-col gap-5 border-t border-white/10 py-7 text-[0.85rem] text-white/45 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[7px]" />
              <span className="text-white/80">{nav.name}</span>
              <span className="hidden md:inline">— {footer.blurb}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>{footer.legal}</span>
              <span>{footer.locations}</span>
              {footer.legalLinks.map((l) => (
                <a key={l.label} href={l.href} className="hover:text-white">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
