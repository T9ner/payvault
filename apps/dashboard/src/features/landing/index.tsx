import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Zap,
  Layers,
  Activity,
  RefreshCw,
  Cpu,
  Lock,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Building2,
  Smartphone,
  SlidersHorizontal,
  FileCode2,
  Search,
  CheckCircle2,
  Play,
  Share2,
  Shield,
  HelpCircle,
  ExternalLink,
  Radio,
  Clock,
  Calendar,
  Send,
  Code2,
  Database,
  Network,
} from 'lucide-react'
import { QuirkLogo } from '@/components/quirk-logo'
import { INSIGHTS_ARTICLES } from '@/features/insights/insights-data'

// Supported payment rails & ecosystem partners (Clean Infrastructure Focus)
const ECOSYSTEM_RAILS = [
  { name: 'Paystack Direct', category: 'Cards & Bank Transfer', region: 'Nigeria · Ghana · Kenya · SA', currency: 'NGN, GHS, KES, ZAR', status: 'Operational', ping: '185ms', code: 'PSTK' },
  { name: 'Flutterwave Switch', category: 'Pan-African & Global', region: '34 African Countries + Global', currency: 'USD, NGN, KES, GHS', status: 'Operational', ping: '210ms', code: 'FLW' },
  { name: 'M-Pesa Express', category: 'Mobile Money STK Push', region: 'Kenya · Tanzania · Global', currency: 'KES, TZS Direct Push', status: 'Operational', ping: '140ms', code: 'MPESA' },
  { name: 'Monnify Dynamic VA', category: 'Virtual Accounts & Debits', region: 'Nigeria Instant Clearing', currency: 'NGN Dynamic Accounts', status: 'Operational', ping: '195ms', code: 'MNFY' },
  { name: 'Squad HabariPay', category: 'USSD & Virtual Accounts', region: 'Nigeria GTCO Network', currency: 'NGN USSD & Cards', status: 'Operational', ping: '205ms', code: 'SQD' },
  { name: 'Interswitch Switch', category: 'National Card Switch', region: 'Nigeria & West Africa', currency: 'Verve, NGN Direct Switch', status: 'Operational', ping: '240ms', code: 'ISW' },
  { name: 'MTN MoMo Rail', category: 'Mobile Money', region: 'Uganda · Ghana · Ivory Coast', currency: 'UGX, GHS, XOF Instant', status: 'Operational', ping: '220ms', code: 'MOMO' },
  { name: 'Airtel Money Rail', category: 'Mobile Money', region: 'East & Central Africa', currency: 'KES, RWF, TZS MoMo', status: 'Operational', ping: '215ms', code: 'ARTL' },
]

// Engineering & Philosophy Pillars (Accurate Product Architecture)
const ARCHITECTURE_PILLARS = [
  {
    number: '01',
    badge: 'Standardization',
    title: 'Unified Multi-Rail Interface',
    description: 'A single normalized schema across card processors, bank transfer rails, virtual accounts, USSD, and mobile money networks.',
  },
  {
    number: '02',
    badge: 'Security',
    title: 'Zero Vendor Lock-In & Key Vaulting',
    description: 'Bring your own negotiated merchant rates. Keys remain securely vaulted in AES-256-GCM hardware security enclaves.',
  },
  {
    number: '03',
    badge: 'Reliability',
    title: 'Dynamic Failover Strategy',
    description: 'Continuous out-of-band health probing detects upstream network degradations and shifts payment sessions to healthy alternate rails.',
  },
  {
    number: '04',
    badge: 'Consistency',
    title: 'Deterministic Idempotency',
    description: 'Cryptographic request deduplication guarantees zero double-charge anomalies across unpredictable telecom and banking switches.',
  },
  {
    number: '05',
    badge: 'Integration',
    title: 'Normalized Webhook Envelopes',
    description: 'One standard webhook structure for all transaction events, complete with verified HMAC-SHA256 signature signatures.',
  },
  {
    number: '06',
    badge: 'Architecture',
    title: 'Multi-Currency Foundation',
    description: 'Double-entry cryptographic ledger design supporting clean multi-currency accounts across NGN, KES, GHS, and USD.',
  },
]

