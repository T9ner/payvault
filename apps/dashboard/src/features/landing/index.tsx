import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
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
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Building2,
  Smartphone,
  SlidersHorizontal,
  FileCode2,
  ExternalLink,
  Code2,
  Database,
  Network,
  Cpu,
  Lock,
  Globe,
  TrendingDown,
  AlertTriangle,
  FileSpreadsheet,
  PlusCircle,
  Compass,
  LineChart,
  Target,
  Sparkles,
} from 'lucide-react'
import { QuirkLogo } from '@/components/quirk-logo'
import { INSIGHTS_ARTICLES } from '@/features/insights/insights-data'

// Supported payment rails for the infinite marquee
const ECOSYSTEM_RAILS = [
  { name: 'Paystack Direct', code: 'PSTK', ping: '185ms', status: 'Operational', type: 'Cards & Transfer' },
  { name: 'Flutterwave Switch', code: 'FLW', ping: '210ms', status: 'Operational', type: 'Pan-African & Global' },
  { name: 'M-Pesa Express', code: 'MPESA', ping: '140ms', status: 'Operational', type: 'STK Push' },
  { name: 'Monnify Dynamic VA', code: 'MNFY', ping: '195ms', status: 'Operational', type: 'Virtual Accounts' },
  { name: 'Squad HabariPay', code: 'SQD', ping: '205ms', status: 'Operational', type: 'USSD & VA' },
  { name: 'Interswitch Switch', code: 'ISW', ping: '240ms', status: 'Operational', type: 'Card Switch' },
  { name: 'MTN MoMo Rail', code: 'MOMO', ping: '220ms', status: 'Operational', type: 'Mobile Money' },
  { name: 'Airtel Money Rail', code: 'ARTL', ping: '215ms', status: 'Operational', type: 'Mobile Money' },
]

// 5 Core Problems Scaling African Tech Companies Face
const PROBLEMS = [
  {
    number: '01',
    icon: Network,
    title: 'Multiple providers becoming unmanageable',
    summary: 'As you add secondary gateways and local rails, your engineering team drowns in divergent APIs, inconsistent error codes, and duplicate integration maintenance.',
    impact: 'Engineering spent maintaining gateway wrappers instead of core product.',
  },
  {
    number: '02',
    icon: TrendingDown,
    title: 'Failed transactions and silent drops',
    summary: 'Upstream provider downtime and flaky bank networks cause payments to fail silently with zero automated failover, losing customers at the point of checkout.',
    impact: 'Lost revenue and eroded customer trust during peak traffic periods.',
  },
  {
    number: '03',
    icon: FileSpreadsheet,
    title: 'Fragmented reconciliation across providers',
    summary: 'Settlements arrive on different schedules across Paystack, Flutterwave, Monnify, and M-Pesa. Finance teams manually piece together spreadsheets to balance books.',
    impact: 'Zero unified ledger view of multi-currency cash flow and payout status.',
  },
  {
    number: '04',
    icon: PlusCircle,
    title: 'Adding new payment methods takes weeks',
    summary: 'Supporting virtual accounts, mobile money in East Africa, or USSD requires building custom integrations from scratch with new webhook listeners each time.',
    impact: 'Months of engineering delay to capture localized payment preferences.',
  },
  {
    number: '05',
    icon: Globe,
    title: 'Expanding into new markets and currencies',
    summary: 'Expanding from Nigeria to Kenya, Ghana, or South Africa forces teams to research local rails, negotiate new merchant accounts, and rebuild payment plumbing.',
    impact: 'Market expansion stalled by fragmented cross-border payment infrastructure.',
  },
]

