'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, Moon, Sun, User } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const THEME_KEY = 'anna:theme'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_KEY)
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      const shouldDark = stored ? stored === 'dark' : !!prefersDark
      setDark(shouldDark)
      document.documentElement.classList.toggle('dark', shouldDark)
    } catch {}
  }, [])

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev
      try {
        document.documentElement.classList.toggle('dark', next)
        window.localStorage.setItem(THEME_KEY, next ? 'dark' : 'light')
      } catch {}
      return next
    })
  }

  const accountHref = session ? '/create' : '/login'
  const accountLabel = session ? 'Account' : 'Sign in'

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  const pillBase = 'inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition'
  const activePill = 'bg-gray-100 text-black'
  const inactivePill = 'text-gray-600 hover:text-black'

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white text-black">
      <nav className="mx-auto flex min-h-[104px] w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
          <span className="editable-display text-2xl font-bold lowercase tracking-tight text-black sm:text-3xl">{SITE_CONFIG.name}</span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 lg:flex">
          <Link href="/" className={`${pillBase} ${isActive('/') ? activePill : inactivePill}`}>Home</Link>
          <Link href="/about" className={`${pillBase} ${isActive('/about') ? activePill : inactivePill}`}>About</Link>
          <Link href="/contact" className={`${pillBase} ${isActive('/contact') ? activePill : inactivePill}`}>Contact</Link>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3.5 py-1.5 text-sm font-medium text-gray-600 transition hover:text-black md:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span className="rounded border border-[#e5e7eb] bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Ctrl K</span>
          </Link>
          <button
            type="button"
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-gray-600 transition hover:text-black md:inline-flex"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href={accountHref}
            aria-label={accountLabel}
            title={accountLabel}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-gray-600 transition hover:text-black md:inline-flex"
          >
            <User className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <span className="hidden items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-2 py-1 md:inline-flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                  {session.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="pr-2 text-sm font-medium text-black">{session.name}</span>
              </span>
              <Link
                href="/create"
                className="hidden items-center rounded-full bg-gradient-to-r from-[#EF4444] to-[#e11d48] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 sm:inline-flex"
              >
                Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center rounded-full border border-[#e5e7eb] px-3.5 py-1.5 text-sm font-medium text-gray-600 transition hover:text-black sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center rounded-full border border-[#e5e7eb] px-3.5 py-1.5 text-sm font-medium text-gray-600 transition hover:text-black sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] text-gray-600 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[#e5e7eb] bg-white px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-[#e5e7eb] px-4 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input name="q" type="search" placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400" />
          </form>
          <div className="grid gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Search', href: '/search' },
            ].map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${active ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-2 grid gap-2 border-t border-[#e5e7eb] pt-3">
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-full bg-gradient-to-r from-[#EF4444] to-[#e11d48] px-4 py-2 text-center text-sm font-semibold text-white">Create</Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-full border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-gray-700">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-[#e5e7eb] px-4 py-2 text-center text-sm font-medium text-gray-700">Login</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-full bg-black px-4 py-2 text-center text-sm font-semibold text-white">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