// FAQ Items (Concrete Technical Explanations)
const FAQ_ITEMS = [
  {
    q: 'How does Quirk unify multiple payment providers into one API?',
    a: 'Quirk provides a normalized abstraction layer over African payment gateways (Paystack, Flutterwave, Monnify, Squad, M-Pesa). Instead of integrating separate SDKs with divergent request payloads and webhook structures, you use one SDK (@quirk/sdk) with standard charge, verify, and event schemas.',
  },
  {
    q: 'Can I bring my existing merchant accounts and direct rates?',
    a: 'Yes. Quirk is designed with zero vendor lock-in. You vault your existing provider credentials (e.g. Paystack secret key, Flutterwave secret key, M-Pesa passkey) in Quirk’s AES-256-GCM hardware security vaults and retain your direct contractual rates.',
  },
  {
    q: 'How does the dynamic failover routing work?',
    a: 'Quirk continuously measures upstream gateway latency, TCP handshake times, and HTTP 5xx error distribution. If a provider experiences downtime or elevated latency (>350ms), transactions automatically route to your configured fallback rails in under 200ms.',
  },
  {
    q: 'What languages and environments are supported?',
    a: 'Official SDKs are available for Node.js/TypeScript (@quirk/sdk), Go, and Python, alongside standard REST API endpoints accessible via any HTTP client or cURL.',
  },
  {
    q: 'How are webhooks handled and verified?',
    a: 'Quirk delivers unified webhook events across all payment methods. Every webhook delivery includes an HMAC-SHA256 signature in the X-Quirk-Signature header, with automatic retry schedules and idempotency validation.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [selectedLang, setSelectedLang] = useState<'node' | 'go' | 'python' | 'curl'>('node')
  const [terminalTab, setTerminalTab] = useState<'code' | 'response'>('code')
  const [isSimulatingCall, setIsSimulatingCall] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeSection, setActiveSection] = useState<string>('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['architecture', 'rails', 'developer', 'insights', 'pricing', 'faq']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm install @quirk/sdk')
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const handleSimulateCall = () => {
    setIsSimulatingCall(true)
    setTimeout(() => {
      setIsSimulatingCall(false)
      setTerminalTab('response')
    }, 450)
  }

  const handleAssistantAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    setIsChatLoading(true)
    setChatResponse(null)
    setTimeout(() => {
      setIsChatLoading(false)
      const q = chatMessage.toLowerCase()
      if (q.includes('failover') || q.includes('latency') || q.includes('routing')) {
        setChatResponse("Quirk evaluates gateway health out-of-band. If p95 latency exceeds 350ms or 5xx errors occur, transactions dynamically shift to healthy alternate rails in under 200ms.")
      } else if (q.includes('currency') || q.includes('multi') || q.includes('ledger')) {
        setChatResponse("Quirk provides a normalized multi-currency ledger foundation for NGN, KES, GHS, and USD with immutable idempotency hashes.")
      } else if (q.includes('key') || q.includes('vault') || q.includes('security')) {
        setChatResponse("Provider API keys remain vaulted in AES-256-GCM hardware security modules. Decryption occurs only in ephemeral in-memory worker threads during routing.")
      } else {
        setChatResponse("Quirk standardizes African payment infrastructure across Paystack, Flutterwave, Monnify, Squad, and M-Pesa into a single unified SDK and API interface.")
      }
    }, 500)
  }

  const commandItems = [
    { title: 'Core Architecture & Pillars', section: '#architecture', category: 'Architecture' },
    { title: 'Supported Payment Rails', section: '#rails', category: 'Infrastructure' },
    { title: 'Developer SDK & Playground', section: '#developer', category: 'SDK' },
    { title: 'Engineering Insights & Research', section: '#insights', category: 'Research' },
    { title: 'Developer Infrastructure Pricing', section: '#pricing', category: 'Pricing' },
    { title: 'Frequently Asked Questions', section: '#faq', category: 'Documentation' },
    { title: 'GitHub Repository', url: 'https://github.com/T9ner/quirk', category: 'Open Source', external: true },
  ]

  const filteredCommands = commandItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const codeSnippets = {
    node: `import { Quirk } from '@quirk/sdk';

const quirk = new Quirk(process.env.QUIRK_SECRET_KEY);

// Create a normalized charge across optimal African rails
const charge = await quirk.charges.create({
  amount: 2500000, // ₦25,000.00
  currency: 'NGN',
  customer: {
    email: 'alex@company.dev',
    name: 'Alex Okafor'
  },
  routing: {
    strategy: 'auto_fallback',
    allowedRails: ['paystack', 'flutterwave', 'monnify', 'squad']
  }
});

console.log(\`Routed via: \${charge.routedRail} (Latency: \${charge.latencyMs}ms)\`);`,

    go: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/T9ner/quirk-go/quirk"
)