// 5 Direct Mirrored Solutions Provided by Quirk
const SOLUTIONS = [
  {
    number: '01',
    badge: 'Connect',
    icon: Code2,
    title: 'One SDK for every provider',
    description: 'Integrate @quirk/sdk once. Access cards, bank transfers, dynamic virtual accounts, USSD, and mobile money networks through a single, battle-tested API.',
    codeSnippet: 'const quirk = new Quirk({ apiKey: env.QUIRK_KEY });',
  },
  {
    number: '02',
    badge: 'Normalize',
    icon: Layers,
    title: 'Standardized schemas & webhooks',
    description: 'Universal request parameters, consistent charge statuses, and one normalized webhook event envelope with verified HMAC-SHA256 signatures.',
    codeSnippet: 'quirk.webhooks.verify(signature, rawPayload);',
  },
  {
    number: '03',
    badge: 'Monitor',
    icon: Activity,
    title: 'Real-time health probing & diagnostics',
    description: 'Autonomous health probing monitors provider latency and clearing success rates 24/7, pinpointing upstream network degradations before users experience errors.',
    codeSnippet: 'status: "operational" | latency: "174ms"',
  },
  {
    number: '04',
    badge: 'Route',
    icon: Zap,
    title: 'Intelligent failover & switch selection',
    description: 'Sub-200ms automated failover dynamically shifts customer checkout sessions to healthy alternate rails whenever primary gateways experience degradation.',
    codeSnippet: 'strategy: "dynamic_failover" | maxRetries: 2',
  },
  {
    number: '05',
    badge: 'Scale',
    icon: Compass,
    title: 'Instant market & currency expansion',
    description: 'Activate NGN, KES, GHS, and USD settlement routes on demand. Enter new African markets without modifying your core checkout code.',
    codeSnippet: 'currencies: ["NGN", "KES", "GHS", "USD"]',
  },
]

// Target Customer Audience Segments
const TARGET_AUDIENCES = [
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    icon: Building2,
    headline: 'Multi-merchant routing & split payments',
    description: 'Collect payments through any African rail, hold securely, and route vendor payouts seamlessly across banks and mobile money wallets.',
  },
  {
    id: 'fintechs',
    label: 'Fintechs',
    icon: Zap,
    headline: 'High-volume failover & zero vendor lock-in',
    description: 'Bring your own negotiated merchant provider rates, vault API keys in hardware enclaves, and ensure 99.99% uptime with autonomous failover.',
  },
  {
    id: 'commerce',
    label: 'Commerce Platforms',
    icon: CreditCard,
    headline: 'Frictionless checkout across cards & virtual accounts',
    description: 'Present local payment methods dynamically based on customer geography while maintaining a single backend order reconciliation stream.',
  },
  {
    id: 'saas',
    label: 'SaaS Companies',
    icon: SlidersHorizontal,
    headline: 'Multi-currency subscription billing & ledgers',
    description: 'Charge recurring subscriptions in NGN, KES, or USD with automatic retry schedules and normalized webhook notifications.',
  },
  {
    id: 'neobanks',
    label: 'Neobanks & Wallets',
    icon: Database,
    headline: 'Dynamic virtual account generation & clearing',
    description: 'Generate dedicated virtual bank accounts on demand with real-time transfer notifications and automated double-entry ledger bookkeeping.',
  },
  {
    id: 'lending',
    label: 'Lending Platforms',
    icon: Lock,
    headline: 'Reliable disbursement & direct debit collections',
    description: 'Route loan disbursements through the fastest verified bank rail and schedule automated repayment collections with full audit trails.',
  },
]

// Intelligence Vision Roadmap Items
const ROADMAP_ITEMS = [
  {
    icon: LineChart,
    title: 'Failure Pattern Analysis',
    description: 'Categorize upstream bank rejections, insufficient funds, and network timeout signatures to diagnose why transactions drop.',
  },
  {
    icon: Target,
    title: 'Provider Performance Scoring',
    description: 'Real-time clearing benchmarks comparing true latency, success rates, and cost efficiency across African payment switches.',
  },
  {
    icon: Compass,
    title: 'Customer Drop-Off Insights',
    description: 'Identify checkout abandonment friction points and optimize payment rail presentation by user device and geography.',
  },
  {
    icon: Sparkles,
    title: 'Transaction Cost Optimization',
    description: 'Smart routing algorithms that automatically select the lowest-cost verified rail while preserving sub-second authorization speed.',
  },
]

// Code playground language snippets
const CODE_SNIPPETS = {
  typescript: `import { Quirk } from '@quirk/sdk'

// Initialize Quirk with hardware vaulted credentials
const quirk = new Quirk({ 
  apiKey: process.env.QUIRK_SECRET_KEY 
})

// Initialize normalized multi-rail charge
const charge = await quirk.charges.create({
  amount: 2500000, // ₦25,000.00
  currency: 'NGN',
  customer: { 
    email: 'alex@company.dev',
    name: 'Alex Okafor'
  },
  channels: ['card', 'bank_transfer', 'ussd'],
  strategy: 'dynamic_failover',
  metadata: { orderId: 'ord_98124' }
})

console.log('Checkout URL:', charge.checkout_url)
console.log('Active Rail:', charge.routed_provider)`,
  python: `from quirk import Quirk
import os

# Initialize Quirk with vaulted API key
client = Quirk(api_key=os.environ.get("QUIRK_SECRET_KEY"))

# Create unified multi-rail charge
charge = client.charges.create(
    amount=2500000,  # ₦25,000.00
    currency="NGN",
    customer={"email": "alex@company.dev", "name": "Alex Okafor"},
    channels=["card", "bank_transfer", "ussd"],
    strategy="dynamic_failover",
    metadata={"order_id": "ord_98124"}
)

print(f"Checkout URL: {charge.checkout_url}")
print(f"Routed Switch: {charge.routed_provider}")`,
  curl: `curl -X POST https://api.quirk.dev/v1/charges \\
  -H "Authorization: Bearer qrk_live_9f81a..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500000,
    "currency": "NGN",
    "customer": { "email": "alex@company.dev" },
    "channels": ["card", "bank_transfer", "ussd"],
    "strategy": "dynamic_failover"
  }'`,
}

