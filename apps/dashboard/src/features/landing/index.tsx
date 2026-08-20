import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Route,
  Layers,
  Activity,
  Menu,
  X,
  CreditCard,
  Building2,
  SlidersHorizontal,
  ExternalLink,
  Code2,
  Database,
  Network,
  Cpu,
  Lock,
  Globe,
  TrendingDown,
  FileSpreadsheet,
  PlusCircle,
  Compass,
  LineChart,
  Target,
  Sparkles,
} from 'lucide-react'
import { QuirkLogo } from '@/components/quirk-logo'
import { IconGithub } from '@/assets/brand-icons/icon-github'

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

// The 5 Progressive Scaling Challenges
const PROBLEM_STEPS = [
  {
    step: '01',
    highlight: 'One provider becomes two.',
    description: 'Adding a secondary gateway introduces a second API, a second webhook handler, and duplicate failure logic in your application.',
  },
  {
    step: '02',
    highlight: 'One payment method becomes five.',
    description: 'Customers in different regions expect cards, virtual bank accounts, USSD, or mobile money. Each rail requires custom checkout handling.',
  },
  {
    step: '03',
    highlight: 'Failed payments create support tickets.',
    description: 'When an upstream switch degrades, payments fail silently without automatic failover. Customers drop off at the point of payment.',
  },
  {
    step: '04',
    highlight: 'New countries require new integrations.',
    description: 'Expanding from Nigeria to Kenya, Ghana, or South Africa means learning new local rail requirements and writing fresh integration code.',
  },
  {
    step: '05',
    highlight: 'Reconciliation turns into manual spreadsheet work.',
    description: 'Different settlement schedules and fragmented CSV exports leave finance teams without a single source of truth for balances.',
  },
]

// 4 Core Capabilities
const CAPABILITIES = [
  {
    tag: 'CONNECT',
    title: 'One integration for multiple payment providers',
    description: 'Use @quirk/sdk to access cards, bank transfers, virtual accounts, USSD, and mobile money without writing custom provider adapters.',
    icon: Code2,
  },
  {
    tag: 'NORMALIZE',
    title: 'Consistent payment states, APIs, and webhooks',
    description: 'Standard request payloads, unified charge statuses, and HMAC-SHA256 signature verification across every provider.',
    icon: Layers,
  },
  {
    tag: 'MONITOR',
    title: 'Visibility into gateway health and latency',
    description: 'Out-of-band health probing checks latency and response codes 24/7, catching upstream degradations before customer transactions fail.',
    icon: Activity,
  },
  {
    tag: 'OPTIMIZE',
    title: 'Automated failover and reliable routing',
    description: 'Sub-200ms route switching moves payment sessions to working alternate rails during outages, using idempotent keys to prevent double charges.',
    icon: Route,
  },
]

// Target Customer Audience Segments
const TARGET_AUDIENCES = [
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    icon: Building2,
    headline: 'Multi-merchant payouts and split settlement',
    description: 'Accept customer payments across African rails, hold funds in dedicated accounts, and route vendor payouts to local banks and mobile money wallets.',
  },
  {
    id: 'fintechs',
    label: 'Fintechs',
    icon: ShieldCheck,
    headline: 'Multi-provider routing with direct gateway keys',
    description: 'Use your direct merchant accounts, store API credentials in hardware enclaves, and automate failover when primary switches slow down.',
  },
  {
    id: 'commerce',
    label: 'Commerce Platforms',
    icon: CreditCard,
    headline: 'Localized checkout options in one integration',
    description: 'Show relevant payment rails based on customer geography while keeping a single order reconciliation stream in your backend.',
  },
  {
    id: 'saas',
    label: 'SaaS Platforms',
    icon: SlidersHorizontal,
    headline: 'Recurring billing and multi-currency accounts',
    description: 'Charge subscriptions in NGN, KES, GHS, or USD with retry schedules and standard webhook events.',
  },
  {
    id: 'tech',
    label: 'Payment-Enabled Tech',
    icon: Database,
    headline: 'Embedded payment plumbing built for uptime',
    description: 'For software teams where payments are core to the application and payment downtime directly costs revenue.',
  },
]

