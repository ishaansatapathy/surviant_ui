import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { links, offerings, services, systemMap } from '../content'
import { gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { Kicker, practiceTones, TextLink, Title, WindowBar } from './ui'

const groups = [offerings.slice(0, 9), offerings.slice(9, 15), offerings.slice(15)]

/** A sidebar of the practices, the active one opened up, with a callout pointing at it. */
function PracticeWindow({ active }: { active: number }) {
  const box = useRef<HTMLDivElement>(null)
  const heads = useRef<(HTMLDivElement | null)[]>([])
  const [top, setTop] = useState(0)
  const p = services.practices[active]

  // Group heights animate, so follow the active header for the length of the transition.
  useLayoutEffect(() => {
    let raf = 0
    const until = performance.now() + 700
    const follow = () => {
      const head = heads.current[active]
      if (head && box.current) {
        const a = head.getBoundingClientRect()
        const b = box.current.getBoundingClientRect()
        setTop(a.top - b.top + a.height / 2)
      }
      if (performance.now() < until) raf = requestAnimationFrame(follow)
    }
    follow()
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div ref={box} className="relative ml-auto w-[min(100%,380px)]">
      {/* Callout */}
      <div
        className="absolute right-full z-10 flex -translate-y-1/2 items-center transition-[top] duration-500 ease-out"
        style={{ top }}
        aria-hidden
      >
        <span key={active} className="animate-[fade_0.5s_ease-out] whitespace-nowrap rounded-full bg-fg px-3 py-1 text-[0.75rem] font-medium text-black">
          {p.count} offerings
        </span>
        <span className="h-px w-14 bg-fg/70" />
        <span className="-ml-1 h-2 w-2 rounded-full bg-fg" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-2 bg-s1 shadow-[0_40px_100px_-30px_rgba(0,0,0,1)]">
        <WindowBar>
          <span className="flex-1 truncate rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[0.66rem] text-fg-3">
            surviant.com{p.href}
          </span>
        </WindowBar>

        <div className="space-y-1.5 p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {services.practices.map((s, i) => (
              <div
                key={s.name}
                className={`grid h-11 place-items-center rounded-lg border font-mono text-[0.8rem] transition-colors duration-500 ${
                  i === active ? `${practiceTones[i].ring} ${practiceTones[i].soft} ${practiceTones[i].text}` : 'border-line bg-white/[0.03] text-fg-4'
                }`}
              >
                {s.count}
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-[0.78rem] text-fg">{systemMap.eyebrow.split(' / ')[0]}</div>

          {services.practices.map((s, i) => {
            const open = i === active
            const t = practiceTones[i]
            return (
              <div
                key={s.name}
                className={`rounded-lg border transition-colors duration-500 ${open ? `${t.ring} ${t.soft}` : 'border-transparent'}`}
              >
                <div ref={(el) => void (heads.current[i] = el)} className="flex items-center gap-2 px-3 py-2 text-[0.78rem]">
                  <span className={`h-2.5 w-2.5 rounded-[3px] ${t.bg}`} />
                  <span className={open ? t.text : 'text-fg-2'}>{s.name}</span>
                  <ChevronDown className={`ml-auto h-3.5 w-3.5 transition-transform duration-500 ${open ? t.text : '-rotate-90 text-fg-4'}`} />
                </div>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <ul className="overflow-hidden">
                    {groups[i].map((o, k) => (
                      <li
                        key={o}
                        className={`flex items-center gap-2.5 px-3 py-[0.4rem] pl-7 text-[0.75rem] text-fg-2 transition-[opacity,transform] duration-500 ${
                          open ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                        }`}
                        style={{ transitionDelay: open ? `${120 + k * 35}ms` : '0ms' }}
                      >
                        <span className={`h-1 w-1 rounded-full ${t.bg}`} />
                        {o}
                      </li>
                    ))}
                    <li className="h-1.5" />
                  </ul>
                </div>
              </div>
            )
          })}

          <div className="flex items-center gap-2 px-3 py-2 text-[0.78rem] text-fg-3">
            How We Work <ChevronRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 text-[0.78rem] text-fg-4">
            Recent Work <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Practices() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-practice]').forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => self.isActive && setActive(i),
          })
        })
      })
    },
    { scope: root },
  )

  // Keep a stable selection if the layout switches below desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => !mq.matches && setActive(0)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <section ref={root} id="services" className="border-t border-line pt-28 md:pt-40">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Kicker>{services.eyebrow}</Kicker>
            <Title text={services.title} className="mt-5 text-[clamp(1.85rem,3.4vw,2.75rem)]" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p data-reveal className="text-[0.95rem] leading-relaxed text-fg-3">
              {services.body}
            </p>
            <TextLink href={links.services} className="mt-4">
              {services.directory}
            </TextLink>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-8 lg:grid-cols-2 lg:gap-24">
          <ol>
            {services.practices.map((p, i) => {
              const t = practiceTones[i]
              const on = i === active
              return (
                <li key={p.name} data-practice className="lg:flex lg:min-h-[70vh] lg:items-center">
                  <div
                    className={`border-l py-2 pl-6 transition-[opacity,border-color] duration-500 lg:max-w-[28rem] ${
                      on ? t.border : 'border-line lg:opacity-30'
                    }`}
                  >
                    <p className={`font-mono text-[0.68rem] uppercase tracking-[0.12em] ${t.text}`}>
                      {String(p.count).padStart(2, '0')} offerings
                    </p>
                    <h3 className="mt-3 text-[1.35rem] font-medium tracking-[-0.03em]">{p.name}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-3">{p.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-fg-2">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <TextLink href={p.href} className="mt-6">
                      {services.explore}
                    </TextLink>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-17rem)] pb-[18vh]">
              <PracticeWindow active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
