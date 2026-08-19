import React from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check, Clock, Calendar, Share2, ExternalLink } from 'lucide-react'
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
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['Inter'] selection:bg-[#FFFFFF] selection:text-[#000000] antialiased">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-4 bg-[#000000]/85 backdrop-blur-xl border-b border-[#222222]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A9A9A9] hover:text-[#FFFFFF] transition-colors py-1 px-3 rounded-full hover:bg-[#101010] border border-transparent hover:border-[#222222]"
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
              className="inline-flex items-center gap-1.5 text-xs text-[#A9A9A9] hover:text-[#FFFFFF] px-3 py-1.5 rounded-full bg-[#101010] border border-[#222222] transition-colors"
              aria-label="Share article"
            >
              {copied ? <Check className="size-3.5 text-[#FFFFFF]" /> : <Share2 className="size-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <a
              href="https://github.com/T9ner/quirk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs px-4 py-1.5 rounded-full transition-all active:scale-[0.97]"
            >
              <span>GitHub</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Article Content Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-['JetBrains_Mono'] text-[#A9A9A9] mb-6">
          <span className="px-3 py-1 rounded-full bg-[#141414] border border-[#222222] text-[#FFFFFF] font-semibold uppercase text-[10px]">
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
        <h1 className="font-['Satoshi'] text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-[1.15] mb-6">
          {article.title}
        </h1>

        {/* Author Bio Header */}
        <div className="p-4 rounded-2xl bg-[#101010] border border-[#222222] flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#161616] border border-[#222222] flex items-center justify-center font-bold text-xs text-[#FFFFFF]">
              Q
            </div>
            <div>
              <div className="text-xs font-semibold text-[#FFFFFF]">{article.author}</div>
              <div className="text-[11px] text-[#A9A9A9]">{article.authorRole}</div>
            </div>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] bg-[#161616] px-2.5 py-1 rounded-full border border-[#222222]">
            Verified Research
          </span>
        </div>

        {/* Article Body */}
        <article className="space-y-6 text-sm sm:text-base text-[#A9A9A9] leading-relaxed font-normal">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="text-[#FFFFFF]/90">
              {paragraph}
            </p>
          ))}

          {/* Technical Code Highlight */}
          {article.codeSnippet && (
            <div className="my-8 rounded-2xl bg-[#101010] border border-[#222222] overflow-hidden shadow-xl">
              <div className="px-4 py-2.5 bg-[#141414] border-b border-[#222222] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#A9A9A9]">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#333333]" />
                  <div className="size-2 rounded-full bg-[#333333]" />
                  <div className="size-2 rounded-full bg-[#333333]" />
                  <span className="ml-2 text-[#FFFFFF] font-medium uppercase text-[10px]">
                    {article.codeSnippet.lang}
                  </span>
                </div>
                <span>Architecture Implementation</span>
              </div>
              <pre className="p-5 font-['JetBrains_Mono'] text-xs text-[#FFFFFF] overflow-x-auto leading-relaxed">
                <code>{article.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#101010] border border-[#222222] my-8 space-y-3">
            <h3 className="font-['Satoshi'] text-base font-bold text-[#FFFFFF]">Key Architectural Takeaways</h3>
            <ul className="space-y-2 text-xs text-[#A9A9A9]">
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#FFFFFF] shrink-0 mt-0.5" />
                <span>Deterministic out-of-band health probing prevents customer dropouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#FFFFFF] shrink-0 mt-0.5" />
                <span>Single integration SDK (`@quirk/sdk`) handles all multi-rail routing internally.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="size-4 text-[#FFFFFF] shrink-0 mt-0.5" />
                <span>Zero vendor lock-in allows seamless vaulting of your own provider credentials.</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Read Next Section */}
        <section className="mt-20 pt-12 border-t border-[#222222]">
          <h2 className="font-['Satoshi'] text-xl font-bold text-[#FFFFFF] mb-6">Read More Engineering Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map((other, idx) => (
              <Link
                key={idx}
                to={`/insights/${other.slug}`}
                className="p-6 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-[10px] font-['JetBrains_Mono'] text-[#A9A9A9] uppercase mb-2">
                    {other.tag} · {other.readTime}
                  </div>
                  <h3 className="font-['Satoshi'] text-sm font-bold text-[#FFFFFF] group-hover:text-[#FFFFFF] transition-colors mb-2">
                    {other.title}
                  </h3>
                  <p className="text-xs text-[#A9A9A9] line-clamp-2">{other.summary}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#222222] flex items-center justify-between text-xs text-[#A9A9A9] group-hover:text-[#FFFFFF]">
                  <span>Read article</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-12 text-center text-xs text-[#A9A9A9]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Quirk Infrastructure Inc.</div>
          <Link to="/" className="text-[#FFFFFF] hover:underline">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
