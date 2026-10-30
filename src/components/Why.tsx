import { whySurviant } from '../content'
import { Kicker, tones } from './ui'

const itemTones = [tones.violet, tones.blue, tones.orange, tones.green]

export function Why() {
  return (
    <section id="why-surviant" className="border-t border-line pt-28 md:pt-40">
      <div className="wrap">
        <Kicker>{whySurviant.eyebrow}</Kicker>
        <p data-scrub className="display mt-8 max-w-[58rem] text-[clamp(1.6rem,3.2vw,2.6rem)] !leading-[1.2]">
          {whySurviant.title.join('')} {whySurviant.body}
        </p>
      </div>

      <div className="mt-20 border-t border-line md:mt-28">
        <div className="wrap !px-0 md:!px-8">
          <ul className="grid border-line sm:grid-cols-2 md:border-x lg:grid-cols-4">
            {whySurviant.items.map((item, i) => {
              const t = itemTones[i]
              return (
                <li
                  key={item.label}
                  data-reveal={i * 0.08}
                  className="group relative border-b border-line p-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 md:p-8"
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 ${t.bg}`}
                    aria-hidden
                  />
                  <p className={`flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] ${t.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${t.bg}`} />
                    {item.label}
                  </p>
                  <h3 className="mt-6 text-[1.1rem] font-medium leading-snug tracking-[-0.025em]">
                    <span className="text-fg">{item.title[0]}</span>
                    <span className="text-fg-3">{item.title[1]}</span>
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-fg-3">{item.body}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
