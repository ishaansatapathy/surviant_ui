import { useRef } from 'react'
import { systemMap } from '../content'
import { gsap, SplitText, useGSAP } from '../lib/motion'
import { Eyebrow } from './ui'

/** The system map's result, lit word by word as it is scrolled through. */
export function Result() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-result-words]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.08 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom bottom', scrub: true },
          },
        )
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="system-map" aria-label={systemMap.result.label} className="relative z-10 h-[220vh]">
      <div className="shell sticky top-0 flex h-svh flex-col items-center justify-center text-center">
        <Eyebrow>{systemMap.result.label}</Eyebrow>
        <p
          data-result-words
          className="display mt-8 max-w-[15em] text-balance text-[clamp(2.5rem,6.4vw,7rem)] leading-[1.04]"
        >
          {systemMap.result.body[0]}
          <em className="silver">{systemMap.result.body[1]}</em>
        </p>
      </div>
    </section>
  )
}
