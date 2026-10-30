import { Check } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { offerings, systemMap } from '../content'
import { reducedMotion } from '../lib/motion'
import { Chip, Kicker, Title, tones, useInView, useSteps, WindowBar, type Tone } from './ui'

const DURATION = 7000
// Layer 1 is digital, 2 product, 3 AI.
const layerTones = [tones.orange, tones.blue, tones.violet] as const
const groups = [offerings.slice(15), offerings.slice(9, 15), offerings.slice(0, 9)]

function Frame({ i, children }: { i: number; children: ReactNode }) {
  const l = systemMap.layers[i]
  const tone = layerTones[i]
  return (
    <div className="relative flex h-full items-end justify-center overflow-hidden px-4 pt-10 md:px-10 md:pt-14">
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-1/3 h-full"
        style={{ background: `radial-gradient(55% 55% at 50% 100%, ${tone.hex}2e, transparent 70%)` }}
        aria-hidden
      />
      <div className="relative flex h-full w-full max-w-[760px] flex-col overflow-hidden rounded-t-xl border border-b-0 border-line-2 bg-black/80 backdrop-blur">
        <WindowBar>
          <span className="truncate text-[0.74rem] text-fg-2">{l.title}</span>
          <span className="ml-auto hidden sm:block">
            <Chip tone={tone}>{l.outcome}</Chip>
          </span>
        </WindowBar>
        <div className="min-h-0 flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}

/** Layer 1: fragile workflows become connected, one at a time. */
function Operation({ on }: { on: boolean }) {
  const items = groups[0]
  const n = useSteps(on, items.length, 420, 500)
  return (
    <Frame i={0}>
      <div className="grid grid-cols-[1fr_auto] border-b border-line pb-2 font-mono text-[0.62rem] uppercase tracking-wider text-fg-4">
        <span>Workflow</span>
        <span>Status</span>
      </div>
      <ul>
        {items.map((o, i) => {
          const done = i < n
          return (
            <li key={o} className="grid grid-cols-[1fr_auto] items-center border-b border-line py-2.5 text-[0.82rem] last:border-0">
              <span className={`transition-colors duration-500 ${done ? 'text-fg' : 'text-fg-3'}`}>{o}</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.68rem] transition-colors duration-500 ${
                  done ? 'border-green/25 bg-green/10 text-green' : 'border-orange/25 bg-orange/10 text-orange'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-green' : 'bg-orange'}`} />
                {done ? 'Connected' : 'Fragile'}
              </span>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}

const bars = [5, 8, 6, 9, 7, 10, 8, 11, 9, 12, 10, 12]

/** Layer 2: each part of the product, shipped and healthy. */
function Software({ on }: { on: boolean }) {
  const items = groups[1]
  const n = useSteps(on, items.length, 260, 400)
  return (
    <Frame i={1}>
      <div className="grid h-full grid-cols-2 gap-2.5 md:grid-cols-3">
        {items.map((o, i) => {
          const live = i < n
          return (
            <div key={o} className="flex flex-col justify-between rounded-lg border border-line bg-s2 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[0.8rem] text-fg">{o}</span>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500 ${live ? 'bg-green shadow-[0_0_8px] shadow-green' : 'bg-fg-4'}`} />
              </div>
              <div className="mt-3 flex h-8 items-end gap-[3px]">
                {bars.map((h, k) => (
                  <span
                    key={k}
                    className="flex-1 origin-bottom rounded-[1px] bg-blue/70 transition-transform duration-700 ease-out"
                    style={{ height: `${(h / 12) * 100}%`, transform: `scaleY(${live ? 1 : 0.08})`, transitionDelay: live ? `${k * 30}ms` : '0ms' }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

/** Layer 3: AI capabilities run and are checked before they ship. */
function Intelligence({ on }: { on: boolean }) {
  const items = groups[2]
  const n = useSteps(on, items.length, 360, 500)
  return (
    <Frame i={2}>
      <ul className="grid gap-x-6 md:grid-cols-2">
        {items.map((o, i) => {
          const state = i < n - 1 || n === items.length ? 'done' : i === n - 1 ? 'run' : 'wait'
          return (
            <li key={o} className="flex items-center gap-3 border-b border-line py-2 text-[0.8rem]">
              <span className="grid h-4 w-4 place-items-center">
                {state === 'done' ? (
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-violet text-black">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                ) : state === 'run' ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-violet border-t-transparent" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-line-2" />
                )}
              </span>
              <span className={state === 'wait' ? 'text-fg-4' : 'text-fg'}>{o}</span>
              <span className={`ml-auto font-mono text-[0.62rem] ${state === 'done' ? 'text-violet' : 'text-fg-4'}`}>
                {state === 'done' ? 'Evaluated' : state === 'run' ? 'Running' : 'Queued'}
              </span>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}

function Tab({
  i,
  active,
  playing,
  onSelect,
  onDone,
  tone,
}: {
  i: number
  active: boolean
  playing: boolean
  onSelect: () => void
  onDone: () => void
  tone: Tone
}) {
  const l = systemMap.layers[i]
  const [label, practice] = l.label.split(' / ')
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      className="relative border-t border-line p-6 text-left transition-colors first:border-t-0 hover:bg-white/[0.015] md:border-l md:border-t-0 md:first:border-l-0"
    >
      <span className="absolute inset-x-0 top-0 h-px overflow-hidden" aria-hidden>
        {active && (
          <span
            key={`bar-${i}`}
            onAnimationEnd={onDone}
            className={`block h-full origin-left ${tone.bg}`}
            style={
              reducedMotion()
                ? undefined
                : { animation: `grow ${DURATION}ms linear forwards`, animationPlayState: playing ? 'running' : 'paused' }
            }
          />
        )}
      </span>
      <span className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] ${active ? tone.text : 'text-fg-4'}`}>
        {label} / {practice}
      </span>
      <span className={`mt-3 block text-[1rem] font-medium tracking-[-0.02em] transition-colors ${active ? 'text-fg' : 'text-fg-3'}`}>
        {l.title}
      </span>
      <span className={`mt-1.5 block text-[0.86rem] leading-relaxed transition-colors ${active ? 'text-fg-3' : 'text-fg-4'}`}>{l.body}</span>
    </button>
  )
}

export function SystemMap() {
  const panel = useRef<HTMLDivElement>(null)
  const inView = useInView(panel)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const playing = inView && !hover
  const visuals = [Operation, Software, Intelligence]

  return (
    <section id="system-map" className="py-28 md:py-40">
      <div className="wrap">
        <Kicker>{systemMap.eyebrow}</Kicker>
        <Title
          text={['Operation to product to intelligence. ', 'Three layers, one accountable team.']}
          className="mt-5 max-w-[44rem] text-[clamp(1.85rem,3.4vw,2.75rem)]"
        />

        <div
          ref={panel}
          data-reveal
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="mt-12 overflow-hidden rounded-2xl border border-line bg-s1"
        >
          <div className="relative h-[400px] md:h-[440px]" role="tabpanel">
            {visuals.map((V, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-[opacity,filter,transform] duration-700 ease-out ${
                  i === active ? 'scale-100 opacity-100 blur-0' : 'pointer-events-none scale-[0.985] opacity-0 blur-[6px]'
                }`}
                aria-hidden={i !== active}
              >
                <V on={i === active && inView} />
              </div>
            ))}
          </div>
          <div role="tablist" className="grid border-t border-line md:grid-cols-3">
            {systemMap.layers.map((l, i) => (
              <Tab
                key={l.title}
                i={i}
                tone={layerTones[i]}
                active={i === active}
                playing={playing}
                onSelect={() => setActive(i)}
                onDone={() => setActive((a) => (a + 1) % 3)}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-28 max-w-[50rem] text-center md:mt-36">
          <p data-reveal className="kicker">
            {systemMap.result.label}
          </p>
          <p data-scrub className="display mt-6 text-[clamp(1.5rem,2.9vw,2.3rem)] !leading-[1.22]">
            {systemMap.result.body.join('')}
          </p>
        </div>
      </div>
    </section>
  )
}
