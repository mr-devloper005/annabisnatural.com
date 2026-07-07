import Link from 'next/link'
import { ArrowRight, Heart, MessageCircle } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

const chipPalette = [
  'bg-red-500 text-white',
  'bg-indigo-500 text-white',
  'bg-amber-500 text-white',
  'bg-emerald-500 text-white',
  'bg-purple-500 text-white',
]

const chipTextPalette = [
  'text-red-600',
  'text-indigo-600',
  'text-amber-600',
  'text-emerald-600',
  'text-purple-600',
]

export function EditorialFeatureCard({ post, href, label = 'Trending' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block min-w-0 overflow-hidden rounded-2xl bg-black text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative min-h-[420px] p-6 sm:p-8">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-end">
          <span className="inline-flex w-fit items-center rounded-full bg-[#EF4444] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {label}
          </span>
          <h3 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl" style={{ fontFamily: 'Fraunces, serif' }}>{post.title}</h3>
          <p className="mt-3 line-clamp-2 max-w-2xl text-sm text-white/80">{getEditableExcerpt(post, 160)}</p>
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#EF4444] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:brightness-110">
            Read Full Story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const chip = chipPalette[index % chipPalette.length]
  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${chip}`}>
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-black transition group-hover:text-[#EF4444]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const chipText = chipTextPalette[index % chipTextPalette.length]
  return (
    <Link href={href} className="group block border-b border-[#e5e7eb] py-4 transition hover:bg-gray-50">
      <div className="flex items-start gap-4">
        <span className="mt-1 shrink-0 text-2xl font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <span className={`text-[11px] font-bold uppercase tracking-wider ${chipText}`}>{getEditableCategory(post)}</span>
          <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-black transition group-hover:text-[#EF4444]" style={{ fontFamily: 'Fraunces, serif' }}>
            {post.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const chip = chipPalette[index % chipPalette.length]
  return (
    <Link href={href} className="group grid min-w-0 gap-5 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 sm:aspect-auto sm:min-h-[180px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${chip}`}>
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="min-w-0 p-2 sm:py-3 sm:pr-4">
        <h2 className="line-clamp-2 text-2xl font-bold leading-tight text-black transition group-hover:text-[#EF4444]" style={{ fontFamily: 'Fraunces, serif' }}>
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">{getEditableExcerpt(post, 200)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#EF4444]">
          Read more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function CompactRowCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const chipText = chipTextPalette[index % chipTextPalette.length]
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white p-2.5 pr-4 transition hover:border-[#EF4444]/40 hover:shadow-sm">
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${chipText}`}>{getEditableCategory(post)}</span>
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-black transition group-hover:text-[#EF4444]">{post.title}</h4>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> 24</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 6</span>
        </div>
      </div>
    </Link>
  )
}
