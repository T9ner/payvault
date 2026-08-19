import React from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, Share2, Copy, BookOpen, ExternalLink } from 'lucide-react'
import { QuirkLogo } from '@/components/quirk-logo'
import { INSIGHTS_ARTICLES } from './insights-data'

export function InsightDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug?: string }
  const navigate = useNavigate()
  const [copied, setCopied] = React.useState(false)

  const article = INSIGHTS_ARTICLES.find((a) => a.slug === slug) || INSIGHTS_ARTICLES[0]
  const otherArticles = INSIGHTS_ARTICLES.filter((a) => a.slug !== article.slug)

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F5F7FA] font-['Inter'] selection:bg-[#ABFF2A] selection:text-[#080B10] antialiased">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-4 bg-[#080B10]/85 backdrop-blur-xl border-b border-[#22303A]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A9B0BB] hover:text-[#F5F7FA] transition-colors py-1 px-3 rounded-full hover:bg-[#11161D] border border-transparent hover:border-[#22303A]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Quirk</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <QuirkLogo size={22} lightMode={false} />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={copyArticleLink}
              className="inline-flex items-center gap-1.5 text-xs text-[#A9B0BB] hover:text-[#F5F7FA] px-3 py-1.5 rounded-full bg-[#11161D] border border-[#22303A] transition-colors"
              aria-label="Share article"
            >
              {copied ? <Check className="size-3.5 text-[#ABFF2A]" /> : <Share2 className="size-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <Link
              to="/sign-up"
              className="inline-flex items-center gap-1.5 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-xs px-4 py-1.5 rounded-full transition-all active:scale-[0.97]"
            >
              Get API Keys
            </Link>
          </div>
        </div>
      </header>

      {/* Article Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-['JetBrains_Mono'] text-[#A9B0BB] mb-6">
          <span className="px-3 py-1 rounded-full bg-[#171D26] border border-[#22303A] text-[#ABFF2A] font-semibold uppercase">
            {article.tag}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {article.date}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-['Satoshi'] text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F7FA] leading-[1.15] mb-6">
          {article.title}
        </h1>

        {/* Author Bio Header */}
        <div className="p-4 rounded-2xl bg-[#11161D] border border-[#22303A] flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#171D26] border border-[#22303A] flex items-center justify-center font-bold text-xs text-[#ABFF2A]">
              Q
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F5F7FA]">{article.author}</div>
              <div className="text-[11px] text-[#A9B0BB]">{article.authorRole}</div>
            </div>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] text-[#00D4FF] bg-[#171D26] px-2.5 py-1 rounded-full border border-[#22303A]">
            Verified Research
          </span>
        </div>

        {/* Article Body */}
        <article className="space-y-6 text-sm sm:text-base text-[#A9B0BB] leading-relaxed font-normal">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="text-[#F5F7FA]/90">
              {paragraph}
            </p>
          ))}

          {/* Technical Code Highlight */}
          {article.codeSnippet && (
            <div className="my-8 rounded-2xl bg-[#11161D] border border-[#22303A] overflow-hidden shadow-xl">
              <div className="px-4 py-2.5 bg-[#171D26] border-b border-[#22303A] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#A9B0BB]">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-[#EF4444]" />
                  <div className="size-2.5 rounded-full bg-[#F5B83D]" />
                  <div className="size-2.5 rounded-full bg-[#ABFF2A]" />
                  <span className="ml-2 text-[#F5F7FA] font-medium uppercase text-[10px]">
                    {article.codeSnippet.lang}
                  </span>
                </div>
                <span>Architecture Implementation</span>
              </div>
              <pre className="p-5 font-['JetBrains_Mono'] text-xs text-[#F5F7FA] overflow-x-auto leading-relaxed">
                <code>{article.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#11161D] border border-[#22303A] my-8 space-y-3">
            <h3 className="font-['Satoshi'] text-base font-bold text-[#F5F7FA]">Key Architectural Takeaways</h3>
            <ul className="space-y-2 text-xs text-[#A9B0BB]">
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#ABFF2A] shrink-0 mt-0.5" />
                <span>Deterministic out-of-band health probing prevents customer dropouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#ABFF2A] shrink-0 mt-0.5" />
                <span>Single integration SDK (`@quirk/sdk`) handles all multi-rail routing internally.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#ABFF2A] shrink-0 mt-0.5" />
                <span>Zero vendor lock-in allows seamless vaulting of your own provider credentials.</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Read Next Section */}
        <section className="mt-20 pt-12 border-t border-[#22303A]">
          <h2 className="font-['Satoshi'] text-xl font-bold text-[#F5F7FA] mb-6">Read More Engineering Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map((other, idx) => (
              <Link
                key={idx}
                to={`/insights/${other.slug}`}
                className="p-6 rounded-2xl bg-[#11161D] border border-[#22303A] hover:border-[#ABFF2A]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-[10px] font-['JetBrains_Mono'] text-[#ABFF2A] uppercase mb-2">
                    {other.tag} · {other.readTime}
                  </div>
                  <h3 className="font-['Satoshi'] text-sm font-bold text-[#F5F7FA] group-hover:text-[#ABFF2A] transition-colors mb-2">
                    {other.title}
                  </h3>
                  <p className="text-xs text-[#A9B0BB] line-clamp-2">{other.summary}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#22303A] flex items-center justify-between text-xs text-[#A9B0BB] group-hover:text-[#F5F7FA]">
                  <span>Read article</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#22303A] py-12 text-center text-xs text-[#A9B0BB]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Quirk Infrastructure Inc.</div>
          <Link to="/" className="text-[#ABFF2A] hover:underline">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
