import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { links, nav, portal } from '../content'
import { getLenis, gsap, useGSAP } from '../lib/motion'
import { Button } from './ui'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 4) {
        setHidden(y > last && y > 480)
        last = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  useGSAP(
    () => {
      if (!open) return
      gsap.from('[data-menu-item]', { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' })
    },
    { dependencies: [open], scope: menu },
  )

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-expo ${
          hidden && !open ? '-translate-y-full' : scrolled ? '-translate-y-8' : 'translate-y-0'
        }`}
      >
        {/* Portal notice */}
        <div className="h-8 border-b border-edge-soft bg-panel text-dim">
          <div className="shell flex h-full items-center justify-between gap-4 font-mono text-[0.64rem] uppercase tracking-[0.1em]">
            <p className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-fg/80">{portal.label}</span> <span className="text-faint">{portal.note}</span>
            </p>
            <ul className="hidden items-center gap-5 sm:flex">
              {portal.items.map((item) => (
                <li key={item} className="text-faint">
                  {item}
                  <span className="sr-only">{portal.srNote}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`border-b transition-colors duration-500 ${
            scrolled || open ? 'border-edge-soft bg-void/75 backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
        >
          <nav className="shell flex h-[4.25rem] items-center justify-between" aria-label="Primary">
            <a href="/" className="flex items-center gap-3" aria-label="Surviant home">
              <img src="/images/surviant-logo.jpg" alt="" className="h-9 w-9 rounded-[7px] ring-1 ring-edge" />
              <span className="leading-tight">
                <span className="block text-[1rem] font-semibold tracking-tight">{nav.name}</span>
                <span className="block font-mono text-[0.58rem] uppercase tracking-[0.12em] text-faint">
                  {nav.tagline}
                </span>
              </span>
            </a>

            <ul className="hidden items-center gap-1 rounded-full border border-edge-soft bg-panel/60 p-1 backdrop-blur lg:flex">
              {nav.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block rounded-full px-4 py-1.5 text-[0.86rem] text-dim transition-colors duration-300 hover:bg-raised hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <Button href={links.contact}>{nav.cta}</Button>
              </span>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-edge lg:hidden"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {open && (
        <div ref={menu} className="fixed inset-0 z-40 flex flex-col bg-void pt-32 lg:hidden">
          <ul className="shell flex flex-col">
            {nav.items.map((item) => (
              <li key={item.label} className="overflow-hidden border-b border-edge">
                <a
                  data-menu-item
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display block py-4 text-5xl"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="shell mt-10" data-menu-item>
            <Button href={links.contact}>{nav.cta}</Button>
          </div>
        </div>
      )}
    </>
  )
}
