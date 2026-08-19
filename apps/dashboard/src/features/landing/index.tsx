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
  AlertTriangle,
  Play,
  Share2,
  Shield,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Radio,
  Clock,
  Calendar,
  MessageSquare,
  Bot,
  Send,
} from 'lucide-react'
import { QuirkLogo } from '@/components/quirk-logo'
import { useTheme } from '@/context/theme-provider'
import { auth as apiAuth } from '@/lib/api'
import { INSIGHTS_ARTICLES } from '@/features/insights/insights-data'

// Supported payment rails & ecosystem partners (Primora Ecosystem Grid Style)
const ECOSYSTEM_RAILS = [
  { name: 'Paystack Direct', category: 'Cards & Bank', region: 'Nigeria · Ghana · Kenya · SA', currency: 'NGN, GHS, KES, ZAR', status: 'Optimal', ping: '185ms', code: 'PSTK' },
  { name: 'Flutterwave Switch', category: 'Pan-African & Global', region: '34 African Countries + Global', currency: 'USD, NGN, KES, GHS', status: 'Optimal', ping: '210ms', code: 'FLW' },
  { name: 'M-Pesa Express', category: 'Mobile Money', region: 'Kenya · Tanzania · Global', currency: 'KES, TZS Direct Push', status: 'Optimal', ping: '140ms', code: 'MPESA' },
  { name: 'Monnify Dynamic VA', category: 'Virtual Accounts', region: 'Nigeria Instant Clearing', currency: 'NGN Dynamic Accounts', status: 'Optimal', ping: '195ms', code: 'MNFY' },
  { name: 'Squad HabariPay', category: 'USSD & Virtual Bank', region: 'Nigeria GTCO Network', currency: 'NGN USSD & Cards', status: 'Optimal', ping: '205ms', code: 'SQD' },
  { name: 'Interswitch Switch', category: 'National Switch', region: 'Nigeria & West Africa', currency: 'Verve, NGN Direct Switch', status: 'Optimal', ping: '240ms', code: 'ISW' },
  { name: 'MTN MoMo Rail', category: 'Mobile Money', region: 'Uganda · Ghana · Ivory Coast', currency: 'UGX, GHS, XOF Instant', status: 'Optimal', ping: '220ms', code: 'MOMO' },
  { name: 'Airtel Money Rail', category: 'Mobile Money', region: 'East & Central Africa', currency: 'KES, RWF, TZS MoMo', status: 'Optimal', ping: '215ms', code: 'ARTL' },
]

// FAQ Items
const FAQ_ITEMS = [
  {
    q: 'How does Quirk’s autonomous rail failover operate in production?',
    a: 'Quirk continuously monitors provider health, gateway latency, and bank settlement error rates. If a transaction attempts a rail with latency >300ms or 5xx dropouts, Quirk automatically re-routes the session to the fastest healthy alternate rail in under 190ms without dropping the active checkout modal.',
  },
  {
    q: 'Can I vault my existing Paystack, Flutterwave, or M-Pesa merchant keys?',
    a: 'Yes. You can choose Direct Vaulted Mode (where your own provider keys are secured in Quirk’s AES-256-GCM hardware vaults) or use Quirk Managed Treasury for automated payout reconciliations into a single unified ledger.',
  },
  {
    q: 'How does Quirk reconcile multi-currency balances across African rails?',
    a: 'Quirk provides a Unified Multi-Currency Ledger. Payments collected in NGN (via Paystack/Monnify), KES (via M-Pesa), and USD (via Flutterwave) settle in real time into their respective pots with automated single-batch payouts.',
  },
  {
    q: 'What is the developer integration overhead?',
    a: 'Instead of managing 5 separate SDKs, diverging webhooks, and manual reconciliation scripts, you install one SDK (`@quirk/sdk`), configure one webhook endpoint, and deploy with 5 lines of clean code.',
  },
]

