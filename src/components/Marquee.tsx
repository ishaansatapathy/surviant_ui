import { useEffect, useRef } from 'react'
import { offerings } from '../content'
import { getLenis, gsap, reducedMotion } from '../lib/motion'

const rows = [offerings.slice(0, 11), offerings.slice(11)]

/** Two counter-running rows of offerings whose speed and skew follow scroll velocity. */
export function Marquee() {
  const tracks = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (reducedMotion()) return
    const offsets = rows.map(() => 0)
    let skew = 0
    const tick = (_: number, deltaMs: number) => {
      const velocity = getLenis()?.velocity ?? 0
      const frame = deltaMs / 16.67
      skew += (gsap.utils.clamp(-7, 7, -velocity * 0.22) - skew) * 0.1
      tracks.current.forEach((el, i) => {
        if (!el) return
        const half = el.scrollWidth / 2
        const dir = i % 2 === 0 ? -1 : 1
        offsets[i] += dir * (0.55 + velocity * 0.12) * frame
        if (offsets[i] <= -half) offsets[i] += half
        if (offsets[i] > 0) offsets[i] -= half
        el.style.transform = `translate3d(${offsets[i]}px,0,0) skewX(${skew}deg)`
      })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <section
      aria-label="Offerings"
      className="relative z-10 overflow-hidden border-y border-edge-soft py-10 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:py-14"
    >
      {rows.map((row, r) => (
        <div
          key={r}
          ref={(el) => {
            tracks.current[r] = el
          }}
          className="flex w-max will-change-transform"
          aria-hidden={r === 1 ? true : undefined}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
              {row.map((item) => (
                <li
                  key={item}
                  className={`display flex items-center whitespace-nowrap text-[clamp(2.6rem,6vw,5.75rem)] leading-[1.15] ${
                    r === 1 ? 'italic text-faint' : 'text-fg'
                  }`}
                >
                  <span className="px-6 md:px-9">{item}</span>
                  <span className="font-mono text-[0.4em] text-accent">/</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </section>
  )
}
