import Link from 'next/link'
import { ArrowRight, ArrowLeft, BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  getEditablePostImage,
  getEditableExcerpt,
  getEditableCategory,
  postHref,
  EditorialFeatureCard,
  RailPostCard,
  CompactRowCard,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const container = 'mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8'

const hotChipPalette = [
  'bg-red-100 text-red-700',
  'bg-indigo-100 text-indigo-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
]

/* ----------------------------- Hero banner ----------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  void primaryTask
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const featured = pool.slice(0, 3)
  const badge = pagesContent.home.hero.badge || 'Top Picks'
  const titleParts = pagesContent.home.hero.title || ['Hand', 'Picked']
  const description = pagesContent.home.hero.description

  return (
    <section className="relative overflow-hidden bg-[#0b0b0f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.18),transparent_55%)]" />
      <div aria-hidden className="editable-float pointer-events-none absolute left-[-60px] top-24 h-48 w-48 rounded-full bg-pink-500/20 blur-3xl" />
      <div aria-hidden className="editable-float pointer-events-none absolute right-[-40px] bottom-32 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" style={{ animationDelay: '2s' }} />

      <div className={`relative ${container} py-16 sm:py-20 lg:py-24`}>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            {badge}
          </span>
          <h1 className="editable-display mt-6 text-balance text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">{titleParts[0]}</span>{' '}
            <span className="editable-gradient-text">{titleParts[1] || 'Picked'}</span>
          </h1>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">{description}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_40px_rgba(236,72,153,0.35)] transition hover:brightness-110"
            >
              Start Writing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore Content
            </Link>
          </div>
        </div>

        {featured.length ? (
          <div className="relative mt-14">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
              {featured.map((post, i) => {
                const href = postHref(primaryTask, post, primaryRoute)
                const isCenter = i === 1
                return (
                  <div key={post.id || post.slug} className={isCenter ? 'lg:scale-105 lg:shadow-2xl' : 'lg:opacity-90'}>
                    <EditorialFeatureCard post={post} href={href} label={i === 0 ? 'Trending' : i === 1 ? 'Editor Pick' : 'Featured'} />
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <button type="button" aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`h-2 rounded-full transition ${i === 1 ? 'w-8 bg-pink-400' : 'w-2 bg-white/25'}`} />
                ))}
              </div>
              <button type="button" aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition hover:bg-white/10">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ---------------------------- Editor's Pick --------------------------- */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  if (!pool.length) return null
  const main = pool[0]
  const hot = pool.slice(1, 5)
  const mainHref = postHref(primaryTask, main, primaryRoute)
  const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <section className="bg-white">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="text-center">
          <h2 className="editable-display flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-black sm:text-4xl" style={{ fontFamily: 'Fraunces, serif' }}>
            <span className="text-[#EF4444]">—</span>
            Editor's Pick
            <span className="text-[#EF4444]">—</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500">Outstanding contributions from our authors.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <Link href={mainHref} className="group relative block overflow-hidden rounded-2xl bg-black text-white shadow-md">
            <div className="relative min-h-[460px] p-6 sm:p-8">
              <img src={getEditablePostImage(main)} alt={main.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative z-10 flex h-full min-h-[430px] flex-col justify-end">
                <span className="inline-flex w-fit items-center rounded-full bg-[#EF4444] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Trending</span>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
                  <span>By {SITE_CONFIG.name}</span>
                  <span>·</span>
                  <span>{today}</span>
                  <span>·</span>
                  <span>6 min read</span>
                </div>
                <h3 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl" style={{ fontFamily: 'Fraunces, serif' }}>{main.title}</h3>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-white/80">{getEditableExcerpt(main, 180)}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/80">
                    <span className="inline-flex items-center gap-1.5 text-sm"><Heart className="h-4 w-4" /> 128</span>
                    <span className="inline-flex items-center gap-1.5 text-sm"><MessageCircle className="h-4 w-4" /> 42</span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:brightness-110">
                    Read Full Story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black">🔥 Hot Right Now</h3>
            <div className="grid gap-4">
              {hot.map((post, i) => {
                const href = postHref(primaryTask, post, primaryRoute)
                const chip = hotChipPalette[i % hotChipPalette.length]
                const hearts = 20 + (hashStr(post.slug || post.title || 'x') % 200)
                const number = String(i + 5).padStart(2, '0')
                return (
                  <Link key={post.id || post.slug} href={href} className="group flex items-start gap-4 border-b border-[#e5e7eb] pb-4 last:border-b-0 last:pb-0">
                    <span className="text-2xl font-bold text-gray-300">{number}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${chip}`}>
                        {getEditableCategory(post)}
                      </span>
                      <h4 className="mt-1.5 line-clamp-2 text-sm font-semibold text-black transition group-hover:text-[#EF4444]" style={{ fontFamily: 'Fraunces, serif' }}>
                        {post.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
                        <span>By {SITE_CONFIG.name}</span>
                        <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {hearts}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Editor Verified --------------------------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const items = pool.slice(0, 3)
  if (!items.length) return null

  return (
    <section className="bg-white">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl" style={{ fontFamily: 'Fraunces, serif' }}>Editor Verified</h2>
            <span className="ml-2 h-px w-16 bg-indigo-600" />
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post, i) => (
            <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------ Discover more + tagline + marquee ------------------ */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const marqueeItems = pool.slice(0, 8)

  return (
    <section className="bg-white">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-col items-center gap-10 text-center">
          <h2 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl" style={{ fontFamily: 'Fraunces, serif' }}>
            Your story <em className="italic underline decoration-[#EF4444] decoration-4 underline-offset-4">deserves</em> to be heard.
          </h2>
        </div>
      </div>

      {marqueeItems.length ? (
        <div className="border-y border-[#e5e7eb] bg-gray-50 py-10">
          <div className="editable-marquee gap-4">
            {[0, 1].map((dupe) => (
              <div key={dupe} className="flex shrink-0 gap-4 pl-4">
                {marqueeItems.map((post, i) => (
                  <div key={`${dupe}-${post.id || post.slug}`} className="w-[340px] shrink-0">
                    <CompactRowCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* -------------------------------- CTA band ------------------------------ */
export function EditableHomeCta() {
  return (
    <section className="bg-white">
      <div className={`flex flex-col items-center gap-6 py-16 text-center sm:py-20 ${container}`}>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-black sm:text-4xl" style={{ fontFamily: 'Fraunces, serif' }}>
          {pagesContent.home.cta.title}
        </h2>
        <p className="max-w-xl text-base text-gray-600 sm:text-lg">{pagesContent.home.cta.description}</p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-full bg-[#EF4444] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          Submit Your Story <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