// Intelligence Vision Roadmap Items
const VISION_PILLARS = [
  {
    title: 'Payment Reliability',
    desc: 'Automated multi-rail switching that keeps checkouts open when individual bank networks drop.',
    icon: ShieldCheck,
  },
  {
    title: 'Transaction Intelligence',
    desc: 'Inspection of decline codes to separate insufficient funds from network drops and card scheme errors.',
    icon: LineChart,
  },
  {
    title: 'Provider Performance',
    desc: 'Live latency and success rate benchmarks across African payment switches.',
    icon: Target,
  },
  {
    title: 'Failure Detection',
    desc: 'Health probing that flags deteriorating bank routes before transactions fail.',
    icon: Activity,
  },
  {
    title: 'Payment Optimization',
    desc: 'Routing rules that direct transactions through the lowest fee verified channel.',
    icon: Sparkles,
  },
  {
    title: 'Smarter Infrastructure',
    desc: 'Double-entry ledgers tracking multi-currency balances across NGN, KES, GHS, and USD.',
    icon: Network,
  },
]

// Monochromatic Minimal Code Snippets
const CODE_SNIPPETS = {
  typescript: `import { Quirk } from '@quirk/sdk'

// Initialize Quirk with your secret key
const quirk = new Quirk({
  secretKey: process.env.QUIRK_SECRET_KEY
})

// Create a payment with automatic failover
const payment = await quirk.payments.create({
  amount: 25000,
  currency: 'NGN',
  customer: {
    email: 'alex@company.dev',
    name: 'Alex Okafor'
  },
  strategy: 'dynamic_failover'
})

console.log('Checkout URL:', payment.checkout_url)
console.log('Routed Rail:', payment.routed_provider)`,
  python: `from quirk import Quirk
import os

# Initialize Quirk client
quirk = Quirk(secret_key=os.environ.get("QUIRK_SECRET_KEY"))

# Create payment with automatic failover
payment = quirk.payments.create(
    amount=25000,
    currency="NGN",
    customer={"email": "alex@company.dev", "name": "Alex Okafor"},
    strategy="dynamic_failover"
)

print(f"Checkout URL: {payment.checkout_url}")
print(f"Routed Rail: {payment.routed_provider}")`,
  curl: `curl -X POST https://api.quirk.dev/v1/payments \\
  -H "Authorization: Bearer qrk_secret_9f81a..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "NGN",
    "customer": { "email": "alex@company.dev" },
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
    <div className='min-h-screen bg-[#FFFFFF] font-sans text-[#080808] antialiased selection:bg-[#080808] selection:text-[#FFFFFF]'>
      {/* 1. MINIMAL STICKY NAVIGATION */}
      <header className='sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-[#FFFFFF]/90 backdrop-blur-md'>
        <div className='container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2.5 transition-opacity hover:opacity-80'>
            <QuirkLogo size={24} lightMode={true} />
          </Link>

          {/* Minimal Desktop Nav */}
          <nav className='hidden md:flex items-center gap-8 text-xs font-medium text-[#666666]'>
            <a href='#product' className='transition-colors hover:text-[#080808]'>
              Product
            </a>
            <a href='#developers' className='transition-colors hover:text-[#080808]'>
              Developers
            </a>
            <a href='#vision' className='transition-colors hover:text-[#080808]'>
              Vision
            </a>
            <Link to='/insights' className='transition-colors hover:text-[#080808]'>
              Insights
            </Link>
          </nav>

          {/* Right Action Group */}
          <div className='hidden sm:flex items-center gap-3'>
            <a
              href='https://github.com/T9ner/quirk'
              target='_blank'
              rel='noopener noreferrer'
              className='text-[#666666] hover:text-[#080808] transition-colors p-1.5 rounded-full hover:bg-[#F7F7F5] flex items-center justify-center'
              title='GitHub Repository'
              aria-label='GitHub Repository'
            >
              <IconGithub className='size-4' />
            </a>
            <a
              href='mailto:dbosshonour@gmail.com?subject=Quirk%20Inquiry'
              className='text-xs font-medium text-[#080808] bg-[#FAFAFA] hover:bg-[#F0F0F0] border border-[#E5E5E5] px-4 py-2 rounded-full transition-all active:scale-[0.98]'
            >
              Talk to us
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-[#080808] hover:text-[#666666]'
            aria-label='Toggle Menu'
          >
            {mobileMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className='md:hidden border-b border-[#E5E5E5] bg-[#FFFFFF] px-4 py-6 space-y-4 text-sm'>
            <a
              href='#product'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#666666] hover:text-[#080808]'
            >
              Product
            </a>
            <a
              href='#developers'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#666666] hover:text-[#080808]'
            >
              Developers
            </a>
            <a
              href='#vision'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#666666] hover:text-[#080808]'
            >
              Vision
            </a>
            <Link
              to='/insights'
              onClick={() => setMobileMenuOpen(false)}
              className='block text-[#666666] hover:text-[#080808]'
            >
              Insights
            </Link>
            <a
              href='https://github.com/T9ner/quirk'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setMobileMenuOpen(false)}
              className='flex items-center gap-2 text-[#666666] hover:text-[#080808]'
            >
              <IconGithub className='size-4' />
              <span>GitHub</span>
            </a>
            <div className='pt-4 border-t border-[#E5E5E5]'>
              <a
                href='mailto:dbosshonour@gmail.com?subject=Quirk%20Inquiry'
                className='block text-center text-xs font-semibold text-[#FFFFFF] bg-[#080808] py-2.5 rounded-full'
              >
                Talk to us
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className='relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#FFFFFF]'>
        {/* Subtle Orbital Background Metaphor */}
        <div className='absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-60'>
          <div className='absolute size-[600px] md:size-[900px] rounded-full border border-[#EBEBE8] quirk-orbit-slow' />
          <div className='absolute size-[900px] md:size-[1300px] rounded-full border border-[#F2F2EF] quirk-orbit-reverse' />
          <div className='absolute size-[1200px] md:size-[1700px] rounded-full border border-[#F7F7F5]' />
        </div>

        <div className='container max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10'>
          {/* Label */}
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E5E5E5] text-xs font-["JetBrains_Mono"] text-[#666666] mb-8'>
            <span className='size-1.5 rounded-full bg-[#080808]' />
            <span className='tracking-wider uppercase text-[11px] font-semibold text-[#080808]'>
              Payment Infrastructure
            </span>
          </div>

          {/* Main Headline */}
          <h1 className='text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#080808] font-["Satoshi"] max-w-4xl mx-auto leading-[1.05]'>
            Payment infrastructure, <br className='hidden sm:inline' />
            without the complexity.
          </h1>

          {/* Supporting Text */}
          <p className='mt-8 text-base sm:text-lg md:text-xl text-[#666666] max-w-2xl mx-auto font-normal leading-relaxed'>
            Quirk gives African technology companies one unified layer to connect, manage, and scale their payment infrastructure.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5'>
            <a
              href='#developers'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.98] shadow-sm'
            >
              <span>Explore the API</span>
              <ArrowRight className='size-4' />
            </a>
            <a
              href='mailto:dbosshonour@gmail.com?subject=Quirk%20Inquiry'
              className='w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F7F7F5] border border-[#E5E5E5] text-[#080808] font-medium text-sm px-7 py-3.5 rounded-full transition-all active:scale-[0.98]'
            >
              <span>Talk to us</span>
            </a>
          </div>

          {/* 3. HERO ORBITAL INFRASTRUCTURE VISUAL */}
          <div className='mt-16 md:mt-24 max-w-4xl mx-auto relative'>
            <div className='p-6 sm:p-10 rounded-3xl bg-[#FAFAFA] border border-[#E5E5E5] shadow-sm relative overflow-hidden text-left'>
              {/* Top metadata bar */}
              <div className='flex items-center justify-between pb-6 border-b border-[#EBEBE8]'>
                <div className='flex items-center gap-2 font-["JetBrains_Mono"] text-xs text-[#666666]'>
                  <span className='size-1.5 rounded-full bg-[#080808]' />
                  <span>Orbital Routing Matrix</span>
                </div>
                <span className='text-[11px] font-["JetBrains_Mono"] text-[#888888]'>
                  Many systems, one connection
                </span>
              </div>

              {/* Topology SVG Network Diagram */}
              <div className='py-10 sm:py-14 relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4'>
                {/* Left Node: Client App */}
                <div className='w-full md:w-56 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xs text-center relative z-10'>
                  <div className='size-9 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mx-auto mb-2 text-[#080808]'>
                    <Cpu className='size-4' />
                  </div>
                  <div className='font-bold text-sm text-[#080808] font-["Satoshi"]'>Your Application</div>
                  <div className='text-[10px] text-[#666666] font-["JetBrains_Mono"] mt-0.5'>
                    Marketplace, Fintech, SaaS
                  </div>
                </div>

                {/* Center SVG Orbital Lines */}
                <div className='w-full md:flex-1 h-20 md:h-32 relative flex items-center justify-center'>
                  <svg className='w-full h-full' viewBox='0 0 300 100' fill='none'>
                    <path
                      d='M 0 50 C 75 10, 100 50, 150 50 C 200 50, 225 10, 300 15'
                      stroke='#E0E0DC'
                      strokeWidth='1.5'
                      fill='none'
                    />
                    <path
                      d='M 0 50 C 75 50, 100 50, 150 50 C 200 50, 225 50, 300 50'
                      stroke='#080808'
                      strokeWidth='1.5'
                      className='quirk-flow-line'
                      fill='none'
                    />
                    <path
                      d='M 0 50 C 75 90, 100 50, 150 50 C 200 50, 225 90, 300 85'
                      stroke='#E0E0DC'
                      strokeWidth='1.5'
                      fill='none'
                    />
                  </svg>

                  {/* Central Floating Quirk Core Node */}
                  <div className='absolute size-12 rounded-full bg-[#080808] text-[#FFFFFF] flex items-center justify-center shadow-md border-2 border-[#FFFFFF] z-20'>
                    <span className='font-bold text-xs font-["Satoshi"]'>Q</span>
                  </div>
                </div>

                {/* Right Nodes: Payment Rails */}
                <div className='w-full md:w-60 space-y-2 relative z-10'>
                  <div className='p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xs flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      <span className='size-1.5 rounded-full bg-[#080808]' />
                      <span className='font-semibold text-[#080808]'>Paystack Direct</span>
                    </div>
                    <span className='text-[10px] font-["JetBrains_Mono"] text-[#888888]'>Cards and Accounts</span>
                  </div>
                  <div className='p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xs flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      <span className='size-1.5 rounded-full bg-[#080808]' />
                      <span className='font-semibold text-[#080808]'>Flutterwave</span>
                    </div>
                    <span className='text-[10px] font-["JetBrains_Mono"] text-[#888888]'>Pan-Africa</span>
                  </div>
                  <div className='p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xs flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      <span className='size-1.5 rounded-full bg-[#080808]' />
                      <span className='font-semibold text-[#080808]'>M-Pesa STK</span>
                    </div>
                    <span className='text-[10px] font-["JetBrains_Mono"] text-[#888888]'>Mobile Money</span>
                  </div>
                </div>
              </div>

              {/* Bottom tag */}
              <div className='pt-4 border-t border-[#EBEBE8] flex items-center justify-between text-[11px] font-["JetBrains_Mono"] text-[#666666]'>
                <span>Direct merchant provider keys</span>
                <span>Hardware enclave key vault</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SLIM RAILS TICKER */}
      <section className='border-y border-[#E5E5E5] bg-[#FAFAFA] py-3.5 overflow-hidden relative'>
        <div className='quirk-marquee-container relative flex overflow-x-hidden'>
          <div className='quirk-marquee-track flex shrink-0 items-center gap-6 pr-6'>
            {[...ECOSYSTEM_RAILS, ...ECOSYSTEM_RAILS].map((rail, idx) => (
              <div
                key={idx}
                className='flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-xs shrink-0 shadow-2xs'
              >
                <div className='size-5 rounded bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center font-["JetBrains_Mono"] font-bold text-[8px] text-[#080808]'>
                  {rail.code}
                </div>
                <span className='font-semibold text-[#080808]'>{rail.name}</span>
                <span className='text-[#CCCCCC]'>·</span>
                <span className='text-[11px] text-[#666666]'>{rail.type}</span>
                <span className='inline-flex items-center gap-1 text-[10px] font-["JetBrains_Mono"] text-[#888888] pl-1'>
                  <span className='size-1 rounded-full bg-[#080808]' />
                  {rail.ping}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SECTION: THE PROBLEM */}
      <section className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FFFFFF]'>
        <div className='container max-w-4xl mx-auto px-4 sm:px-6'>
          {/* Section Header */}
          <div className='mb-20'>
            <div className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-["JetBrains_Mono"] mb-3'>
              The problem
            </div>
            <h2 className='text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#080808] font-["Satoshi"] leading-tight'>
              Payments get complicated <br className='hidden sm:inline' />
              as you grow.
            </h2>
            <p className='text-base sm:text-lg text-[#666666] mt-4 max-w-xl leading-relaxed'>
              What started as a single API key turns into fragmented checkout logic, silent drop-offs, and manual reconciliation.
            </p>
          </div>

          {/* Progressive Statements with Orbital Route Flow */}
          <div className='relative pl-6 sm:pl-10 space-y-12 border-l border-[#E5E5E5]'>
            {PROBLEM_STEPS.map((prob) => (
              <div key={prob.step} className='relative group'>
                {/* Node dot on the vertical route line */}
                <div className='absolute -left-[31px] sm:-left-[47px] top-1 size-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#080808] flex items-center justify-center' />

                <div className='space-y-1.5'>
                  <div className='text-xs font-["JetBrains_Mono"] font-semibold text-[#888888]'>
                    PHASE {prob.step}
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold text-[#080808] font-["Satoshi"]'>
                    {prob.highlight}
                  </h3>
                  <p className='text-sm sm:text-base text-[#666666] max-w-2xl leading-relaxed'>
                    {prob.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION: THE QUIRK LAYER */}
      <section id='product' className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6 text-center'>
          <div className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-["JetBrains_Mono"] mb-3'>
            The Quirk layer
          </div>
          <h2 className='text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-["Satoshi"]'>
            A clean network between your product and every rail.
          </h2>
          <p className='text-sm sm:text-base text-[#666666] mt-3 max-w-xl mx-auto'>
            Quirk acts as the central control plane, normalizing requests, routing sessions, and vaulting provider keys.
          </p>

          {/* Floating Infrastructure Visual */}
          <div className='mt-16 p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm max-w-4xl mx-auto text-left relative overflow-hidden'>
            {/* Top Level: Application */}
            <div className='p-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center max-w-md mx-auto'>
              <div className='text-[11px] font-["JetBrains_Mono"] uppercase tracking-wider text-[#666666] mb-1'>
                Application layer
              </div>
              <div className='font-bold text-base text-[#080808] font-["Satoshi"]'>
                YOUR APPLICATION CODE
              </div>
              <div className='text-xs text-[#888888] mt-0.5'>Single SDK client integration</div>
            </div>

            {/* Connecting Vertical Flow */}
            <div className='h-16 flex items-center justify-center relative'>
              <div className='w-px h-full bg-[#E5E5E5]' />
              <div className='absolute size-2 rounded-full bg-[#080808]' />
            </div>

            {/* Central Node: Quirk */}
            <div className='p-8 rounded-3xl bg-[#080808] text-[#FFFFFF] text-center max-w-xl mx-auto shadow-xl relative'>
              <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] text-[10px] font-["JetBrains_Mono"] text-[#FFFFFF] mb-3'>
                <Lock className='size-3 text-[#FFFFFF]' />
                <span>AES-256 hardware enclave vault</span>
              </div>
              <h3 className='text-2xl font-bold font-["Satoshi"] tracking-tight'>
                QUIRK CONTROL PLANE
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-[#222222] text-xs font-["JetBrains_Mono"]'>
                <div className='p-2 rounded-lg bg-[#141414] border border-[#222222]'>
                  <div className='text-[#FFFFFF] font-semibold'>Connect</div>
                  <div className='text-[10px] text-[#888888]'>1 SDK</div>
                </div>
                <div className='p-2 rounded-lg bg-[#141414] border border-[#222222]'>
                  <div className='text-[#FFFFFF] font-semibold'>Normalize</div>
                  <div className='text-[10px] text-[#888888]'>HMAC schema</div>
                </div>
                <div className='p-2 rounded-lg bg-[#141414] border border-[#222222]'>
                  <div className='text-[#FFFFFF] font-semibold'>Monitor</div>
                  <div className='text-[10px] text-[#888888]'>24/7 probing</div>
                </div>
                <div className='p-2 rounded-lg bg-[#141414] border border-[#222222]'>
                  <div className='text-[#FFFFFF] font-semibold'>Route</div>
                  <div className='text-[10px] text-[#888888]'>Sub-200ms</div>
                </div>
              </div>
            </div>

            {/* Connecting Vertical Flow */}
            <div className='h-16 flex items-center justify-center relative'>
              <div className='w-px h-full bg-[#E5E5E5]' />
              <div className='absolute size-2 rounded-full bg-[#080808]' />
            </div>

            {/* Bottom Level: Payment Rails */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto'>
              <div className='p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-center'>
                <div className='font-bold text-xs text-[#080808]'>Paystack and Monnify</div>
                <div className='text-[10px] text-[#666666] font-["JetBrains_Mono"] mt-1'>
                  Cards and dynamic accounts
                </div>
              </div>
              <div className='p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-center'>
                <div className='font-bold text-xs text-[#080808]'>Flutterwave</div>
                <div className='text-[10px] text-[#666666] font-["JetBrains_Mono"] mt-1'>
                  Pan-Africa and USD
                </div>
              </div>
              <div className='p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-center'>
                <div className='font-bold text-xs text-[#080808]'>M-Pesa and Squad</div>
                <div className='text-[10px] text-[#666666] font-["JetBrains_Mono"] mt-1'>
                  Mobile money and USSD
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION: WHAT QUIRK DOES */}
      <section className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FFFFFF]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='mb-16'>
            <div className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-["JetBrains_Mono"] mb-3'>
              Core capabilities
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#080808] font-["Satoshi"]'>
              What Quirk does
            </h2>
            <p className='text-base text-[#666666] mt-2 max-w-lg'>
              Four foundational tools that remove payment complexity for growing software engineering teams.
            </p>
          </div>

          {/* 4 Minimalist Spacious Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.tag}
                  className='p-8 rounded-3xl bg-[#FAFAFA] border border-[#E5E5E5] hover:border-[#CCCCCC] transition-all space-y-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='text-xs font-["JetBrains_Mono"] font-bold text-[#080808] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E5E5E5]'>
                      {cap.tag}
                    </div>
                    <div className='size-8 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] flex items-center justify-center text-[#080808]'>
                      <Icon className='size-4' />
                    </div>
                  </div>

                  <h3 className='text-xl font-bold text-[#080808] font-["Satoshi"] leading-snug'>
                    {cap.title}
                  </h3>

                  <p className='text-sm text-[#666666] leading-relaxed'>
                    {cap.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 8. SECTION: WHO IT IS FOR */}
      <section className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <div className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-["JetBrains_Mono"] mb-3'>
              Target customers
            </div>
            <h2 className='text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-["Satoshi"]'>
              Built for products with embedded payments.
            </h2>
            <p className='text-sm sm:text-base text-[#666666] mt-4 leading-relaxed'>
              Quirk is built for software companies whose payment infrastructure becomes increasingly complex as transaction volume grows.
            </p>
          </div>

          {/* Interactive Audience Pills */}
          <div className='flex flex-wrap items-center justify-center gap-2 mb-10'>
            {TARGET_AUDIENCES.map((aud) => {
              const isSelected = aud.id === selectedAudience
              const Icon = aud.icon
              return (
                <button
                  key={aud.id}
                  onClick={() => setSelectedAudience(aud.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#080808] text-[#FFFFFF] font-semibold shadow-sm'
                      : 'bg-[#FFFFFF] border border-[#E5E5E5] text-[#666666] hover:text-[#080808] hover:border-[#CCCCCC]'
                  }`}
                >
                  <Icon className='size-3.5' />
                  <span>{aud.label}</span>
                </button>
              )
            })}
          </div>

          {/* Active Audience Card */}
          <div className='p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] max-w-2xl mx-auto text-center space-y-4 shadow-xs'>
            <div className='size-12 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#080808]'>
              {React.createElement(activeAudience.icon, { className: 'size-5' })}
            </div>
            <h3 className='text-2xl font-bold text-[#080808] font-["Satoshi"]'>
              {activeAudience.headline}
            </h3>
            <p className='text-sm sm:text-base text-[#666666] leading-relaxed max-w-lg mx-auto'>
              {activeAudience.description}
            </p>
          </div>
        </div>
      </section>

      {/* 9. SECTION: THE BIGGER VISION */}
      <section id='vision' className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FFFFFF]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          {/* Deep Dark Cosmic Element Against the White Page */}
          <div className='p-8 sm:p-14 md:p-20 rounded-3xl bg-[#080808] text-[#FFFFFF] relative overflow-hidden shadow-2xl'>
            <div className='absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 size-[500px] rounded-full border border-[#222222] pointer-events-none quirk-orbit-slow opacity-40' />

            <div className='relative z-10 max-w-3xl'>
              <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-xs font-["JetBrains_Mono"] text-[#A9A9A9] mb-6'>
                <span className='size-1.5 rounded-full bg-[#FFFFFF]' />
                <span>Roadmap and early access</span>
              </div>

              <h2 className='text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] font-["Satoshi"] leading-tight'>
                Payments are more than transactions.
              </h2>

              <p className='text-base sm:text-lg text-[#A9A9A9] mt-6 leading-relaxed'>
                Every transaction record contains diagnostic data about authorization speed, bank uptime, and drop-offs. Quirk's roadmap focuses on turning this data into failure detection and routing rules.
              </p>

              {/* 6 Vision Pillars Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12 pt-10 border-t border-[#222222]'>
                {VISION_PILLARS.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className='p-5 rounded-2xl bg-[#101010] border border-[#222222] space-y-2'
                    >
                      <div className='flex items-center gap-2.5 text-[#FFFFFF]'>
                        <div className='size-6 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center'>
                          <Icon className='size-3.5' />
                        </div>
                        <h4 className='font-bold text-xs font-["Satoshi"]'>{item.title}</h4>
                      </div>
                      <p className='text-[11px] text-[#888888] leading-relaxed'>
                        {item.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. DEVELOPER SECTION */}
      <section id='developers' className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
        <div className='container max-w-5xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
            {/* Left Info */}
            <div className='lg:col-span-5 space-y-6'>
              <div>
                <div className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-["JetBrains_Mono"] mb-3'>
                  Developer platform
                </div>
                <h2 className='text-3xl sm:text-4xl font-bold tracking-tight text-[#080808] font-["Satoshi"]'>
                  Built for developers.
                </h2>
                <p className='text-sm text-[#666666] mt-3 leading-relaxed'>
                  Install the SDK, initialize with your secret key, and charge across any payment rail with standard responses.
                </p>
              </div>

              {/* Install Snippet */}
              <div className='p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] flex items-center justify-between font-["JetBrains_Mono"] text-xs shadow-2xs'>
                <div className='flex items-center gap-2 text-[#080808]'>
                  <Terminal className='size-3.5 text-[#666666]' />
                  <span>npm install @quirk/sdk</span>
                </div>
                <button
                  onClick={copyInstallCommand}
                  className='p-1.5 rounded-md hover:bg-[#F7F7F5] text-[#666666] hover:text-[#080808] transition-colors'
                  title='Copy install command'
                >
                  {copiedInstall ? <Check className='size-3.5 text-[#080808]' /> : <Copy className='size-3.5' />}
                </button>
              </div>

              {/* Checklist */}
              <div className='space-y-2 text-xs text-[#666666] font-["JetBrains_Mono"]'>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#080808]' />
                  <span>Use your own direct merchant accounts</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#080808]' />
                  <span>TypeScript type definitions included</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Check className='size-3.5 text-[#080808]' />
                  <span>Deterministic idempotency to prevent duplicate charges</span>
                </div>
              </div>
            </div>

            {/* Right Monochromatic Minimal Code Block */}
            <div className='lg:col-span-7 rounded-3xl bg-[#080808] border border-[#222222] shadow-xl overflow-hidden text-[#FFFFFF]'>
              {/* Header with Monochromatic Tabs */}
              <div className='flex items-center justify-between px-5 py-3.5 border-b border-[#222222] bg-[#101010]'>
                <div className='flex items-center gap-1.5'>
                  {(['typescript', 'python', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-["JetBrains_Mono"] transition-colors ${
                        selectedLang === lang
                          ? 'bg-[#222222] text-[#FFFFFF] font-bold'
                          : 'text-[#888888] hover:text-[#FFFFFF]'
                      }`}
                    >
                      {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={copySnippet}
                  className='inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#FFFFFF] px-2.5 py-1 rounded-md hover:bg-[#1A1A1A] transition-colors font-["JetBrains_Mono"]'
                >
                  {copiedCode ? <Check className='size-3 text-[#FFFFFF]' /> : <Copy className='size-3' />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Monochromatic Code Text */}
              <div className='p-6 overflow-x-auto text-xs font-["JetBrains_Mono"] leading-relaxed text-[#E5E5E5] bg-[#0A0A0A]'>
                <pre>
                  <code>{CODE_SNIPPETS[selectedLang]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. EARLY ACCESS / DESIGN PARTNERS */}
      <section className='py-24 md:py-36 border-b border-[#E5E5E5] bg-[#FFFFFF]'>
        <div className='container max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E5E5E5] text-xs font-["JetBrains_Mono"] text-[#666666]'>
            <span className='size-1.5 rounded-full bg-[#080808]' />
            <span>Design partners</span>
          </div>

          <h2 className='text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#080808] font-["Satoshi"] max-w-2xl mx-auto leading-tight'>
            Building a product with complex payment requirements?
          </h2>

          <p className='text-base sm:text-lg text-[#666666] max-w-xl mx-auto leading-relaxed'>
            We are working with engineering teams to build the infrastructure they need. If you manage multiple payment providers, talk to us.
          </p>

          <div className='pt-4'>
            <a
              href='mailto:dbosshonour@gmail.com?subject=Quirk%20Design%20Partner%20Inquiry'
              className='inline-flex items-center gap-2 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-sm px-8 py-4 rounded-full transition-all active:scale-[0.98] shadow-sm'
            >
              <span>Talk to us</span>
              <ArrowUpRight className='size-4' />
            </a>
          </div>
        </div>
      </section>

      {/* 12. CLEAN WHITE 3-COLUMN FOOTER */}
      <footer className='py-16 bg-[#FFFFFF] text-xs text-[#666666]'>
        <div className='container max-w-6xl mx-auto px-4 sm:px-6'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5E5E5]'>
            {/* Brand column */}
            <div className='md:col-span-5 space-y-4'>
              <Link to='/' className='flex items-center gap-2'>
                <QuirkLogo size={22} lightMode={true} />
              </Link>
              <p className='text-xs text-[#888888] max-w-xs leading-relaxed'>
                The payment infrastructure layer for African technology companies. Connect, manage, and scale with one integration.
              </p>
              <div className='flex items-center gap-2 text-[11px] font-["JetBrains_Mono"] text-[#888888]'>
                <span className='size-1.5 rounded-full bg-[#080808]' />
                <span>One connection. Every payment system.</span>
              </div>
            </div>

            {/* Product Column */}
            <div className='md:col-span-2 space-y-3'>
              <div className='font-semibold text-[#080808] font-["Satoshi"]'>Product</div>
              <ul className='space-y-2'>
                <li>
                  <a href='#product' className='hover:text-[#080808] transition-colors'>
                    Quirk layer
                  </a>
                </li>
                <li>
                  <a href='#developers' className='hover:text-[#080808] transition-colors'>
                    API and SDK
                  </a>
                </li>
                <li>
                  <a href='#vision' className='hover:text-[#080808] transition-colors'>
                    Vision
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/T9ner/quirk'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-[#080808] transition-colors'
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className='md:col-span-2 space-y-3'>
              <div className='font-semibold text-[#080808] font-["Satoshi"]'>Company</div>
              <ul className='space-y-2'>
                <li>
                  <Link to='/insights' className='hover:text-[#080808] transition-colors'>
                    Research and insights
                  </Link>
                </li>
                <li>
                  <a
                    href='mailto:dbosshonour@gmail.com'
                    className='hover:text-[#080808] transition-colors'
                  >
                    Contact engineering
                  </a>
                </li>
                <li>
                  <a
                    href='mailto:dbosshonour@gmail.com?subject=Quirk%20Design%20Partner%20Inquiry'
                    className='hover:text-[#080808] transition-colors'
                  >
                    Design partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className='md:col-span-3 space-y-3'>
              <div className='font-semibold text-[#080808] font-["Satoshi"]'>Legal and security</div>
              <ul className='space-y-2'>
                <li>
                  <Link to='/privacy' className='hover:text-[#080808] transition-colors'>
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link to='/terms' className='hover:text-[#080808] transition-colors'>
                    Terms of service
                  </Link>
                </li>
                <li>
                  <span className='text-[#888888]'>AES-256 hardware security enclave</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#888888]'>
            <div>
              &copy; {new Date().getFullYear()} Quirk Infrastructure Inc. All rights reserved.
            </div>
            <div className='font-["JetBrains_Mono"] text-[11px] text-[#080808]'>
              QUIRK
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
