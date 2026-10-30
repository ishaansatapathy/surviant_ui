import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { email, links, nav } from '../content'
import { getLenis } from '../lib/motion'
import { Button } from './ui'

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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        scrolled || open ? 'border-line bg-black/75 backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <nav aria-label="Primary" className="wrap flex h-16 items-center gap-10">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Surviant home">
          <img src="/images/surviant-logo.jpg" alt="" className="h-7 w-7 rounded-[7px]" />
          <span className="text-[1rem] font-medium tracking-[-0.03em]">{nav.name}</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="text-[0.875rem] text-fg-3 transition-colors duration-300 hover:text-fg">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={`mailto:${email}`}
            className="hidden h-9 items-center rounded-full border border-line-2 px-4 text-[0.82rem] font-medium transition-colors hover:border-white/30 sm:inline-flex"
          >
            Talk to us
          </a>
          <span className="hidden sm:block">
            <Button href={links.contact} className="!h-9 !px-4 !text-[0.82rem]">
              {nav.cta}
            </Button>
          </span>
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
        <div className="wrap border-t border-line pb-8 pt-4 md:hidden">
          <ul>
            {items.map((item) => (
              <li key={item.label} className="border-b border-line">
                <a href={item.href} onClick={() => setOpen(false)} className="block py-4 text-[1.25rem] font-medium tracking-[-0.03em]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={links.contact} className="mt-6 w-full justify-center !h-11">
            {nav.cta}
          </Button>
        </div>
      )}
    </header>
  )
}
