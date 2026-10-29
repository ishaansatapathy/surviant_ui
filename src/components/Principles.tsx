import { useEffect, useRef, useState } from 'react'
import { whySurviant } from '../content'
import { reducedMotion } from '../lib/motion'
import { Headline, useInView } from './ui'

const HOLD_MS = 3800

/** Why Surviant: one principle at a time, typed out like a prompt. */
export function Principles() {
  const card = useRef<HTMLDivElement>(null)
  const inView = useInView(card)
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState(0)
  const [auto, setAuto] = useState(true)

  const item = whySurviant.items[index]
  const title = item.title.join('')
  const done = chars >= title.length

  useEffect(() => {
    if (reducedMotion()) {
      setChars(title.length)
      return
    }
    if (!inView) return
    let t: number
    if (!done) t = window.setTimeout(() => setChars((c) => c + 1), 32)
    else if (auto)
      t = window.setTimeout(() => {
        setIndex((i) => (i + 1) % whySurviant.items.length)
        setChars(0)
      }, HOLD_MS)
    return () => window.clearTimeout(t)
  }, [inView, done, auto, title.length])

  const pick = (i: number) => {
    setAuto(false)
    setIndex(i)
    setChars(0)
  }

  return (
    <section id="why-surviant" className="relative z-10 bg-tang text-ink">
      <div className="wrap grid gap-14 py-24 md:py-32 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <div>
          <p className="kicker !text-ink/60">{whySurviant.eyebrow}</p>
          <Headline text={whySurviant.title} className="mt-6 text-[clamp(3rem,6.4vw,6.4rem)] leading-[0.98]" />
          <p data-rise className="mt-8 max-w-md text-[1.08rem] leading-relaxed text-ink/75">
            {whySurviant.body}
          </p>
        </div>

        <div
          ref={card}
          data-rise
          className="rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(90,20,0,0.55)] md:p-9 lg:-mr-8"
        >
          <p className="kicker">
            0{index + 1} / {item.label}
          </p>
          <p className="mt-5 min-h-[2.3em] text-[clamp(1.7rem,2.6vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.02em]">
            <span className="sr-only">{title}</span>
            <span aria-hidden>
              {title.slice(0, chars)}
              {!done && <span className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.12em] animate-[caret_1s_steps(1)_infinite] bg-tang" />}
            </span>
          </p>
          <p
            className={`mt-5 min-h-[4.8em] leading-relaxed text-ink-2 transition-all duration-500 ${
              done ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
            }`}
          >
            {item.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6" role="tablist" aria-label={whySurviant.eyebrow}>
            {whySurviant.items.map((it, i) => (
              <button
                key={it.label}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => pick(i)}
                className={`rounded-full px-4 py-2 text-[0.88rem] transition-colors duration-300 ${
                  i === index ? 'bg-ink text-paper' : 'bg-cream text-ink-2 hover:bg-line'
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
