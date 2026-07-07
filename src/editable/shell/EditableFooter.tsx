'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const links: Array<[string, string]> = [
    ['Home', '/'],
    ['About', '/about'],
    ['Contact', '/contact'],
    ['Search', '/search'],
  ]

  return (
    <footer className="border-t border-[#e5e7eb] bg-white text-black">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
          <span className="editable-display text-2xl font-bold lowercase tracking-tight sm:text-3xl">{SITE_CONFIG.name}</span>
        </Link>

        {globalContent.footer?.description ? (
          <p className="max-w-2xl text-sm leading-7 text-gray-500">{globalContent.footer.description}</p>
        ) : null}

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {links.map(([label, href]) => (
            <Link key={href + label} href={href} className="text-gray-600 transition hover:text-black">{label}</Link>
          ))}
        </nav>

<div className="flex flex-wrap items-center justify-center gap-3">
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center rounded-full border border-[#e5e7eb] px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center rounded-full border border-[#e5e7eb] px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:text-black">Login</Link>
              <Link href="/signup" className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-110">Sign up</Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-[#e5e7eb] px-4 py-5 text-center text-xs font-medium text-gray-500">
        © 2009-{year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
