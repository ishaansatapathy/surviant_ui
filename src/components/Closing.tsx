import { contact, email, footer, links, portal } from '../content'
import { Button } from './ui'

export function Closing() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="frame grid gap-10 py-24 md:py-36 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
        <div>
          <p data-fade className="label">
            Contact
          </p>
          <h2 data-lines className="heading mt-5 text-balance text-[clamp(1.9rem,3.4vw,2.8rem)] !leading-[1.12]">
            <span className="text-fg">Start a conversation. </span>
            <span className="text-fg-3">{contact.lead}</span>
          </h2>
        </div>
        <div>
          <p data-fade className="text-[15px] leading-[1.7] text-fg-2">
            {contact.body}
          </p>
          <div data-seq="0.1" className="mt-8 flex flex-wrap gap-2.5">
            <Button href={links.contact}>{contact.cta}</Button>
            <Button href={`mailto:${email}`} variant="ghost">
              {email}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div data-seq className="frame grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[7px]" />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Surviant</span>
          </a>
          <p className="mt-4 max-w-[17rem] text-[14px] leading-relaxed text-fg-3">{footer.blurb}</p>
          <p className="label mt-6 !text-[10px]">{footer.locations}</p>
        </div>
        {footer.columns.map((col) => (
          <div key={col.title}>
            <p className="label !text-[10px]">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[14px] text-fg-2 transition-colors hover:text-fg">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="label !text-[10px]">Contact</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li>
              <a href={`mailto:${email}`} className="text-fg-2 transition-colors hover:text-fg">
                {email}
              </a>
            </li>
            <li className="pt-2 text-fg-4">
              {portal.label} <span className="font-mono text-[11px]">/ {portal.note}</span>
            </li>
            {portal.items.map((item) => (
              <li key={item} className="text-fg-4">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="frame flex flex-col gap-3 py-6 text-[13px] text-fg-4 sm:flex-row sm:items-center sm:justify-between">
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
  )
}
