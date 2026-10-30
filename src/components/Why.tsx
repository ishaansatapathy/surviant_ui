import { useRef, useState } from 'react'
import { whySurviant } from '../content'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { Heading } from './ui'

export function Why() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  // The row crossing the reading line brightens; the rest stay quiet.
  useGSAP(
    () => {
      root.current!.querySelectorAll<HTMLElement>('[data-why]').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 58%', end: 'bottom 58%', onToggle: (self) => self.isActive && setActive(i) })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="why-surviant" className="border-t border-line">
      <div className="frame grid gap-12 py-24 md:py-32 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-[32vh]">
          <Heading label={whySurviant.eyebrow} text={whySurviant.title} />
          <p data-fade className="mt-6 max-w-[26rem] text-[15px] leading-[1.7] text-fg-2">
            {whySurviant.body}
          </p>
        </div>

        <ol>
          {whySurviant.items.map((item, i) => {
            const on = i === active
            return (
              <li key={item.label} data-why className="border-t border-line py-10 last:border-b lg:py-14">
                <p className={`label transition-colors duration-500 ${on ? '!text-fg-2' : ''}`}>
                  0{i + 1} &nbsp;/&nbsp; {item.label}
                </p>
                <h3 className="heading mt-5 text-[clamp(1.7rem,3vw,2.5rem)]">
                  <span className={`transition-colors duration-700 ${on ? 'text-fg' : 'text-fg-4'}`}>{item.title[0]}</span>
                  <span className={`transition-colors duration-700 ${on ? 'text-fg-3' : 'text-fg-4'}`}>{item.title[1]}</span>
                </h3>
                <div className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-[32rem] pt-4 text-[15.5px] leading-[1.7] text-fg-2">{item.body}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