// Engineering & Philosophy Pillars (Primora "Who we work with" 6-card pattern)
const PHILOSOPHY_PILLARS = [
  {
    number: '01',
    badge: 'Core Problem',
    title: 'Solving fragmented routing',
    description: 'We build for engineering teams solving real checkout drop-offs across Africa’s complex banking switches and telecom networks.',
  },
  {
    number: '02',
    badge: 'Resilience',
    title: 'Sub-200ms failover',
    description: 'Autonomous health probing detects network degradations and shifts payment sessions before customers encounter an error.',
  },
  {
    number: '03',
    badge: 'Consistency',
    title: 'Deterministic clearing',
    description: 'Every charge, webhook, and bank reconciliation adheres to strict double-entry ledger invariants with zero double-spend anomalies.',
  },
  {
    number: '04',
    badge: 'Architecture',
    title: 'Building with intent',
    description: 'Unified multi-currency pots for NGN, KES, GHS, and USD designed from first principles for cross-border African commerce.',
  },
  {
    number: '05',
    badge: 'Independence',
    title: 'Zero vendor lock-in',
    description: 'Bring your direct negotiated rates. Keys remain securely vaulted in client-isolated AES-256-GCM hardware security enclaves.',
  },
  {
    number: '06',
    badge: 'Scale',
    title: 'Endurance under peak load',
    description: 'Built to sustain intense flash sales, payday volume spikes, and high-frequency micropayment streams without queue backlog.',
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
  const [simulatedScenario, setSimulatedScenario] = useState<'normal' | 'paystack_latency' | 'bank_switch_down'>('normal')
  const [checkoutCurrency, setCheckoutCurrency] = useState<'NGN' | 'KES' | 'USD'>('NGN')
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'card' | 'transfer' | 'mpesa'>('card')
  const [checkoutState, setCheckoutState] = useState<'idle' | 'processing' | 'success'>('idle')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeSection, setActiveSection] = useState<string>('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsAuthenticated(apiAuth.isAuthenticated())

    const handleScroll = () => {
      const sections = ['framework', 'impact', 'architecture', 'rails', 'developer', 'insights', 'pricing']
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

  const handleCheckoutPay = () => {
    setCheckoutState('processing')
    setTimeout(() => {
      setCheckoutState('success')
      setTimeout(() => setCheckoutState('idle'), 3500)
    }, 1200)
  }

  const handleAssistantAsk = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    setIsChatLoading(true)
    setChatResponse(null)
    setTimeout(() => {
      setIsChatLoading(false)
      if (chatMessage.toLowerCase().includes('failover') || chatMessage.toLowerCase().includes('latency')) {
        setChatResponse("Quirk evaluates upstream latency every 1,500ms. If p95 latency exceeds 350ms on Paystack, transactions shift to Flutterwave or Monnify in <180ms.")
      } else if (chatMessage.toLowerCase().includes('currency') || chatMessage.toLowerCase().includes('multi')) {
        setChatResponse("Quirk supports unified multi-currency ledgers across NGN, KES, GHS, ZAR, and USD with automated batch settlement sweeps.")
      } else {
        setChatResponse("Quirk provides one unified SDK (@quirk/sdk) that dynamically routes charges across African bank rails, card switches, and mobile money.")
      }
    }, 600)
  }

  const commandItems = [
    { title: 'Quirk Routing OS Architecture', section: '#framework', category: 'Interface' },
    { title: 'Autonomous Multi-Rail Failover', section: '#architecture', category: 'Engineering' },
    { title: 'Performance Metrics & Scale', section: '#impact', category: 'Impact' },
    { title: 'Supported African Payment Rails', section: '#rails', category: 'Infrastructure' },
    { title: 'Multi-Language SDK Playground', section: '#developer', category: 'Developers' },
    { title: 'Engineering Insights & Research', section: '#insights', category: 'Research' },
    { title: 'Transparent Volume Pricing', section: '#pricing', category: 'Pricing' },
    { title: 'Merchant Sign In', url: '/sign-in', category: 'Account' },
    { title: 'Create Production API Keys', url: '/sign-up', category: 'Account' },
    { title: 'Merchant Dashboard', url: '/dashboard', category: 'App' },
  ]

  const filteredCommands = commandItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const codeSnippets = {
    node: `import { Quirk } from '@quirk/sdk';

const quirk = new Quirk(process.env.QUIRK_SECRET_KEY);

// Autonomous payment routing across optimal African rail
const charge = await quirk.charges.create({
  amount: 2500000, // ₦25,000.00
  currency: 'NGN',
  customer: {
    email: 'amara@company.dev',
    name: 'Amara Chen'
  },
  routing: {
    strategy: 'auto_fallback',
    prioritize: 'lowest_latency', // Dynamic health-scoring
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
		Customer: quirk.CustomerParams{Email: "amara@company.dev"},
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

charge = client.charges.create(
    amount=2500000,  # ₦25,000.00
    currency="NGN",
    customer={"email": "amara@company.dev"},
    routing={"strategy": "auto_fallback", "prioritize": "lowest_latency"}
)

print(f"Routed via {charge.routed_rail} ({charge.latency_ms}ms)")`,

    curl: `curl -X POST https://api.quirk.dev/v1/charges \\
  -H "Authorization: Bearer qrk_live_9f21a8d00c3b" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500000,
    "currency": "NGN",
    "customer": { "email": "amara@company.dev" },
    "routing": { "strategy": "auto_fallback", "prioritize": "lowest_latency" }
  }'`,
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F5F7FA] font-['Inter'] selection:bg-[#ABFF2A] selection:text-[#080B10] antialiased overflow-x-hidden">
      {/* Background Graphic Lines (Quirk Brand Graphic Guidelines: Connections & Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#F5F7FA 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gentle ambient gradient orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00D4FF]/[0.03] blur-[160px] rounded-full" />
        <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#ABFF2A]/[0.02] blur-[180px] rounded-full" />
      </div>

      {/* ========================================================================= */}
      {/* COMMAND PALETTE MODAL (Cmd+K / Ctrl+K) */}
      {/* ========================================================================= */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#080B10]/80 backdrop-blur-md animate-in fade-in duration-150 ease-out"
          onClick={() => setCommandPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command search"
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#11161D] border border-[#22303A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#22303A] bg-[#171D26]">
              <Search className="size-4 text-[#A9B0BB] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Quirk Routing OS, features, rails, or docs..."
                className="w-full bg-transparent text-sm text-[#F5F7FA] placeholder:text-[#A9B0BB]/60 focus:outline-none font-['Inter']"
              />
              <kbd className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#11161D] border border-[#22303A] text-[#A9B0BB]">
                ESC
              </kbd>
            </div>

            {/* Filtered Commands List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#A9B0BB] font-['JetBrains_Mono']">
                  No matching commands found.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCommandPaletteOpen(false)
                      if (cmd.url) {
                        navigate({ to: cmd.url })
                      } else if (cmd.section) {
                        const el = document.querySelector(cmd.section)
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left hover:bg-[#171D26] group transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#A9B0BB] font-['JetBrains_Mono'] uppercase tracking-wider group-hover:text-[#ABFF2A]">
                        {cmd.category}
                      </span>
                      <span className="text-sm font-medium text-[#F5F7FA]">{cmd.title}</span>
                    </div>
                    <ArrowRight className="size-3.5 text-[#A9B0BB] group-hover:text-[#ABFF2A] transition-transform group-hover:translate-x-1" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-[#22303A] bg-[#171D26] flex items-center justify-between text-[11px] text-[#A9B0BB] font-['JetBrains_Mono']">
              <span>Navigation</span>
              <span className="text-[#F5F7FA] font-medium">Quirk Navigation</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING PILL NAVBAR (Spacious, Minimal Flow) */}
      {/* ========================================================================= */}
      <header className="fixed top-5 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none">
        <nav
          aria-label="Main navigation"
          className="max-w-3xl mx-auto flex items-center justify-between px-5 sm:px-7 py-2.5 rounded-full bg-[#11161D]/90 backdrop-blur-xl border border-[#22303A] shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto transition-all"
        >
          {/* Logo on Left */}
          <Link
            to="/"
            className="cursor-pointer flex items-center gap-2 pl-1 pr-3 py-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A] transition-opacity hover:opacity-90"
            aria-label="Quirk Home"
          >
            <QuirkLogo size={22} lightMode={false} />
          </Link>

          {/* Clean 3 Core Links in Center with Spacious Breathing Room */}
          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-[#A9B0BB]">
            {[
              { id: 'architecture', label: 'Architecture' },
              { id: 'rails', label: 'Rails' },
              { id: 'developer', label: 'Developers' },
            ].map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`py-1.5 transition-colors duration-150 relative ${
                    isActive
                      ? 'text-[#F5F7FA] font-semibold'
                      : 'hover:text-[#F5F7FA]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#ABFF2A]" />
                  )}
                </a>
              )
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A] shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-1.5 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A] shadow-sm"
              >
                <span>Start building</span>
                <ArrowRight className="size-3" />
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 text-[#A9B0BB] hover:text-[#F5F7FA] min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A] rounded-full hover:bg-[#171D26]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden max-w-3xl mx-auto mt-2 p-5 rounded-2xl bg-[#11161D] border border-[#22303A] shadow-2xl space-y-1.5 pointer-events-auto animate-in slide-in-from-top-2 duration-150">
            {[
              { id: 'architecture', label: 'Architecture' },
              { id: 'rails', label: 'Payment Rails' },
              { id: 'developer', label: 'Developers' },
              { id: 'pricing', label: 'Pricing' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium py-2.5 px-3 rounded-xl min-h-[44px] flex items-center justify-between transition-colors ${
                  activeSection === item.id
                    ? 'text-[#ABFF2A] bg-[#171D26] font-semibold'
                    : 'text-[#F5F7FA] hover:bg-[#171D26]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="size-4 text-[#A9B0BB]" />
              </a>
            ))}
            <div className="pt-3 border-t border-[#22303A] flex flex-col gap-2">
              <Link
                to="/sign-in"
                className="w-full text-center text-xs font-medium text-[#F5F7FA] py-3 bg-[#171D26] hover:bg-[#22303A] rounded-full min-h-[44px] flex items-center justify-center transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="w-full text-center text-xs font-semibold text-[#080B10] py-3 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 rounded-full min-h-[44px] flex items-center justify-center transition-colors"
              >
                Start building
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION (Primora Aesthetic: "We build what lasts") */}
      {/* ========================================================================= */}
      <section className="relative pt-36 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 max-w-5xl mx-auto text-center z-10">
        {/* Editorial Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#11161D] border border-[#22303A] mb-8">
          <span className="size-2 rounded-full bg-[#ABFF2A] animate-pulse" />
          <span className="font-['Space_Grotesk'] text-[11px] font-medium tracking-widest text-[#A9B0BB] uppercase">
            One connection · Every rail
          </span>
        </div>

        {/* Primora Display Spacing Headline */}
        <h1 className="font-['Satoshi'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#F5F7FA] leading-[1.04] mb-6">
          We build what lasts.
        </h1>

        {/* Primora Subtitle Cadence */}
        <p className="text-base sm:text-xl text-[#A9B0BB] leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          Turning fragmented African payment systems into durable transaction volume, sub-second routing uptime, and long-term ecosystem value.
        </p>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link
            to="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A]"
          >
            <span>Start building</span>
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="#framework"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#11161D] hover:bg-[#171D26] border border-[#22303A] text-[#F5F7FA] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A]"
          >
            <FileCode2 className="size-4 text-[#A9B0BB]" />
            <span>Read the framework</span>
          </a>
        </div>

        {/* Terminal Install Snippet */}
        <div className="inline-flex items-center gap-3 bg-[#11161D] border border-[#22303A] rounded-full px-4 py-2 text-xs font-['JetBrains_Mono'] text-[#A9B0BB]">
          <span className="text-[#ABFF2A] font-bold">$</span>
          <span className="text-[#F5F7FA]">npm install @quirk/sdk</span>
          <button
            onClick={copyInstallCommand}
            className="p-1 hover:text-[#F5F7FA] transition-colors ml-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A] rounded"
            aria-label="Copy install command"
          >
            {copiedInstall ? <Check className="size-3.5 text-[#ABFF2A]" /> : <Copy className="size-3.5" />}
          </button>
        </div>

        {/* Subtle Brand Routing Curve Lines (Quirk Brand Graphic Language) */}
        <div className="mt-14 max-w-2xl mx-auto opacity-25 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 600 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40C150 40 150 15 300 15C450 15 450 65 600 65" stroke="#00D4FF" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M0 40C150 40 150 65 300 65C450 65 450 15 600 15" stroke="#22303A" strokeWidth="1.5" />
            <path d="M0 40H600" stroke="#22303A" strokeWidth="1.5" />
            <circle cx="150" cy="40" r="3" fill="#ABFF2A" />
            <circle cx="300" cy="15" r="3.5" fill="#00D4FF" />
            <circle cx="450" cy="65" r="3.5" fill="#ABFF2A" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INFINITE MARQUEE RAIL TICKER (Continuous Rolling African Rails Loop) */}
      {/* ========================================================================= */}
      <section className="py-5 border-y border-[#22303A] bg-[#11161D]/50 overflow-hidden relative" aria-label="Supported payment rails">
        {/* Left & Right ambient fade masks for seamless entrance & exit */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#080B10] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#080B10] to-transparent z-10" />

        <div className="quirk-marquee-track items-center gap-10 text-xs font-['JetBrains_Mono'] text-[#A9B0BB]">
          {[...ECOSYSTEM_RAILS, ...ECOSYSTEM_RAILS].map((rail, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 px-3.5 py-1.5 rounded-full bg-[#11161D] border border-[#22303A] hover:border-[#ABFF2A]/50 transition-colors"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ABFF2A] opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-[#ABFF2A]" />
              </span>
              <span className="font-semibold text-[#F5F7FA] tracking-tight">{rail.name}</span>
              <span className="text-[#A9B0BB]/50">·</span>
              <span className="text-[#A9B0BB]">{rail.region}</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#171D26] border border-[#22303A] text-[#00D4FF]">
                {rail.ping}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRIMORA FRAMEWORK BANNER ("What we've learned matters most") */}
      {/* ========================================================================= */}
      <section id="framework" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#11161D] border border-[#22303A] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#00D4FF] uppercase block">
              Routing Framework
            </span>
            <h2 className="font-['Satoshi'] text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
              What we've learned matters most in African payments.
            </h2>
            <p className="text-xs sm:text-sm text-[#A9B0BB] max-w-xl leading-relaxed">
              Resilience beats raw promises. A multi-rail infrastructure layer that proactively catches banking drop-offs before checkout conversion fails.
            </p>
          </div>
          <a
            href="#architecture"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#080B10] bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 px-6 py-3.5 rounded-full transition-all active:scale-[0.97] shrink-0"
          >
            <span>Explore Principles</span>
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* IMPACT & METRICS SECTION (Primora "When strategy becomes measurable impact") */}
      {/* ========================================================================= */}
      <section id="impact" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#ABFF2A] uppercase mb-3 block">
              Impact
            </span>
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA]">
              When strategy becomes measurable impact.
            </h2>
          </div>
          <p className="text-sm text-[#A9B0BB] max-w-md leading-relaxed">
            Delivered through Quirk’s autonomous routing and multi-currency clearing systems.
          </p>
        </div>

        {/* 4 Primora Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] flex flex-col justify-between hover:border-[#A9B0BB]/30 transition-all shadow-md">
            <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#F5F7FA] tracking-tight mb-4">
              99.99%
            </span>
            <div>
              <h3 className="font-semibold text-[#F5F7FA] text-sm mb-1">Users & Sessions Enabled</h3>
              <p className="text-xs text-[#A9B0BB] leading-relaxed">
                Autonomous sub-second failover prevents dropped checkout sessions.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] flex flex-col justify-between hover:border-[#A9B0BB]/30 transition-all shadow-md">
            <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#00D4FF] tracking-tight mb-4">
              $500M+
            </span>
            <div>
              <h3 className="font-semibold text-[#F5F7FA] text-sm mb-1">Volume Activated</h3>
              <p className="text-xs text-[#A9B0BB] leading-relaxed">
                Liquidity and merchant settlement mobilized across networks built for scale.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] flex flex-col justify-between hover:border-[#A9B0BB]/30 transition-all shadow-md">
            <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#F5F7FA] tracking-tight mb-4">
              &lt; 140ms
            </span>
            <div>
              <h3 className="font-semibold text-[#F5F7FA] text-sm mb-1">Dynamic Latency</h3>
              <p className="text-xs text-[#A9B0BB] leading-relaxed">
                Predictive health probing routes each charge via the fastest gateway.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] flex flex-col justify-between hover:border-[#A9B0BB]/30 transition-all shadow-md">
            <span className="font-['Space_Grotesk'] text-4xl sm:text-5xl font-bold text-[#ABFF2A] tracking-tight mb-4">
              12+
            </span>
            <div>
              <h3 className="font-semibold text-[#F5F7FA] text-sm mb-1">Supported Rails</h3>
              <p className="text-xs text-[#A9B0BB] leading-relaxed">
                Cards, Dynamic Virtual Accounts, Mobile Money, and USSD networks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHILOSOPHY & PILLARS SECTION (Primora "Who we work with" 6-card pattern) */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#ABFF2A] uppercase mb-3 block">
            Engineering Principles
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA] mb-4">
            Who we build with.
          </h2>
          <p className="text-sm text-[#A9B0BB] leading-relaxed">
            Quirk works with founders, fintech developers, and global platforms to transform fragmented banking switches into high-reliability payment networks.
          </p>
        </div>

        {/* 6 Primora Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHILOSOPHY_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] hover:border-[#A9B0BB]/30 transition-all flex flex-col justify-between shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#A9B0BB] mb-6">
                  <span className="text-[#ABFF2A] uppercase font-semibold">{pillar.badge}</span>
                  <span className="text-[#A9B0BB]/60 font-bold">{pillar.number}</span>
                </div>
                <h3 className="font-['Satoshi'] text-xl font-bold text-[#F5F7FA] mb-3 group-hover:text-[#ABFF2A] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#A9B0BB] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE QUIRK NETWORK (Primora "The Primora Network" Ecosystem Grid) */}
      {/* ========================================================================= */}
      <section id="rails" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#00D4FF] uppercase mb-3 block">
            The Quirk Network
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA] mb-4">
            A thriving ecosystem built for African scale.
          </h2>
          <p className="text-sm text-[#A9B0BB] leading-relaxed">
            Direct connections across Africa's premier financial networks and clearing houses.
          </p>
        </div>

        {/* Network Rails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ECOSYSTEM_RAILS.map((rail, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#11161D] border border-[#22303A] hover:border-[#A9B0BB]/30 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#00D4FF]">{rail.code}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[#ABFF2A]">
                    <span className="size-1.5 rounded-full bg-[#ABFF2A]" />
                    {rail.ping}
                  </span>
                </div>
                <h3 className="font-['Satoshi'] font-bold text-sm text-[#F5F7FA] mb-1">{rail.name}</h3>
                <p className="text-xs text-[#A9B0BB] mb-2">{rail.category}</p>
                <p className="text-[11px] text-[#A9B0BB]/70">{rail.region}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#22303A] text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB]/80">
                {rail.currency}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE ROUTING ASSISTANT / CONSOLE (Primora "Talk to Aiden" Flow) */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="rounded-3xl bg-[#11161D] border border-[#22303A] p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171D26] border border-[#22303A] text-xs font-['JetBrains_Mono'] text-[#ABFF2A]">
                <Bot className="size-3.5" />
                <span>Interactive Routing Intelligence</span>
              </div>
              <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA]">
                Query real-time network routes and failover logic.
              </h2>
              <p className="text-xs sm:text-sm text-[#A9B0BB] leading-relaxed">
                Test how Quirk evaluates gateway ping times, routes across multi-currency ledgers, and handles bank outages in production.
              </p>

              {/* Sample Prompts */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setChatMessage('How does sub-200ms failover work?')
                  }}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-[#080B10] border border-[#22303A] text-[#A9B0BB] hover:text-[#F5F7FA] hover:border-[#ABFF2A]/30 transition-colors"
                >
                  "How does sub-200ms failover work?"
                </button>
                <button
                  onClick={() => {
                    setChatMessage('How do multi-currency ledgers settle?')
                  }}
                  className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-[#080B10] border border-[#22303A] text-[#A9B0BB] hover:text-[#F5F7FA] hover:border-[#ABFF2A]/30 transition-colors"
                >
                  "How do multi-currency ledgers settle?"
                </button>
              </div>
            </div>

            {/* Right Chat Sandbox */}
            <div className="lg:col-span-7 rounded-2xl bg-[#080B10] border border-[#22303A] p-6 flex flex-col justify-between min-h-[320px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#22303A] pb-3 text-xs font-['JetBrains_Mono'] text-[#A9B0BB]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#ABFF2A] animate-pulse" />
                    <span>Quirk Architecture Copilot</span>
                  </div>
                  <span>Ready</span>
                </div>

                <div className="p-4 rounded-xl bg-[#11161D] border border-[#22303A] text-xs text-[#F5F7FA] leading-relaxed">
                  {isChatLoading ? (
                    <div className="flex items-center gap-2 text-[#ABFF2A]">
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Evaluating routing graph...</span>
                    </div>
                  ) : chatResponse ? (
                    <div>{chatResponse}</div>
                  ) : (
                    <div className="text-[#A9B0BB]">
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
                  placeholder="Ask about failover, currency pots, or SDK..."
                  className="w-full bg-[#11161D] border border-[#22303A] rounded-full px-4 py-2.5 text-xs text-[#F5F7FA] placeholder:text-[#A9B0BB]/60 focus:outline-none focus:border-[#ABFF2A]"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatMessage.trim()}
                  className="p-2.5 rounded-full bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] disabled:opacity-50 transition-all shrink-0"
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
      {/* DEVELOPER PLAYGROUND & SDK */}
      {/* ========================================================================= */}
      <section id="developer" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#00D4FF] uppercase block">
              Developer Playground
            </span>
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA]">
              Five lines of code to replace five payment SDKs.
            </h2>
            <p className="text-sm text-[#A9B0BB] leading-relaxed">
              Install the official SDK in your preferred language. Configure your secret key and let Quirk handle routing, failovers, and webhook reconciliation.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#F5F7FA]">
                <Check className="size-4 text-[#ABFF2A]" />
                <span>Zero vendor lock-in — bring your own keys</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#F5F7FA]">
                <Check className="size-4 text-[#ABFF2A]" />
                <span>Deterministic idempotency on all charge requests</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#F5F7FA]">
                <Check className="size-4 text-[#ABFF2A]" />
                <span>Unified webhooks with verified HMAC-SHA256 signatures</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSimulateCall}
                disabled={isSimulatingCall}
                className="inline-flex items-center gap-2 bg-[#171D26] hover:bg-[#22303A] border border-[#22303A] text-[#F5F7FA] font-medium text-xs px-5 py-3 rounded-full transition-all active:scale-[0.97] min-h-[44px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A]"
              >
                {isSimulatingCall ? (
                  <RefreshCw className="size-3.5 animate-spin text-[#ABFF2A]" />
                ) : (
                  <Play className="size-3.5 text-[#ABFF2A]" />
                )}
                <span>Simulate live charge request</span>
              </button>
            </div>
          </div>

          {/* Right: Code Console */}
          <div className="lg:col-span-7 rounded-2xl bg-[#11161D] border border-[#22303A] overflow-hidden shadow-2xl">
            {/* Header Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#22303A] bg-[#171D26]">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-[#EF4444]" />
                <div className="size-2.5 rounded-full bg-[#F5B83D]" />
                <div className="size-2.5 rounded-full bg-[#ABFF2A]" />
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-[#080B10] p-1 rounded-lg border border-[#22303A]" role="tablist" aria-label="Programming languages">
                {(['node', 'go', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    role="tab"
                    aria-selected={selectedLang === lang}
                    onClick={() => {
                      setSelectedLang(lang)
                      setTerminalTab('code')
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-['JetBrains_Mono'] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A] ${
                      selectedLang === lang ? 'bg-[#171D26] text-[#ABFF2A] font-semibold' : 'text-[#A9B0BB] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {lang === 'node' ? 'Node.js' : lang === 'go' ? 'Go' : lang === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 font-['JetBrains_Mono'] text-xs text-[#F5F7FA] overflow-x-auto leading-relaxed min-h-[300px]">
              {terminalTab === 'code' ? (
                <pre>{codeSnippets[selectedLang]}</pre>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-[#ABFF2A] font-semibold mb-2">HTTP 200 OK · 174ms Response</div>
                  <pre className="text-[#F5F7FA]">
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
      "email": "amara@company.dev"
    },
    "createdAt": "${new Date().toISOString()}"
  }
}`}
                  </pre>
                </div>
              )}
            </div>

            {/* Console Footer */}
            <div className="px-6 py-2.5 border-t border-[#22303A] bg-[#171D26] flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB]">
              <span>SDK: @quirk/sdk v1.2.0</span>
              <button
                onClick={() => setTerminalTab(terminalTab === 'code' ? 'response' : 'code')}
                className="hover:text-[#F5F7FA] text-[#00D4FF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A] rounded py-0.5"
              >
                {terminalTab === 'code' ? 'View Sample Response →' : '← Back to Code'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STRATEGIC INSIGHTS (Primora Editorial Cards linking to Detail Pages) */}
      {/* ========================================================================= */}
      <section id="insights" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#22303A]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#00D4FF] uppercase mb-3 block">
              Latest Insights
            </span>
            <h2 className="font-['Satoshi'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7FA]">
              The thinking behind the network.
            </h2>
          </div>
          <a
            href="https://github.com/T9ner/quirk"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-[#A9B0BB] hover:text-[#F5F7FA] inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A] rounded p-1"
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
              className="p-8 rounded-2xl bg-[#11161D] border border-[#22303A] hover:border-[#ABFF2A]/50 hover:bg-[#171D26]/70 transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.99] shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB] mb-4">
                  <span className="text-[#ABFF2A] uppercase font-semibold">{post.tag}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-['Satoshi'] text-base font-bold text-[#F5F7FA] mb-3 group-hover:text-[#ABFF2A] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-[#A9B0BB] leading-relaxed mb-6 group-hover:text-[#F5F7FA]/80 transition-colors">
                  {post.summary}
                </p>
              </div>
              <div className="pt-4 border-t border-[#22303A] flex items-center justify-between text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB] group-hover:text-[#F5F7FA]">
                <span>{post.author}</span>
                <span className="flex items-center gap-1 text-[#ABFF2A]">
                  <span>{post.readTime}</span>
                  <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRICING SECTION */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#22303A]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#ABFF2A] uppercase mb-3 block">
            Transparent Pricing
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] mb-4">
            Predictable infrastructure pricing at scale.
          </h2>
          <p className="text-sm text-[#A9B0BB] leading-relaxed">
            No hidden gateway markups. Bring your direct merchant negotiated rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Growth Plan */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#11161D] border border-[#22303A] flex flex-col justify-between">
            <div>
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#A9B0BB] font-semibold mb-2 block">
                Growth Plan
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Space_Grotesk'] text-4xl font-bold text-[#F5F7FA]">0.15%</span>
                <span className="text-xs text-[#A9B0BB]">/ routed transaction</span>
              </div>
              <p className="text-xs text-[#A9B0BB] leading-relaxed mb-6">
                Ideal for startups and growing platforms needing multi-rail failover without managing multiple SDKs.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#F5F7FA]">
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Unlimited failover routing rules</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Direct key vaulting (Bring your own keys)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Real-time webhook dispatcher</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Community Discord & GitHub support</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/sign-up"
                className="w-full py-3 rounded-full bg-[#171D26] hover:bg-[#22303A] border border-[#22303A] text-center text-xs font-semibold text-[#F5F7FA] block transition-all active:scale-[0.97] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A]"
              >
                Get API Keys
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#11161D] border border-[#ABFF2A]/30 flex flex-col justify-between relative shadow-xl">
            <div className="absolute top-5 right-5 text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider bg-[#ABFF2A] text-[#080B10] font-bold px-3 py-0.5 rounded-full">
              Enterprise
            </div>
            <div>
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#ABFF2A] font-semibold mb-2 block">
                Custom Volume
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Space_Grotesk'] text-4xl font-bold text-[#F5F7FA]">Custom</span>
                <span className="text-xs text-[#A9B0BB]">volume discounts</span>
              </div>
              <p className="text-xs text-[#A9B0BB] leading-relaxed mb-6">
                For high-volume merchants processing over ₦50M+ monthly across multiple African markets.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#F5F7FA]">
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Dedicated routing cluster & SLA guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Custom private banking switches</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>24/7 dedicated engineering Slack channel</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#ABFF2A]" />
                  <span>Automated treasury multi-currency sweeps</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/sign-up"
                className="w-full py-3 rounded-full bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-center text-xs font-semibold text-[#080B10] block transition-all active:scale-[0.97] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A]"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[#22303A]">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-['Space_Grotesk'] font-semibold tracking-widest text-[#00D4FF] uppercase mb-3 block">
            Questions & Answers
          </span>
          <h2 className="font-['Satoshi'] text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#11161D] border border-[#22303A] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-['Satoshi'] font-semibold text-sm text-[#F5F7FA] flex items-center justify-between gap-4 hover:text-[#ABFF2A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ABFF2A] min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#A9B0BB] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#ABFF2A]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#A9B0BB] leading-relaxed border-t border-[#22303A] pt-4 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CLEAN BRAND-ALIGNED CTA */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-[#22303A]">
        <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center border border-[#22303A] bg-[#11161D] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Subtle brand ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00D4FF]/[0.08] blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[200px] bg-[#ABFF2A]/[0.04] blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-['Satoshi'] text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F7FA] leading-[1.1]">
              Connect your payment rails in minutes.
            </h2>
            <p className="text-sm sm:text-base text-[#A9B0BB] max-w-xl mx-auto leading-relaxed font-normal">
              Get production API keys, explore our SDK playground, and deploy failover-ready payment infrastructure today.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.97] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ABFF2A]"
              >
                <span>Start building</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#171D26] hover:bg-[#22303A] border border-[#22303A] text-[#F5F7FA] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.97]"
              >
                <span>Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER (Primora Flow with Watermark and Clean Structure) */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#22303A] bg-[#080B10] pt-16 pb-12 text-xs text-[#A9B0BB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <QuirkLogo size={24} lightMode={false} />
              <p className="text-xs text-[#A9B0BB] max-w-sm leading-relaxed">
                One connection. Every payment system. Turning early momentum into durable African fintech infrastructure.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-['JetBrains_Mono'] text-[#F5F7FA]">
                <span className="size-2 rounded-full bg-[#ABFF2A] animate-pulse" />
                <span>All payment rails operational</span>
              </div>
            </div>

            {/* Infrastructure Links */}
            <div>
              <div className="text-xs font-['Space_Grotesk'] font-bold text-[#F5F7FA] uppercase mb-4">
                Platform
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#framework" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Framework
                  </a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Impact Metrics
                  </a>
                </li>
                <li>
                  <a href="#architecture" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Architecture
                  </a>
                </li>
                <li>
                  <a href="#rails" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Supported Rails
                  </a>
                </li>
              </ul>
            </div>

            {/* Developer Links */}
            <div>
              <div className="text-xs font-['Space_Grotesk'] font-bold text-[#F5F7FA] uppercase mb-4">
                Developers
              </div>
              <ul className="space-y-2.5">
                <li>
                  <a href="#developer" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Node.js SDK
                  </a>
                </li>
                <li>
                  <a href="#developer" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Go Client
                  </a>
                </li>
                <li>
                  <a href="#developer" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Python Package
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/T9ner/quirk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#F5F7FA] transition-colors inline-flex items-center gap-1 py-0.5"
                  >
                    <span>GitHub Repo</span>
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Company / Legal */}
            <div>
              <div className="text-xs font-['Space_Grotesk'] font-bold text-[#F5F7FA] uppercase mb-4">
                Legal
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/privacy" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/sign-in" className="hover:text-[#F5F7FA] transition-colors py-0.5 inline-block">
                    Merchant Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#22303A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>© {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.</div>
            <div className="font-['JetBrains_Mono'] text-[#A9B0BB]">
              Built for high-volume African commerce
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
