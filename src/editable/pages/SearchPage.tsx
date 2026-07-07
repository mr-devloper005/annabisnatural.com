import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { Ads } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-[#EF4444] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5">
        {!image ? <span className="rounded-full bg-[#EF4444] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{taskLabel}</span> : null}
        <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-black transition group-hover:text-[#EF4444]" style={{ fontFamily: 'Fraunces, serif' }}>{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#EF4444]">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">{pagesContent.search.hero.badge}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl" style={{ fontFamily: 'Fraunces, serif' }}>{pagesContent.search.hero.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">{pagesContent.search.hero.description}</p>
          </div>

          <form action="/search" className="mx-auto mt-8 max-w-3xl">
            <input type="hidden" name="master" value="1" />
            <div className="flex overflow-hidden rounded-full border border-[#e5e7eb] bg-white shadow-sm focus-within:border-[#EF4444]">
              <div className="flex flex-1 items-center gap-3 px-5">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent py-4 text-base outline-none placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="shrink-0 bg-[#EF4444] px-8 text-sm font-bold text-white transition hover:brightness-95">
                Search
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                name="category"
                defaultValue={category}
                placeholder="Category"
                className="rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm outline-none focus:border-[#EF4444]"
              />
              <select name="task" defaultValue={task} className="rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm outline-none focus:border-[#EF4444]">
                <option value="">All content types</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </div>
          </form>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{results.length} results</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl" style={{ fontFamily: 'Fraunces, serif' }}>
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-black">
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[#e5e7eb] bg-gray-50 p-10 text-center">
              <p className="text-2xl font-bold tracking-tight text-black" style={{ fontFamily: 'Fraunces, serif' }}>No results found.</p>
              <p className="mt-3 text-sm text-gray-500">Try a different keyword or category.</p>
            </div>
          )}
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="sidebar" showLabel eager className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
