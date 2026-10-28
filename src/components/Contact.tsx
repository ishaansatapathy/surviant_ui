import { lazy, Suspense, useRef } from 'react'
import { contact, email, links } from '../content'
import { Button, useInView } from './ui'

const ShaderBackdrop = lazy(() => import('../three/ShaderBackdrop').then((m) => ({ default: m.ShaderBackdrop })))

export function Contact() {
  const card = useRef<HTMLDivElement>(null)
  const inView = useInView(card, '200px')

  return (
    <section id="contact" className="relative z-10 p-2 md:p-4">
      <div
        ref={card}
        className="relative isolate overflow-hidden rounded-[24px] border border-edge bg-panel text-white md:rounded-[36px]"
      >
        <div className="absolute inset-0 -z-10" aria-hidden>
          <Suspense fallback={null}>
            <ShaderBackdrop active={inView} />
          </Suspense>
        </div>
        <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />

        <div className="shell flex min-h-[86svh] flex-col justify-between gap-16 py-14 md:py-20">
          <a
            href={`mailto:${email}`}
            className="eyebrow inline-flex w-fit items-center gap-2.5 text-white/70 transition-colors hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-[1px] bg-accent" />
            {email}
          </a>

          <h2 data-split className="display text-[clamp(3.75rem,11vw,11.5rem)] leading-[0.92]">
            {contact.title[0]}
            <em className="silver">{contact.title[1]}</em>
          </h2>

          <div className="grid gap-10 border-t border-white/15 pt-10 md:grid-cols-12">
            <p data-reveal className="display text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1.12] md:col-span-6">
              {contact.lead}
            </p>
            <div data-reveal className="flex flex-col gap-8 md:col-span-5 md:col-start-8">
              <p className="text-lg leading-relaxed text-white/70">{contact.body}</p>
              <div className="flex flex-wrap items-center gap-6">
                <Button href={links.contact}>{contact.cta}</Button>
                <a
                  href={`mailto:${email}`}
                  className="text-[0.92rem] font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