export function LandingPage() {
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState(TARGET_AUDIENCES[0].id)
  const [selectedLang, setSelectedLang] = useState<'typescript' | 'python' | 'curl'>('typescript')
  const [copiedCode, setCopiedCode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeAudience = TARGET_AUDIENCES.find((a) => a.id === selectedAudience) || TARGET_AUDIENCES[0]

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm install @quirk/sdk')
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const copySnippet = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[selectedLang])
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className='min-h-screen bg-[#000000] font-sans text-[#FFFFFF] antialiased selection:bg-[#FFFFFF] selection:text-[#000000]'>
      {/* 1. TOP STICKY NAVBAR */}
      <header className='sticky top-0 z-50 w-full border-b border-[#222222] bg-[#000000]/90 backdrop-blur-md'>
        <div className='container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2.5 transition-opacity hover:opacity-90'>
            <QuirkLogo size={24} lightMode={false} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className='hidden md:flex items-center gap-8 text-xs font-medium text-[#A9A9A9]'>
            <a href='#problems' className='transition-colors hover:text-[#FFFFFF]'>
              Overview
            </a>
            <a href='#solutions' className='transition-colors hover:text-[#FFFFFF]'>
              Product
            </a>
            <a href='#roadmap' className='transition-colors hover:text-[#FFFFFF]'>
              Roadmap
            </a>
            <Link to='/insights' className='transition-colors hover:text-[#FFFFFF]'>
              Insights
            </Link>
            <a
              href='https://github.com/T9ner/quirk'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-[#FFFFFF] inline-flex items-center gap-1'
            >
              <span>GitHub</span>
              <ExternalLink className='size-3 opacity-60' />
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className='hidden sm:flex items-center gap-3'>
            <a
              href='mailto:engineering@quirk.dev?subject=Quirk%20Inquiry'
              className='text-xs font-medium text-[#A9A9A9] hover:text-[#FFFFFF] px-3.5 py-1.5 rounded-full border border-[#222222] bg-[#101010] hover:bg-[#161616] transition-all'
            >
              Talk to us
            </a>
            <a
              href='#get-started'
              className='text-xs font-semibold text-[#000000] bg-[#FFFFFF] hover:bg-[#E5E5E5] px-4 py-1.5 rounded-full transition-all active:scale-[0.98]'
            >
              Explore the API
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-[#A9A9A9] hover:text-[#FFFFFF]'
            aria-label='Toggle Menu'
          >
            {mobileMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className='md:hidden border-b border-[#222222] bg-[#0A0A0A] px-4 py-6 space-y-4 text-sm'>
            <a
              href='#problems'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#A9A9A9] hover:text-[#FFFFFF]'
            >
              Overview
            </a>
            <a
              href='#solutions'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#A9A9A9] hover:text-[#FFFFFF]'
            >
              Product
            </a>
            <a
              href='#roadmap'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#A9A9A9] hover:text-[#FFFFFF]'
            >
              Roadmap
            </a>
            <Link
              to='/insights'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#A9A9A9] hover:text-[#FFFFFF]'
            >
              Insights
            </Link>
            <a
              href='https://github.com/T9ner/quirk'
              target='_blank'
              rel='noopener noreferrer'
              className='block text-[#A9A9A9] hover:text-[#FFFFFF]'
            >
              GitHub
            </a>
            <div className='pt-4 border-t border-[#222222] flex flex-col gap-2.5'>
              <a
                href='mailto:engineering@quirk.dev?subject=Quirk%20Inquiry'
                className='text-center text-xs font-medium text-[#FFFFFF] py-2 rounded-full border border-[#222222] bg-[#101010]'
              >
                Talk to us
              </a>
              <a
                href='#get-started'
                onClick={() => setMobileMenuOpen(false)}
                className='text-center text-xs font-semibold text-[#000000] bg-[#FFFFFF] py-2 rounded-full'
              >
                Explore the API
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className='relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6 text-center'>
          {/* Status Badge */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101010] border border-[#222222] text-xs font-["JetBrains_Mono"] text-[#A9A9A9] mb-8'>
            <span className='size-1.5 rounded-full bg-[#22C55E]' />
            <span>Developer-first payment infrastructure for Africa</span>
          </div>

          {/* Main Headline */}
          <h1 className='text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"] max-w-4xl mx-auto leading-[1.08]'>
            Payment infrastructure, without the complexity
          </h1>

          {/* Subtitle */}
          <p className='mt-6 text-base sm:text-lg md:text-xl text-[#A9A9A9] max-w-2xl mx-auto font-normal leading-relaxed'>
            One unified layer to connect, manage, and scale payments across every provider and rail in Africa.
          </p>

          {/* Primary Action Buttons */}
          <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5'>
            <a
              href='#get-started'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-sm px-6 py-3 rounded-full transition-all active:scale-[0.98]'
            >
              <span>Explore the API</span>
              <ArrowRight className='size-4' />
            </a>
            <a
              href='mailto:engineering@quirk.dev?subject=Quirk%20Design%20Partner%20Inquiry'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#101010] hover:bg-[#161616] border border-[#222222] hover:border-[#333333] text-[#FFFFFF] font-medium text-sm px-6 py-3 rounded-full transition-all'
            >
              <span>Talk to us</span>
            </a>
          </div>

          {/* 3. MINIMAL ARCHITECTURE DIAGRAM */}
          <div className='mt-16 md:mt-20 border border-[#222222] bg-[#0A0A0A] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left'>
            <div className='flex items-center justify-between pb-6 border-b border-[#222222]'>
              <div className='flex items-center gap-2 font-["JetBrains_Mono"] text-xs text-[#A9A9A9]'>
                <span className='size-2 rounded-full bg-[#22C55E]' />
                <span>Quirk Unified Middleware Topology</span>
              </div>
              <span className='text-[11px] font-["JetBrains_Mono"] text-[#777777]'>Active Routing: Sub-200ms</span>
            </div>

            {/* Architecture Node Layout */}
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8'>
              {/* Client App Node */}
              <div className='md:col-span-3 p-4 rounded-xl bg-[#101010] border border-[#222222] text-center'>
                <div className='size-8 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-center mx-auto mb-2.5 text-[#FFFFFF]'>
                  <Cpu className='size-4' />
                </div>
                <div className='font-semibold text-sm text-[#FFFFFF]'>Your Application</div>
                <div className='text-[10px] text-[#A9A9A9] font-["JetBrains_Mono"] mt-0.5'>Marketplace · Fintech · SaaS</div>
              </div>

              {/* Arrow Connector 1 */}
              <div className='hidden md:flex md:col-span-1 justify-center'>
                <div className='flex items-center text-[#444444]'>
                  <div className='w-6 h-px bg-[#333333]' />
                  <ArrowRight className='size-4 text-[#A9A9A9]' />
                </div>
              </div>

              {/* Quirk Control Layer Center Node */}
              <div className='md:col-span-4 p-5 rounded-2xl bg-[#121212] border border-[#FFFFFF]/20 text-center relative shadow-lg'>
                <div className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#333333] text-[10px] font-["JetBrains_Mono"] text-[#FFFFFF] mb-2'>
                  <Lock className='size-3 text-[#FFFFFF]' />
                  <span>Hardware Key Vault</span>
                </div>
                <div className='font-bold text-base text-[#FFFFFF] font-["Satoshi"]'>Quirk Control Layer</div>
                <div className='text-[11px] text-[#A9A9A9] mt-1'>Normalization · Probing · Failover</div>
                <div className='mt-3 flex items-center justify-center gap-1.5 font-["JetBrains_Mono"] text-[10px] text-[#777777]'>
                  <span>@quirk/sdk</span>
                  <span>·</span>
                  <span>REST API</span>
                </div>
              </div>

              {/* Arrow Connector 2 */}
              <div className='hidden md:flex md:col-span-1 justify-center'>
                <div className='flex items-center text-[#444444]'>
                  <div className='w-6 h-px bg-[#333333]' />
                  <ArrowRight className='size-4 text-[#A9A9A9]' />
                </div>
              </div>

              {/* Provider Rails Nodes */}
              <div className='md:col-span-3 space-y-2'>
                <div className='p-2.5 rounded-lg bg-[#101010] border border-[#222222] flex items-center justify-between text-xs'>
                  <span className='font-semibold text-[#FFFFFF]'>Paystack</span>
                  <span className='text-[10px] font-["JetBrains_Mono"] text-[#A9A9A9]'>Cards & Accounts</span>
                </div>
                <div className='p-2.5 rounded-lg bg-[#101010] border border-[#222222] flex items-center justify-between text-xs'>
                  <span className='font-semibold text-[#FFFFFF]'>Flutterwave</span>
                  <span className='text-[10px] font-["JetBrains_Mono"] text-[#A9A9A9]'>Pan-Africa & USD</span>
                </div>
                <div className='p-2.5 rounded-lg bg-[#101010] border border-[#222222] flex items-center justify-between text-xs'>
                  <span className='font-semibold text-[#FFFFFF]'>M-Pesa</span>
                  <span className='text-[10px] font-["JetBrains_Mono"] text-[#A9A9A9]'>STK Push MoMo</span>
                </div>
                <div className='p-2.5 rounded-lg bg-[#101010] border border-[#222222] flex items-center justify-between text-xs'>
                  <span className='font-semibold text-[#FFFFFF]'>Monnify & Squad</span>
                  <span className='text-[10px] font-["JetBrains_Mono"] text-[#A9A9A9]'>Dynamic VA & USSD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INFINITE PAYMENT RAILS MARQUEE STRIP */}
      <section className='border-y border-[#222222] bg-[#080808] py-4 overflow-hidden relative'>
        <div className='quirk-marquee-container relative flex overflow-x-hidden'>
          <div className='quirk-marquee-track flex shrink-0 items-center gap-6 pr-6'>
            {[...ECOSYSTEM_RAILS, ...ECOSYSTEM_RAILS].map((rail, idx) => (
              <div
                key={idx}
                className='flex items-center gap-3 px-4 py-2 rounded-full bg-[#101010] border border-[#222222] text-xs shrink-0'
              >
                <div className='size-6 rounded bg-[#161616] border border-[#222222] flex items-center justify-center font-["JetBrains_Mono"] font-bold text-[9px] text-[#FFFFFF]'>
                  {rail.code}
                </div>
                <span className='font-semibold text-[#FFFFFF]'>{rail.name}</span>
                <span className='text-[#666666]'>·</span>
                <span className='text-[11px] text-[#A9A9A9]'>{rail.type}</span>
                <span className='inline-flex items-center gap-1 text-[10px] font-["JetBrains_Mono"] text-[#A9A9A9] pl-1'>
                  <span className='size-1.5 rounded-full bg-[#22C55E]' />
                  {rail.ping}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE PROBLEM SECTION: 5 Stacked Problem Blocks */}
      <section id='problems' className='py-20 md:py-28 border-b border-[#222222]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='mb-16'>
            <div className='text-xs font-semibold text-[#A9A9A9] uppercase tracking-wider font-["JetBrains_Mono"] mb-2'>
              The Reality of Scaling African Payments
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"]'>
              When payments become complicated
            </h2>
            <p className='text-base text-[#A9A9A9] mt-3 max-w-2xl'>
              As your product grows, your payment architecture fragments. What started as a simple integration turns into an unmanageable burden of custom scripts, failed checkouts, and reconciliation gaps.
            </p>
          </div>

          {/* 5 Stacked Problem Cards */}
          <div className='space-y-4'>
            {PROBLEMS.map((problem) => {
              const Icon = problem.icon
              return (
                <div
                  key={problem.number}
                  className='p-6 sm:p-8 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start'
                >
                  <div className='md:col-span-1 flex items-center md:flex-col gap-3'>
                    <span className='font-["JetBrains_Mono"] text-xs font-bold text-[#666666]'>
                      {problem.number}
                    </span>
                    <div className='size-9 rounded-xl bg-[#161616] border border-[#222222] flex items-center justify-center text-[#FFFFFF]'>
                      <Icon className='size-4' />
                    </div>
                  </div>

                  <div className='md:col-span-7 space-y-2'>
                    <h3 className='text-lg sm:text-xl font-bold text-[#FFFFFF] font-["Satoshi"]'>
                      {problem.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-[#A9A9A9] leading-relaxed'>
                      {problem.summary}
                    </p>
                  </div>

                  <div className='md:col-span-4 p-3.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs text-[#888888]'>
                    <div className='font-semibold text-[#FFFFFF] text-[11px] mb-1 font-["JetBrains_Mono"] uppercase tracking-wider'>
                      Consequence
                    </div>
                    <div>{problem.impact}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. THE SOLUTION SECTION: 5 Mirrored Solutions */}
      <section id='solutions' className='py-20 md:py-28 border-b border-[#222222] bg-[#050505]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='mb-16'>
            <div className='text-xs font-semibold text-[#A9A9A9] uppercase tracking-wider font-["JetBrains_Mono"] mb-2'>
              The Control Layer
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"]'>
              One layer. Total control.
            </h2>
            <p className='text-base text-[#A9A9A9] mt-3 max-w-2xl'>
              Quirk sits between your application and every payment provider, turning complex multi-provider operations into a clean, predictable infrastructure.
            </p>
          </div>

          {/* 5 Mirrored Solution Blocks */}
          <div className='space-y-4'>
            {SOLUTIONS.map((solution) => {
              const Icon = solution.icon
              return (
                <div
                  key={solution.number}
                  className='p-6 sm:p-8 rounded-2xl bg-[#101010] border border-[#222222] hover:border-[#333333] transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center'
                >
                  <div className='md:col-span-1 flex items-center md:flex-col gap-3'>
                    <span className='font-["JetBrains_Mono"] text-xs font-bold text-[#FFFFFF]'>
                      {solution.number}
                    </span>
                    <div className='size-9 rounded-xl bg-[#161616] border border-[#222222] flex items-center justify-center text-[#FFFFFF]'>
                      <Icon className='size-4' />
                    </div>
                  </div>

                  <div className='md:col-span-7 space-y-1.5'>
                    <div className='inline-block text-[10px] font-["JetBrains_Mono"] uppercase tracking-wider text-[#A9A9A9] px-2 py-0.5 rounded bg-[#161616] border border-[#222222] mb-1'>
                      {solution.badge}
                    </div>
                    <h3 className='text-lg sm:text-xl font-bold text-[#FFFFFF] font-["Satoshi"]'>
                      {solution.title}
                    </h3>
                    <p className='text-xs sm:text-sm text-[#A9A9A9] leading-relaxed'>
                      {solution.description}
                    </p>
                  </div>

                  <div className='md:col-span-4 p-3 rounded-xl bg-[#0A0A0A] border border-[#222222] font-["JetBrains_Mono"] text-xs text-[#A9A9A9] overflow-x-auto'>
                    <div className='text-[10px] text-[#666666] mb-1'>// Quirk normalized API</div>
                    <code className='text-[#FFFFFF] text-[11px]'>{solution.codeSnippet}</code>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. TARGET CUSTOMER AUDIENCE SECTION */}
      <section className='py-20 md:py-28 border-b border-[#222222]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <div className='text-xs font-semibold text-[#A9A9A9] uppercase tracking-wider font-["JetBrains_Mono"] mb-2'>
              Target Customers
            </div>
            <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"]'>
              Built for technology businesses
            </h2>
            <p className='text-sm text-[#A9A9A9] mt-2'>
              Designed specifically for platforms and technology products where payments are deeply embedded into the customer journey.
            </p>
          </div>

          {/* Audience Selection Pills */}
          <div className='flex flex-wrap items-center justify-center gap-2 mb-8'>
            {TARGET_AUDIENCES.map((aud) => {
              const isSelected = aud.id === selectedAudience
              const Icon = aud.icon
              return (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#FFFFFF] text-[#000000] font-semibold shadow-md'
                      : 'bg-[#101010] border border-[#222222] text-[#A9A9A9] hover:text-[#FFFFFF] hover:border-[#333333]'
                  }`}
                >
                  <Icon className='size-3.5' />
                  <span>{aud.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Audience Card */}
          <div className='p-8 rounded-2xl bg-[#101010] border border-[#222222] max-w-2xl mx-auto text-center space-y-3'>
            <div className='size-12 rounded-2xl bg-[#161616] border border-[#222222] flex items-center justify-center mx-auto text-[#FFFFFF]'>
              {React.createElement(activeAudience.icon, { className: 'size-5' })}
            </div>
            <h3 className='text-xl font-bold text-[#FFFFFF] font-["Satoshi"]'>
              {activeAudience.headline}
            </h3>
            <p className='text-sm text-[#A9A9A9] leading-relaxed max-w-lg mx-auto'>
              {activeAudience.description}
            </p>
          </div>
        </div>
      </section>

      {/* 8. WHAT'S NEXT: PAYMENT INTELLIGENCE VISION */}
      <section id='roadmap' className='py-20 md:py-28 border-b border-[#222222] bg-[#050505]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='p-8 sm:p-12 rounded-3xl bg-[#0E0E0E] border border-[#262626] relative overflow-hidden'>
            <div className='flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#222222]'>
              <div>
                <div className='inline-flex items-center gap-1.5 text-[10px] font-["JetBrains_Mono"] uppercase tracking-wider text-[#A9A9A9] px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#222222] mb-2'>
                  <span className='size-1.5 rounded-full bg-[#A9A9A9]' />
                  <span>On the Roadmap · Early Access</span>
                </div>
                <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFFFF] font-["Satoshi"]'>
                  Beyond routing: Payment Intelligence
                </h2>
                <p className='text-xs sm:text-sm text-[#A9A9A9] mt-1 max-w-xl'>
                  The long-term vision: helping technology businesses understand transaction patterns, eliminate customer drop-offs, and benchmark provider reliability.
                </p>
              </div>

              <a
                href='mailto:engineering@quirk.dev?subject=Quirk%20Payment%20Intelligence%20Early%20Access'
                className='text-xs font-semibold text-[#FFFFFF] bg-[#161616] hover:bg-[#202020] border border-[#333333] px-4 py-2 rounded-full transition-all'
              >
                Request early access
              </a>
            </div>

            {/* 4 Roadmap Pillars */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {ROADMAP_ITEMS.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className='p-5 rounded-xl bg-[#0A0A0A] border border-[#222222] space-y-2'
                  >
                    <div className='flex items-center gap-2.5'>
                      <div className='size-7 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-center text-[#FFFFFF]'>
                        <Icon className='size-3.5' />
                      </div>
                      <h3 className='text-sm font-semibold text-[#FFFFFF]'>{item.title}</h3>
                    </div>
                    <p className='text-xs text-[#A9A9A9] leading-relaxed pl-9.5'>
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 9. GET STARTED MINI-SECTION & CODE SNIPPET */}
      <section id='get-started' className='py-20 md:py-28 border-b border-[#222222]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-center'>
            {/* Left Info */}
            <div className='lg:col-span-5 space-y-6'>
              <div>
                <div className='text-xs font-semibold text-[#A9A9A9] uppercase tracking-wider font-["JetBrains_Mono"] mb-2'>
                  Developer Quickstart
                </div>
                <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"]'>
                  Integrate in 4 lines of code
                </h2>
                <p className='text-sm text-[#A9A9A9] mt-3 leading-relaxed'>
                  Install the SDK, initialize with your vaulted key, and execute unified payments with normalized responses across all payment rails.
                </p>
              </div>

              {/* Install Snippet */}
              <div className='p-3.5 rounded-xl bg-[#101010] border border-[#222222] flex items-center justify-between font-["JetBrains_Mono"] text-xs'>
                <div className='flex items-center gap-2 text-[#FFFFFF]'>
                  <Terminal className='size-3.5 text-[#A9A9A9]' />
                  <span>npm install @quirk/sdk</span>
                </div>
                <button
                  onClick={copyInstallCommand}
                  className='p-1.5 rounded-md hover:bg-[#1C1C1C] text-[#A9A9A9] hover:text-[#FFFFFF] transition-colors'
                  title='Copy install command'
                >
                  {copiedInstall ? <Check className='size-3.5 text-[#22C55E]' /> : <Copy className='size-3.5' />}
                </button>
              </div>

              {/* Feature Checklist */}
              <div className='space-y-2 text-xs text-[#A9A9A9] font-["JetBrains_Mono"]'>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#22C55E]' />
                  <span>Zero vendor lock-in — bring your own keys</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#22C55E]' />
                  <span>Full TypeScript type definitions included</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#22C55E]' />
                  <span>Deterministic idempotency out of the box</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Code Box */}
            <div className='lg:col-span-7 rounded-2xl bg-[#0A0A0A] border border-[#222222] shadow-2xl overflow-hidden'>
              {/* Header with Tabs */}
              <div className='flex items-center justify-between px-4 py-3 border-b border-[#222222] bg-[#101010]'>
                <div className='flex items-center gap-1'>
                  {(['typescript', 'python', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-["JetBrains_Mono"] transition-colors ${
                        selectedLang === lang
                          ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold'
                          : 'text-[#A9A9A9] hover:text-[#FFFFFF]'
                      }`}
                    >
                      {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={copySnippet}
                  className='inline-flex items-center gap-1.5 text-xs text-[#A9A9A9] hover:text-[#FFFFFF] px-2.5 py-1 rounded-md hover:bg-[#161616] transition-colors font-["JetBrains_Mono"]'
                >
                  {copiedCode ? <Check className='size-3 text-[#22C55E]' /> : <Copy className='size-3' />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Display */}
              <div className='p-5 overflow-x-auto text-xs font-["JetBrains_Mono"] leading-relaxed text-[#E5E5E5] bg-[#080808]'>
                <pre>
                  <code>{CODE_SNIPPETS[selectedLang]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EARLY PARTNER INVITATION SECTION */}
      <section className='py-20 md:py-28 border-b border-[#222222] bg-[#050505]'>
        <div className='container max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101010] border border-[#222222] text-xs font-["JetBrains_Mono"] text-[#A9A9A9]'>
            <span className='size-1.5 rounded-full bg-[#22C55E]' />
            <span>Design Partner Program</span>
          </div>

          <h2 className='text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"] max-w-2xl mx-auto'>
            Building for companies whose payments are getting complex
          </h2>

          <p className='text-base text-[#A9A9A9] max-w-xl mx-auto leading-relaxed'>
            We’re working with a small group of early partners to shape Africa's payment infrastructure layer. If your payment stack is becoming difficult to manage, let’s talk.
          </p>

          <div className='pt-4'>
            <a
              href='mailto:engineering@quirk.dev?subject=Quirk%20Design%20Partner%20Inquiry'
              className='inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-sm px-8 py-3.5 rounded-full transition-all active:scale-[0.98] shadow-lg'
            >
              <span>Become an Early Partner</span>
              <ArrowUpRight className='size-4' />
            </a>
          </div>
        </div>
      </section>

      {/* 11. MINIMAL 3-COLUMN FOOTER */}
      <footer className='py-16 bg-[#000000] text-xs text-[#A9A9A9]'>
        <div className='container max-w-6xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#222222]'>
            {/* Brand column */}
            <div className='md:col-span-5 space-y-4'>
              <Link to='/' className='flex items-center gap-2'>
                <QuirkLogo size={22} lightMode={false} />
              </Link>
              <p className='text-xs text-[#888888] max-w-xs leading-relaxed'>
                The control layer for African payment infrastructure. Connect, normalize, monitor, and route payments with one integration.
              </p>
              <div className='flex items-center gap-2 text-[11px] font-["JetBrains_Mono"] text-[#666666]'>
                <span className='size-1.5 rounded-full bg-[#22C55E]' />
                <span>All payment rails operational</span>
              </div>
            </div>

            {/* Product Column */}
            <div className='md:col-span-2 space-y-3'>
              <div className='font-semibold text-[#FFFFFF] font-["Satoshi"]'>Product</div>
              <ul className='space-y-2'>
                <li>
                  <a href='#solutions' className='hover:text-[#FFFFFF] transition-colors'>
                    Architecture
                  </a>
                </li>
                <li>
                  <a href='#get-started' className='hover:text-[#FFFFFF] transition-colors'>
                    API Explorer
                  </a>
                </li>
                <li>
                  <a href='#roadmap' className='hover:text-[#FFFFFF] transition-colors'>
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/T9ner/quirk'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-[#FFFFFF] transition-colors'
                  >
                    SDK Reference
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className='md:col-span-2 space-y-3'>
              <div className='font-semibold text-[#FFFFFF] font-["Satoshi"]'>Company</div>
              <ul className='space-y-2'>
                <li>
                  <Link to='/insights' className='hover:text-[#FFFFFF] transition-colors'>
                    Research & Insights
                  </Link>
                </li>
                <li>
                  <a
                    href='mailto:engineering@quirk.dev'
                    className='hover:text-[#FFFFFF] transition-colors'
                  >
                    Contact Engineering
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/T9ner/quirk'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-[#FFFFFF] transition-colors'
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className='md:col-span-3 space-y-3'>
              <div className='font-semibold text-[#FFFFFF] font-["Satoshi"]'>Legal & Security</div>
              <ul className='space-y-2'>
                <li>
                  <Link to='/privacy' className='hover:text-[#FFFFFF] transition-colors'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to='/terms' className='hover:text-[#FFFFFF] transition-colors'>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <span className='text-[#666666]'>AES-256 Hardware Enclave Vault</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#666666]'>
            <div>
              &copy; {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.
            </div>
            <div className='font-["JetBrains_Mono"] text-[11px]'>
              One connection. Every payment system.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
