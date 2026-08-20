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
    <div className="min-h-screen bg-[#FFFFFF] text-[#080808] font-['Inter'] selection:bg-[#080808] selection:text-[#FFFFFF] antialiased">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-4 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#666666] hover:text-[#080808] transition-colors py-1 px-3 rounded-full hover:bg-[#F7F7F5] border border-transparent hover:border-[#E5E5E5]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Quirk</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <QuirkLogo size={22} lightMode={true} />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={copyArticleLink}
              className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#080808] px-3 py-1.5 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] transition-colors"
              aria-label="Share article"
            >
              {copied ? <Check className="size-3.5 text-[#080808]" /> : <Share2 className="size-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
            <a
              href="https://github.com/T9ner/quirk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-medium text-xs px-4 py-1.5 rounded-full transition-all active:scale-[0.97]"
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
        <div className="flex flex-wrap items-center gap-3 text-xs font-['JetBrains_Mono'] text-[#666666] mb-6">
          <span className="px-3 py-1 rounded-full bg-[#F7F7F5] border border-[#E5E5E5] text-[#080808] font-semibold uppercase text-[10px]">
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
        <h1 className="font-['Satoshi'] text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] leading-[1.15] mb-6">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-lg text-[#666666] leading-relaxed mb-12 pb-8 border-b border-[#E5E5E5]">
          {article.excerpt}
        </p>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-sm sm:text-base text-[#333333] leading-relaxed">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Code Block Example if present */}
        {article.codeSnippet && (
          <div className="my-10 rounded-2xl bg-[#080808] border border-[#222222] overflow-hidden text-[#FFFFFF]">
            <div className="px-4 py-2.5 bg-[#141414] border-b border-[#222222] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#888888]">
              <span>architecture.ts</span>
              <span>TypeScript</span>
            </div>
            <pre className="p-5 text-xs font-['JetBrains_Mono'] leading-relaxed overflow-x-auto text-[#E5E5E5]">
              <code>{article.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Author / Footer Sign-off */}
        <div className="mt-16 pt-8 border-t border-[#E5E5E5] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#888888] font-['JetBrains_Mono']">WRITTEN BY</p>
            <p className="text-sm font-semibold text-[#080808] mt-0.5">{article.author}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#080808] hover:underline"
          >
            <span>Explore Quirk Platform</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Other Insights */}
        {otherArticles.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#E5E5E5]">
            <h3 className="font-['Satoshi'] text-xl font-bold text-[#080808] mb-6">
              More Architecture Insights
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherArticles.map((other) => (
                <div
                  key={other.slug}
                  onClick={() => navigate({ to: '/insights/$slug', params: { slug: other.slug } })}
                  className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] hover:border-[#CCCCCC] cursor-pointer transition-all space-y-2 group"
                >
                  <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#666666] px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#E5E5E5]">
                    {other.tag}
                  </span>
                  <h4 className="font-bold text-sm text-[#080808] group-hover:text-[#444444] transition-colors leading-snug">
                    {other.title}
                  </h4>
                  <p className="text-xs text-[#666666] line-clamp-2">{other.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] py-12 text-xs text-[#888888] bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.</p>
          <Link to="/" className="text-[#080808] hover:underline font-medium">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  )
}
