'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const defaultTask = (enabledTasks[0]?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task: defaultTask,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <section className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white">
              <Lock className="h-6 w-6" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">{pagesContent.create.locked.badge}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pagesContent.create.locked.title}</h1>
            <p className="mt-4 text-sm leading-7 text-gray-600">{pagesContent.create.locked.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Login <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
              >
                Sign up
              </Link>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-600">{pagesContent.create.hero.badge}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{pagesContent.create.hero.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">{pagesContent.create.hero.description}</p>
          </header>

          <form
            onSubmit={submit}
            className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5">
              <h2 className="text-lg font-semibold text-gray-900">{pagesContent.create.formTitle}</h2>
              <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                {session.name}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Title</span>
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a headline" required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Category</span>
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Wellness" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Source URL</span>
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Featured image</span>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Summary</span>
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A short teaser for readers" required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Content</span>
                <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your story…" required />
              </label>
            </div>

            {created ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{pagesContent.create.successTitle}</p>
                  <p className="mt-0.5 text-sm opacity-80">{created.title}</p>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_30px_rgba(217,70,239,0.35)] transition hover:brightness-110"
            >
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
