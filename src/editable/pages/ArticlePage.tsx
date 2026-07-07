import { EditableTaskArchiveRoute, taskMetadata } from '@/editable/pages/TaskArchivePage'

export const revalidate = 3

export const generateMetadata = () => taskMetadata('article', '/article')

export async function ArticlePageTaskPage({
  searchParams,
  basePath = '/article',
}: {
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0b0b0f] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.28),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-indigo-400" /> Latest Reads
          </span>
          <h1 className="editable-display mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-white">Fresh</span>{' '}
            <span className="editable-gradient-text">Stories</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Browse guides, essays, and deep dives handpicked from the community.
          </p>
        </div>
      </section>
      <EditableTaskArchiveRoute task="article" searchParams={searchParams} basePath={basePath} />
    </>
  )
}

export default ArticlePageTaskPage

export const ArticleTaskPage = ArticlePageTaskPage
