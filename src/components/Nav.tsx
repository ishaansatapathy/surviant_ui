import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { email, links, nav } from '../content'
import { getLenis } from '../lib/motion'

// On the landing page the nav jumps to its sections; Research keeps its own page.
const items = [
  { label: 'Services', href: '#services' },
  { label: 'How We Work', href: '#how-we-work' },
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#leadership' },
  { label: 'Research', href: links.research },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) getLenis()?.stop()
    else getLenis()?.start()
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 animate-[drop-in_1.1s_var(--ease-out)_both] border-b transition-[background-color,border-color] duration-500 ${
        scrolled || open ? 'border-line bg-black/80 backdrop-blur-lg' : 'border-transparent'
      }`}
    >
      <nav aria-label="Primary" className="frame flex h-16 items-center gap-10">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Surviant home">
          <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[7px]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">{nav.name}</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="text-[13.5px] text-fg-2 transition-colors duration-200 hover:text-fg">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a href={`mailto:${email}`} className="hidden h-[34px] items-center px-3 text-[13.5px] text-fg-2 transition-colors hover:text-fg sm:flex">
            Talk to us
          </a>
          <a
            href={links.contact}
            className="hidden h-[34px] items-center rounded-full bg-white px-4 text-[13px] font-semibold text-black transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#e7e7ea] sm:flex"
          >
            {nav.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line-2 md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="frame border-t border-line pb-8 pt-4 md:hidden">
          <ul>
            {items.map((item) => (
              <li key={item.label} className="border-b border-line">
                <a href={item.href} onClick={() => setOpen(false)} className="block py-4 text-[1.25rem] font-medium tracking-[-0.03em]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={links.contact}
            className="mt-6 flex h-11 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-black"
          >
            {nav.cta}
          </a>
        </div>
      )}
    </header>
  )
}
