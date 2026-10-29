import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { links, nav } from '../content'
import { getLenis } from '../lib/motion'
import { Button } from './ui'

const items = nav.items.filter((i) => i.label !== 'Research')

export function Nav() {
  const [floating, setFloating] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) getLenis()?.stop()
    else getLenis()?.start()
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav
        aria-label="Primary"
        className={`mx-auto flex h-14 items-center justify-between rounded-full pl-3 pr-2 transition-all duration-500 ease-out ${
          floating
            ? 'max-w-[1180px] border border-line bg-paper/85 shadow-[0_10px_30px_-18px_rgba(40,30,10,0.35)] backdrop-blur-xl'
            : 'max-w-[1280px] border border-transparent'
        }`}
      >
        <a href="/" className="flex items-center gap-2.5" aria-label="Surviant home">
          <img src="/images/surviant-logo.jpg" alt="" className="h-8 w-8 rounded-[8px]" />
          <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">{nav.name}</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="text-[0.92rem] text-ink-2 transition-colors hover:text-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button href={links.contact} className="!h-10 !px-5">
              {nav.cta}
            </Button>
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-line md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-x-3 top-20 rounded-3xl border border-line bg-paper p-6 shadow-xl md:hidden">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.label} className="border-b border-line last:border-0">
                <a href={item.href} onClick={() => setOpen(false)} className="serif block py-3 text-3xl">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={links.contact} className="mt-5 w-full justify-center">
            {nav.cta}
          </Button>
        </div>
      )}
    </header>
  )
}