func main() {
	client := quirk.NewClient(os.Getenv("QUIRK_SECRET_KEY"))

	charge, err := client.Charges.Create(context.Background(), &quirk.ChargeParams{
		Amount:   2500000, // ₦25,000.00
		Currency: "NGN",
		Customer: quirk.CustomerParams{Email: "alex@company.dev"},
		Routing:  quirk.RoutingConfig{Strategy: quirk.StrategyAutoFallback},
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Routed: %s | Latency: %dms\\n", charge.RoutedRail, charge.LatencyMs)
}`,

    python: `from quirk import Quirk
import os

client = Quirk(api_key=os.environ.get("QUIRK_SECRET_KEY"))

# Normalized multi-rail charge creation
charge = client.charges.create(
    amount=2500000,  # ₦25,000.00
    currency="NGN",
    customer={"email": "alex@company.dev"},
    routing={"strategy": "auto_fallback"}
)

print(f"Routed via {charge.routed_rail} ({charge.latency_ms}ms)")`,

    curl: `curl -X POST https://api.quirk.dev/v1/charges \\
  -H "Authorization: Bearer qrk_live_sec_89f210a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500000,
    "currency": "NGN",
    "customer": { "email": "alex@company.dev" },
    "routing": { "strategy": "auto_fallback" }
  }'`,
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['Inter'] selection:bg-[#FFFFFF] selection:text-[#000000] antialiased overflow-x-hidden">
      {/* Background Graphic Lines & Nodes (Quirk Brand Motifs: Connections, Nodes, Routing) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Subtle top ambient vignette */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#111111]/40 to-transparent pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* COMMAND PALETTE MODAL (Cmd+K / Ctrl+K) */}
      {/* ========================================================================= */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#000000]/80 backdrop-blur-md animate-in fade-in duration-150 ease-out"
          onClick={() => setCommandPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command search"
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#101010] border border-[#222222] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#222222] bg-[#141414]">
              <Search className="size-4 text-[#A9A9A9] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search architecture, payment rails, SDK, or docs..."
                className="w-full bg-transparent text-sm text-[#FFFFFF] placeholder:text-[#A9A9A9]/60 focus:outline-none font-['Inter']"
              />
              <kbd className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#101010] border border-[#222222] text-[#A9A9A9]">
                ESC
              </kbd>
            </div>

            {/* Filtered Commands List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#A9A9A9] font-['JetBrains_Mono']">
                  No matching items found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCommandPaletteOpen(false)
                      if (cmd.url) {
                        window.open(cmd.url, '_blank')
                      } else if (cmd.section) {
                        const el = document.querySelector(cmd.section)
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left hover:bg-[#161616] group transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#A9A9A9] font-['JetBrains_Mono'] uppercase tracking-wider group-hover:text-[#FFFFFF]">
                        {cmd.category}
                      </span>
                      <span className="text-sm font-medium text-[#FFFFFF]">{cmd.title}</span>
                    </div>
                    {cmd.external ? (
                      <ArrowUpRight className="size-3.5 text-[#A9A9A9] group-hover:text-[#FFFFFF] transition-transform" />
                    ) : (
                      <ArrowRight className="size-3.5 text-[#A9A9A9] group-hover:text-[#FFFFFF] transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-[#222222] bg-[#141414] flex items-center justify-between text-[11px] text-[#A9A9A9] font-['JetBrains_Mono']">
              <span>Quick Navigation</span>
              <span className="text-[#FFFFFF] font-medium">Quirk Infrastructure</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING PILL NAVBAR (Minimal, Developer Infrastructure Standard) */}
      {/* ========================================================================= */}
      <header className="fixed top-5 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className="max-w-3xl mx-auto flex items-center justify-between px-5 sm:px-6 py-2.5 rounded-full bg-[#101010]/90 backdrop-blur-xl border border-[#222222] shadow-[0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto transition-all"
        >
          {/* Logo on Left */}
          <Link
            to="/"
            className="cursor-pointer flex items-center gap-2 pl-1 pr-3 py-1 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] transition-opacity hover:opacity-90"
            aria-label="Quirk Home"
          >
            <QuirkLogo size={22} lightMode={false} />
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-[#A9A9A9]">
            {[
              { id: 'architecture', label: 'Architecture' },
              { id: 'rails', label: 'Rails' },
              { id: 'developer', label: 'SDK & API' },
              { id: 'insights', label: 'Research' },
            ].map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`py-1.5 transition-colors duration-150 relative ${
                    isActive
                      ? 'text-[#FFFFFF] font-semibold'
                      : 'hover:text-[#FFFFFF]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-[#FFFFFF]" />
                  )}
                </a>
              )
            })}
          </div>

          {/* Right Action: Explore the API (No Auth UI) */}
          <div className="flex items-center gap-3">
            <a
              href="#developer"
              className="inline-flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] shadow-sm"
            >
              <span>Explore the API</span>
              <ArrowRight className="size-3" />
            </a>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 text-[#A9A9A9] hover:text-[#FFFFFF] min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] rounded-full hover:bg-[#161616]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden max-w-3xl mx-auto mt-2 p-5 rounded-2xl bg-[#101010] border border-[#222222] shadow-2xl space-y-1.5 pointer-events-auto animate-in slide-in-from-top-2 duration-150">
            {[
              { id: 'architecture', label: 'Architecture' },
              { id: 'rails', label: 'Supported Rails' },
              { id: 'developer', label: 'Developer SDK & API' },
              { id: 'insights', label: 'Engineering Research' },
              { id: 'pricing', label: 'Developer Pricing' },
              { id: 'faq', label: 'FAQ' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-2.5 px-3 rounded-xl min-h-[44px] flex items-center justify-between transition-colors ${
                  activeSection === item.id
                    ? 'text-[#FFFFFF] bg-[#161616] font-semibold'
                    : 'text-[#A9A9A9] hover:text-[#FFFFFF] hover:bg-[#161616]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="size-4 text-[#A9A9A9]" />
              </a>
            ))}
            <div className="pt-3 border-t border-[#222222] flex flex-col gap-2">
              <a
                href="#developer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs font-semibold text-[#000000] py-3 bg-[#FFFFFF] hover:bg-[#E5E5E5] rounded-full min-h-[44px] flex items-center justify-center transition-colors"
              >
                Explore the API
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION (Authentic Quirk Brand: "One connection. Every payment system.") */}
      {/* ========================================================================= */}
      <section className="relative pt-36 sm:pt-48 pb-20 sm:pb-28 px-4 sm:px-6 max-w-5xl mx-auto text-center z-10">
        {/* Editorial Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#222222] mb-8">
          <span className="size-1.5 rounded-full bg-[#22C55E]" />
          <span className="font-['JetBrains_Mono'] text-[11px] font-medium tracking-wider text-[#A9A9A9] uppercase">
            Developer-First Infrastructure
          </span>
        </div>

        {/* Confident Headline from quirk.jpg Brand Guidelines */}
        <h1 className="font-['Satoshi'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#FFFFFF] leading-[1.04] mb-6">
          One connection.<br />Every payment system.
        </h1>

        {/* Clear, Honest Infrastructure Subtitle */}
        <p className="text-base sm:text-xl text-[#A9A9A9] leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          A unified developer foundation for African payments. Connect, route, and normalize transactions across multiple payment providers with a single API and SDK.
        </p>

        {/* Action Row — Developer & Infrastructure Focused */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <a
            href="#developer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] shadow-sm"
          >
            <span>Explore the API</span>
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#architecture"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#101010] hover:bg-[#161616] border border-[#222222] text-[#FFFFFF] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
          >
            <Code2 className="size-4 text-[#A9A9A9]" />
            <span>Read Architecture</span>
          </a>
        </div>

        {/* Terminal Install Snippet */}
        <div className="inline-flex items-center gap-3 bg-[#101010] border border-[#222222] rounded-full px-4 py-2 text-xs font-['JetBrains_Mono'] text-[#A9A9A9]">
          <span className="text-[#FFFFFF] font-bold">$</span>
          <span className="text-[#FFFFFF]">npm install @quirk/sdk</span>
          <button
            onClick={copyInstallCommand}
            className="p-1 hover:text-[#FFFFFF] transition-colors ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] rounded"
            aria-label="Copy install command"
          >
            {copiedInstall ? <Check className="size-3.5 text-[#22C55E]" /> : <Copy className="size-3.5" />}
          </button>
        </div>

        {/* Subtle Brand Routing Graphics (from quirk.jpg Brand Language) */}
        <div className="mt-14 max-w-2xl mx-auto opacity-30 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 600 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 35H600" stroke="#222222" strokeWidth="1" />
            <path d="M0 35C150 35 150 15 300 15C450 15 450 55 600 55" stroke="#333333" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M0 35C150 35 150 55 300 55C450 55 450 15 600 15" stroke="#2A2A2A" strokeWidth="1" />
            <circle cx="150" cy="35" r="2.5" fill="#666666" />
            <circle cx="300" cy="15" r="3" fill="#FFFFFF" />
            <circle cx="450" cy="55" r="3" fill="#888888" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INFINITE MARQUEE RAIL TICKER (Continuous Rolling African Rails Loop) */}
      {/* ========================================================================= */}
      <section className="py-5 border-y border-[#222222] bg-[#0A0A0A] overflow-hidden relative" aria-label="Supported payment rails">
        {/* Left & Right ambient fade masks for seamless entrance & exit */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#000000] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#000000] to-transparent z-10" />

        <div className="quirk-marquee-track items-center gap-8 text-xs font-['JetBrains_Mono'] text-[#A9A9A9]">
          {[...ECOSYSTEM_RAILS, ...ECOSYSTEM_RAILS].map((rail, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#222222] hover:border-[#333333] transition-colors"
            >
              <span className="size-1.5 rounded-full bg-[#22C55E]" />
              <span className="font-semibold text-[#FFFFFF] tracking-tight">{rail.name}</span>
              <span className="text-[#A9A9A9]/40">·</span>
              <span className="text-[#A9A9A9]">{rail.region}</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#161616] border border-[#262626] text-[#A9A9A9]">
                {rail.ping}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORE ARCHITECTURE & PROBLEM SOLVING (Honest Engineering Foundations) */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase mb-3 block">
            Architecture
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
            Built for payment complexity.
          </h2>
          <p className="text-sm text-[#A9A9A9] leading-relaxed">
            African digital commerce is fragmented across divergent banking switches, card networks, and telecom telcos. Quirk unifies these rails into a reliable, single-interface payment infrastructure.
          </p>
        </div>

        {/* 6 Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARCHITECTURE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#A9A9A9] mb-6">
                  <span className="text-[#FFFFFF] font-semibold tracking-wider uppercase text-[10px]">{pillar.badge}</span>
                  <span className="text-[#A9A9A9]/50 font-bold">{pillar.number}</span>
                </div>
                <h3 className="font-['Satoshi'] text-xl font-bold text-[#FFFFFF] mb-3 group-hover:text-[#FFFFFF] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#A9A9A9] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE QUIRK NETWORK (Supported Rails Ecosystem) */}
      {/* ========================================================================= */}
      <section id="rails" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#222222]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase mb-3 block">
            Payment Rails
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
            Unified access across African rails.
          </h2>
          <p className="text-sm text-[#A9A9A9] leading-relaxed">
            Integrate once to route across major card processors, instant virtual accounts, USSD, and mobile money networks.
          </p>
        </div>

        {/* Network Rails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_RAILS.map((rail, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#FFFFFF]">{rail.code}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]">
                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                    {rail.ping}
                  </span>
                </div>
                <h3 className="font-['Satoshi'] font-bold text-sm text-[#FFFFFF] mb-1">{rail.name}</h3>
                <p className="text-xs text-[#A9A9A9] mb-2">{rail.category}</p>
                <p className="text-[11px] text-[#A9A9A9]/70">{rail.region}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#222222] text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]/80">
                {rail.currency}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEVELOPER PLAYGROUND & SDK CONSOLE */}
      {/* ========================================================================= */}
      <section id="developer" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#222222]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase block">
              Developer Foundation
            </span>
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]">
              One SDK. Complete payment control.
            </h2>
            <p className="text-sm text-[#A9A9A9] leading-relaxed">
              Install the official library in your preferred language. Configure your vaulted merchant keys and let Quirk handle routing, fallbacks, and webhook verification.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#FFFFFF]">
                <Check className="size-4 text-[#FFFFFF]" />
                <span>Zero vendor lock-in — direct vaulted keys</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#FFFFFF]">
                <Check className="size-4 text-[#FFFFFF]" />
                <span>Deterministic idempotency across all charges</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#FFFFFF]">
                <Check className="size-4 text-[#FFFFFF]" />
                <span>Unified webhooks with verified HMAC signatures</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={handleSimulateCall}
                disabled={isSimulatingCall}
                className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs px-5 py-3 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
              >
                {isSimulatingCall ? (
                  <RefreshCw className="size-3.5 animate-spin text-[#000000]" />
                ) : (
                  <Play className="size-3.5 text-[#000000]" />
                )}
                <span>Simulate live API request</span>
              </button>
              <a
                href="https://github.com/T9ner/quirk"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#101010] hover:bg-[#161616] border border-[#222222] text-[#FFFFFF] font-medium text-xs px-4 py-3 rounded-full transition-colors min-h-[44px]"
              >
                <span>GitHub</span>
                <ArrowUpRight className="size-3.5 text-[#A9A9A9]" />
              </a>
            </div>
          </div>

          {/* Right: Code Console */}
          <div className="lg:col-span-7 rounded-2xl bg-[#101010] border border-[#222222] overflow-hidden shadow-2xl">
            {/* Header Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222222] bg-[#141414]">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#333333]" />
                <div className="size-2 rounded-full bg-[#333333]" />
                <div className="size-2 rounded-full bg-[#333333]" />
                <span className="text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] ml-2">SDK Playground</span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-lg border border-[#222222]" role="tablist" aria-label="Programming languages">
                {(['node', 'go', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    role="tab"
                    aria-selected={selectedLang === lang}
                    onClick={() => {
                      setSelectedLang(lang)
                      setTerminalTab('code')
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-['JetBrains_Mono'] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] ${
                      selectedLang === lang ? 'bg-[#1C1C1C] text-[#FFFFFF] font-semibold' : 'text-[#A9A9A9] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {lang === 'node' ? 'Node.js' : lang === 'go' ? 'Go' : lang === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 font-['JetBrains_Mono'] text-xs text-[#FFFFFF] overflow-x-auto leading-relaxed min-h-[300px]">
              {terminalTab === 'code' ? (
                <pre>{codeSnippets[selectedLang]}</pre>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-[#A9A9A9] font-semibold mb-2 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                    <span>HTTP 200 OK · 174ms Response</span>
                  </div>
                  <pre className="text-[#FFFFFF]">
{`{
  "status": "success",
  "data": {
    "id": "qrk_chg_7829104",
    "amount": 2500000,
    "currency": "NGN",
    "status": "authorized",
    "routedRail": "paystack",
    "latencyMs": 174,
    "customer": {
      "email": "alex@company.dev"
    },
    "createdAt": "${new Date().toISOString()}"
  }
}`}
                  </pre>
                </div>
              )}
            </div>

            {/* Console Footer */}
            <div className="px-6 py-2.5 border-t border-[#222222] bg-[#141414] flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]">
              <span>SDK: @quirk/sdk</span>
              <button
                onClick={() => setTerminalTab(terminalTab === 'code' ? 'response' : 'code')}
                className="hover:text-[#FFFFFF] text-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] rounded py-0.5"
              >
                {terminalTab === 'code' ? 'View Sample Response →' : '← Back to Code'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ARCHITECTURE QUERY CONSOLE */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#222222]">
        <div className="rounded-3xl bg-[#101010] border border-[#222222] p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#222222] text-xs font-['JetBrains_Mono'] text-[#FFFFFF]">
                <Terminal className="size-3.5" />
                <span>Architecture Explorer</span>
              </div>
              <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]">
                Explore payment routing and failover logic.
              </h2>
              <p className="text-xs sm:text-sm text-[#A9A9A9] leading-relaxed">
                Understand how Quirk evaluates gateway ping times, routes across multi-currency ledgers, and handles bank outages.
              </p>

              {/* Sample Queries */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setChatMessage('How does sub-200ms failover work?')
                  }}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#A9A9A9] hover:text-[#FFFFFF] hover:border-[#333333] transition-colors"
                >
                  "How does sub-200ms failover work?"
                </button>
                <button
                  onClick={() => {
                    setChatMessage('How are merchant provider keys secured?')
                  }}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-[#A9A9A9] hover:text-[#FFFFFF] hover:border-[#333333] transition-colors"
                >
                  "How are merchant provider keys secured?"
                </button>
              </div>
            </div>

            {/* Right Chat Sandbox */}
            <div className="lg:col-span-7 rounded-2xl bg-[#0A0A0A] border border-[#222222] p-6 flex flex-col justify-between min-h-[320px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#222222] pb-3 text-xs font-['JetBrains_Mono'] text-[#A9A9A9]">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#22C55E]" />
                    <span>Quirk Architecture Console</span>
                  </div>
                  <span>Operational</span>
                </div>

                <div className="p-4 rounded-xl bg-[#101010] border border-[#222222] text-xs text-[#FFFFFF] leading-relaxed">
                  {isChatLoading ? (
                    <div className="flex items-center gap-2 text-[#A9A9A9]">
                      <RefreshCw className="size-3.5 animate-spin text-[#FFFFFF]" />
                      <span>Evaluating routing graph...</span>
                    </div>
                  ) : chatResponse ? (
                    <div>{chatResponse}</div>
                  ) : (
                    <div className="text-[#A9A9A9]">
                      Ask any question about Quirk's payment architecture, gateway failover algorithms, or SDK integration.
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAssistantAsk} className="pt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask about failover, key vaulting, or the SDK..."
                  className="w-full bg-[#101010] border border-[#222222] rounded-full px-4 py-2.5 text-xs text-[#FFFFFF] placeholder:text-[#A9A9A9]/60 focus:outline-none focus:border-[#444444]"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatMessage.trim()}
                  className="p-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] disabled:opacity-50 transition-all shrink-0"
                  aria-label="Send query"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STRATEGIC RESEARCH INSIGHTS (Editorial Cards linking to Detail Pages) */}
      {/* ========================================================================= */}
      <section id="insights" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#222222]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase mb-3 block">
              Engineering Research
            </span>
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF]">
              Technical deep dives.
            </h2>
          </div>
          <a
            href="https://github.com/T9ner/quirk"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-[#A9A9A9] hover:text-[#FFFFFF] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] rounded p-1"
          >
            <span>Explore repository</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        {/* 3 Clickable Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {INSIGHTS_ARTICLES.map((post, idx) => (
            <Link
              key={idx}
              to={`/insights/${post.slug}`}
              className="p-8 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] hover:bg-[#141414] transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] mb-4">
                  <span className="text-[#FFFFFF] uppercase font-semibold text-[10px]">{post.tag}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-['Satoshi'] text-base font-bold text-[#FFFFFF] mb-3 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-[#A9A9A9] leading-relaxed mb-6 group-hover:text-[#FFFFFF]/90 transition-colors">
                  {post.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] group-hover:text-[#FFFFFF]">
                <span>{post.author}</span>
                <span className="flex items-center gap-1 text-[#FFFFFF]">
                  <span>{post.readTime}</span>
                  <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DEVELOPER INFRASTRUCTURE PRICING (No Auth CTAs) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#222222]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase mb-3 block">
            Infrastructure Pricing
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] mb-4">
            Transparent developer pricing.
          </h2>
          <p className="text-sm text-[#A9A9A9] leading-relaxed">
            No hidden markups. Bring your direct merchant negotiated rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Developer Tier */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#101010] border border-[#222222] flex flex-col justify-between">
            <div>
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#A9A9A9] font-semibold mb-2 block">
                Developer Tier
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Satoshi'] text-4xl font-bold text-[#FFFFFF]">0.15%</span>
                <span className="text-xs text-[#A9A9A9]">/ routed transaction</span>
              </div>
              <p className="text-xs text-[#A9A9A9] leading-relaxed mb-6">
                For developers and engineering teams standardizing payment rails without managing multiple provider SDKs.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#FFFFFF]">
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Unlimited fallback routing rules</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Direct key vaulting (Bring your own keys)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Real-time webhook dispatcher</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Community GitHub & Discord support</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="#developer"
                className="w-full py-3 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#222222] text-center text-xs font-semibold text-[#FFFFFF] block transition-all active:scale-[0.97] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
              >
                Explore the API
              </a>
            </div>
          </div>

          {/* Enterprise Volume Tier */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#101010] border border-[#333333] flex flex-col justify-between relative shadow-xl">
            <div className="absolute top-5 right-5 text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider bg-[#FFFFFF] text-[#000000] font-bold px-3 py-0.5 rounded-full">
              Enterprise
            </div>
            <div>
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#A9A9A9] font-semibold mb-2 block">
                Custom Volume
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Satoshi'] text-4xl font-bold text-[#FFFFFF]">Custom</span>
                <span className="text-xs text-[#A9A9A9]">volume pricing</span>
              </div>
              <p className="text-xs text-[#A9A9A9] leading-relaxed mb-6">
                For high-volume merchants and platforms requiring dedicated routing clusters and custom SLAs.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#FFFFFF]">
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Dedicated routing cluster & SLA guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Custom private banking switches</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Direct engineering Slack channel</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#FFFFFF]" />
                  <span>Multi-currency treasury support</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="mailto:engineering@quirk.dev"
                className="w-full py-3 rounded-full bg-[#FFFFFF] hover:bg-[#E5E5E5] text-center text-xs font-semibold text-[#000000] block transition-all active:scale-[0.97] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#222222]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-['JetBrains_Mono'] font-medium tracking-widest text-[#A9A9A9] uppercase mb-3 block">
            Documentation & FAQ
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#101010] border border-[#222222] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-['Satoshi'] font-semibold text-sm text-[#FFFFFF] flex items-center justify-between gap-4 hover:text-[#FFFFFF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF] min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#A9A9A9] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FFFFFF]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#A9A9A9] leading-relaxed border-t border-[#222222] pt-4 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CLEAN BRAND-ALIGNED FINAL CTA */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#222222]">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center border border-[#222222] bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-['Satoshi'] text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] leading-[1.1]">
              Build on reliable payment infrastructure.
            </h2>
            <p className="text-sm sm:text-base text-[#A9A9A9] max-w-xl mx-auto leading-relaxed font-normal">
              Explore the developer SDK, test multi-provider routing in the playground, and deploy unified payment infrastructure.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#developer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.97] shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
              >
                <span>Explore the API</span>
                <ArrowRight className="size-4" />
              </a>
              <a
                href="mailto:engineering@quirk.dev"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#161616] hover:bg-[#202020] border border-[#222222] text-[#FFFFFF] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.97]"
              >
                <span>Talk to us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER (Minimal Infrastructure Standard) */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#222222] bg-[#000000] pt-16 pb-12 text-xs text-[#A9A9A9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <QuirkLogo size={24} lightMode={false} />
              <p className="text-xs text-[#A9A9A9] max-w-sm leading-relaxed">
                One connection. Every payment system. Developer-first payment infrastructure for Africa.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-['JetBrains_Mono'] text-[#FFFFFF]">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                <span>All payment rails operational</span>
              </div>
            </div>

            {/* Infrastructure Links */}
            <div>
              <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
                Architecture
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#architecture" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Pillars
                  </a>
                </li>
                <li>
                  <a href="#rails" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Supported Rails
                  </a>
                </li>
                <li>
                  <a href="#developer" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Multi-Rail Routing
                  </a>
                </li>
              </ul>
            </div>

            {/* Developer Links */}
            <div>
              <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
                Developers
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#developer" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Node.js SDK
                  </a>
                </li>
                <li>
                  <a href="#developer" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Go Client
                  </a>
                </li>
                <li>
                  <a href="#developer" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Python Package
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/T9ner/quirk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FFFFFF] transition-colors inline-flex items-center gap-1 py-0.5"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources / Legal */}
            <div>
              <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#FFFFFF] uppercase tracking-wider mb-4">
                Resources
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#insights" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Research Articles
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Documentation FAQ
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#FFFFFF] transition-colors py-0.5 inline-block">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>© {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.</div>
            <div className="font-['JetBrains_Mono'] text-[#A9A9A9]">
              Developer-first payment infrastructure
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
