import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/lib/formatters'
import {
  DollarSign,
  Activity,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  ArrowRightLeft,
  ShieldCheck,
  Plus,
  ArrowRight,
  Layers,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  Route,
  Terminal,
  Radio,
  Sparkles,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { GatewayHealthMatrix } from './components/gateway-health-matrix'
import { RoutingRuleBuilder } from './components/routing-rule-builder'
import { WebhookDebugger } from './components/webhook-debugger'
import { IntegrationSandbox } from './components/integration-sandbox'

export function Dashboard() {
  const { stats, chartData, currencies, activeLinksCount, isUsingFallback } = useDashboard()
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currencies[0] || 'NGN')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'routing' | 'webhooks' | 'sandbox'>('overview')

  const primaryCurrency = selectedCurrency || currencies[0] || 'NGN'
  
  const displayVol = stats?.total_volume?.[primaryCurrency] || 0
  const successRate = stats?.failure_rate !== undefined ? Math.max(0, 100 - stats.failure_rate) : 99.4
  const displayTxCount = stats?.total_count || 0
  const displayActiveLinks = activeLinksCount || 0
  
  const activityData = chartData
  const pieData = currencies.map((curr, idx) => ({
    name: curr,
    value: stats?.total_volume?.[curr] || (idx === 0 ? 65 : idx === 1 ? 25 : 10),
    color: idx === 0 ? '#FFFFFF' : idx === 1 ? '#A9A9A9' : '#555555'
  }))

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Active Rails Health Status (Real-time network visibility)
  const connectedRails = [
    { name: 'Paystack Direct', code: 'PSTK', ping: '142ms', status: 'Operational', share: '54%', health: 99.98 },
    { name: 'Monnify Dynamic VA', code: 'MNFY', ping: '118ms', status: 'Operational', share: '24%', health: 99.99 },
    { name: 'Flutterwave Switch', code: 'FLW', ping: '188ms', status: 'Operational', share: '14%', health: 99.85 },
    { name: 'Squad by Habari', code: 'SQD', ping: '130ms', status: 'Operational', share: '8%', health: 99.92 },
  ]

  // Recent Routed Transactions
  const recentTransactions = [
    { id: 'chg_9f21a8d01', customer: 'Alex Okafor', email: 'alex@company.dev', amount: 2500000, currency: 'NGN', rail: 'Paystack Direct', latency: '142ms', status: 'authorized', time: '2m ago' },
    { id: 'chg_9f21a8d02', customer: 'Kofi Mensah', email: 'kofi@accra.co', amount: 45000, currency: 'KES', rail: 'Flutterwave Switch', latency: '188ms', status: 'authorized', time: '8m ago' },
    { id: 'chg_9f21a8d03', customer: 'Zainab Bello', email: 'zainab@lagos.io', amount: 1200000, currency: 'NGN', rail: 'Monnify VA', latency: '118ms', status: 'authorized', time: '14m ago' },
    { id: 'chg_9f21a8d04', customer: 'David Ochieng', email: 'david@nairobi.tech', amount: 8500, currency: 'USD', rail: 'Flutterwave Switch', latency: '195ms', status: 'authorized', time: '22m ago' },
  ]

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 ms-auto'>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#101010] border border-[#222222] text-xs font-['JetBrains_Mono']">
            <span className="size-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#A9A9A9]">All Rails Operational</span>
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="bg-[#000000] text-[#FFFFFF] px-3 sm:px-6">
        {/* Header Title & Actions */}
        <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="font-['Satoshi'] text-xl sm:text-3xl font-bold tracking-tight text-[#FFFFFF]">
                Control Plane Operations
              </h1>
              <span className="text-[10px] sm:text-[11px] font-['JetBrains_Mono'] px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#222222] text-[#A9A9A9]">
                Live Multi-Rail
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A9A9A9]">
              Multi-rail health probing, dynamic routing simulation, webhook debugging, and unified transaction ledger.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/payment-links"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs px-4 py-2.5 rounded-full transition-all active:scale-[0.97] shadow-sm min-h-[44px] sm:min-h-0"
            >
              <Plus className="size-3.5" />
              <span>Create Payment Link</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation (Optimized for horizontal thumb swipe on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap flex-nowrap -mx-3 px-3 sm:mx-0 sm:px-0 pb-2 mb-6 border-b border-[#222222]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold border border-[#333333]'
                : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <Activity className="size-3.5" />
            <span>Overview & Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'health'
                ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold border border-[#333333]'
                : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <span className="size-1.5 rounded-full bg-[#22C55E]" />
            <span>Gateway Health Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('routing')}
            className={`px-3.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'routing'
                ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold border border-[#333333]'
                : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <Route className="size-3.5" />
            <span>Smart Routing Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'webhooks'
                ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold border border-[#333333]'
                : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <Radio className="size-3.5" />
            <span>Webhook Debugger</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3.5 py-2 rounded-lg text-xs font-['JetBrains_Mono'] transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'sandbox'
                ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold border border-[#333333]'
                : 'text-[#888888] hover:text-[#FFFFFF] hover:bg-[#111111]'
            }`}
          >
            <Terminal className="size-3.5" />
            <span>Interactive SDK Sandbox</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Metric Cards */}
            <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              {/* Total Volume */}
              <Card className="bg-[#101010] border-[#222222] rounded-2xl shadow-sm hover:border-[#333333] transition-all">
                <CardHeader className='flex flex-row items-center justify-between pb-2 p-4 sm:p-6'>
                  <CardTitle className="text-xs font-medium text-[#A9A9A9]">
                    Total Routed Volume
                  </CardTitle>
                  <DollarSign className='size-4 text-[#FFFFFF]' />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="font-['JetBrains_Mono'] text-xl sm:text-3xl font-bold text-[#FFFFFF] tabular-nums">
                    {formatCurrency(displayVol * 100, primaryCurrency)}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]">
                    <span className="flex items-center gap-1 text-[#22C55E]">
                      <TrendingUp className="size-3" />
                      +14.2%
                    </span>
                    <span>vs last period</span>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions & Success Rate */}
              <Card className="bg-[#101010] border-[#222222] rounded-2xl shadow-sm hover:border-[#333333] transition-all">
                <CardHeader className='flex flex-row items-center justify-between pb-2 p-4 sm:p-6'>
                  <CardTitle className="text-xs font-medium text-[#A9A9A9]">
                    Total Transactions
                  </CardTitle>
                  <Activity className='size-4 text-[#FFFFFF]' />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="font-['JetBrains_Mono'] text-xl sm:text-3xl font-bold text-[#FFFFFF] tabular-nums">
                    +{displayTxCount}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]">
                    <span className="flex items-center gap-1 text-[#FFFFFF]">
                      <ShieldCheck className="size-3" />
                      {successRate.toFixed(1)}% success
                    </span>
                    <span>optimal flow</span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Payment Links */}
              <Card className="bg-[#101010] border-[#222222] rounded-2xl shadow-sm hover:border-[#333333] transition-all">
                <CardHeader className='flex flex-row items-center justify-between pb-2 p-4 sm:p-6'>
                  <CardTitle className="text-xs font-medium text-[#A9A9A9]">
                    Active Payment Links
                  </CardTitle>
                  <ShoppingBag className='size-4 text-[#A9A9A9]' />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="font-['JetBrains_Mono'] text-xl sm:text-3xl font-bold text-[#FFFFFF] tabular-nums">
                    {displayActiveLinks}
                  </div>
                  <p className="text-[11px] text-[#A9A9A9] mt-2 font-['JetBrains_Mono']">
                    Active checkout endpoints
                  </p>
                </CardContent>
              </Card>

              {/* Autonomous Failovers */}
              <Card className="bg-[#101010] border-[#222222] rounded-2xl shadow-sm hover:border-[#333333] transition-all">
                <CardHeader className='flex flex-row items-center justify-between pb-2 p-4 sm:p-6'>
                  <CardTitle className="text-xs font-medium text-[#A9A9A9]">
                    Autonomous Failover
                  </CardTitle>
                  <ArrowRightLeft className='size-4 text-[#FFFFFF]' />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="font-['JetBrains_Mono'] text-xl sm:text-3xl font-bold text-[#FFFFFF] tabular-nums">
                    &lt; 140ms
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9]">
                    <CheckCircle2 className="size-3 text-[#22C55E]" />
                    <span>0 dropped checkout sessions</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts & Flow Matrix */}
            <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-7'>
              {/* Main Volume Chart */}
              <Card className='col-span-1 lg:col-span-4 bg-[#101010] border-[#222222] rounded-2xl shadow-sm'>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
                  <div>
                    <CardTitle className="font-['Satoshi'] text-base font-bold text-[#FFFFFF]">
                      Transaction Throughput & Flow Matrix
                    </CardTitle>
                    <CardDescription className="text-xs text-[#A9A9A9]">
                      Real-time multi-currency settlement volume over the past 7 days
                    </CardDescription>
                  </div>

                  {/* Currency Selector */}
                  <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-lg border border-[#222222] self-start sm:self-auto overflow-x-auto no-scrollbar" role="group" aria-label="Select currency">
                    {(currencies.length > 0 ? currencies : ['NGN', 'KES', 'USD']).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setSelectedCurrency(curr)}
                        className={`px-2.5 py-1 rounded text-[10px] font-['JetBrains_Mono'] transition-colors ${
                          primaryCurrency === curr ? 'bg-[#1C1C1C] text-[#FFFFFF] font-bold' : 'text-[#A9A9A9] hover:text-[#FFFFFF]'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className='pt-6 pl-1 sm:pl-2'>
                  <div className='h-[240px] sm:h-[320px] w-full relative'>
                    {isUsingFallback && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#101010]/80 backdrop-blur-[2px] z-10 rounded-lg">
                        <div className="text-center p-4 sm:p-6 bg-[#0A0A0A] border border-[#222222] rounded-2xl shadow-xl">
                          <Activity className="mx-auto size-6 sm:size-8 text-[#FFFFFF] mb-2 sm:mb-3 animate-pulse" />
                          <p className="text-xs sm:text-sm font-semibold text-[#FFFFFF]">Awaiting Transaction Streams</p>
                          <p className="text-[11px] sm:text-xs text-[#A9A9A9] mt-1">Simulate a payment in the developer sandbox to populate live data.</p>
                        </div>
                      </div>
                    )}
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart
                        data={activityData}
                        margin={{ top: 10, right: 15, left: -10, bottom: 10 }}
                        barGap={4}
                      >
                        <CartesianGrid
                          strokeDasharray='3 3'
                          vertical={false}
                          stroke='#222222'
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey='name'
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#A9A9A9', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                          dy={8}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#A9A9A9', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                          width={55}
                          tickFormatter={(value) =>
                            new Intl.NumberFormat('en-US', {
                              notation: 'compact',
                              compactDisplay: 'short',
                              style: 'currency',
                              currency: primaryCurrency,
                              maximumFractionDigits: 1,
                            }).format(value)
                          }
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                          contentStyle={{
                            borderRadius: '1rem',
                            border: '1px solid #222222',
                            backgroundColor: '#0A0A0A',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
                            color: '#FFFFFF',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px',
                          }}
                          itemStyle={{ color: '#FFFFFF', padding: '2px 0' }}
                          formatter={(value: number, name: string) => [
                            new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: name.length === 3 ? name : primaryCurrency,
                            }).format(value),
                            name,
                          ]}
                        />
                        <Bar
                          name={primaryCurrency}
                          dataKey={primaryCurrency}
                          fill='#FFFFFF'
                          radius={[4, 4, 0, 0]}
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Currency Distribution Pie */}
              <Card className='col-span-1 lg:col-span-3 bg-[#101010] border-[#222222] rounded-2xl shadow-sm flex flex-col justify-between'>
                <CardHeader className="border-b border-[#222222] pb-4">
                  <CardTitle className="font-['Satoshi'] text-base font-bold text-[#FFFFFF]">
                    Multi-Currency Ledger Pot
                  </CardTitle>
                  <CardDescription className="text-xs text-[#A9A9A9]">
                    Breakdown of active settlement liquidity
                  </CardDescription>
                </CardHeader>

                <CardContent className='flex items-center justify-center pt-4 sm:pt-6'>
                  <div className='h-[200px] sm:h-[260px] w-full flex items-center justify-center relative'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx='50%'
                          cy='50%'
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey='value'
                          stroke='none'
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] sm:text-xs text-[#A9A9A9] font-['JetBrains_Mono']">Primary Pot</span>
                      <span className="font-['JetBrains_Mono'] text-lg sm:text-xl font-bold text-[#FFFFFF] tabular-nums">
                        {formatCurrency(displayVol * 100, primaryCurrency).split('.')[0]}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 sm:px-6 sm:pb-6 pt-2 border-t border-[#222222] grid grid-cols-3 gap-2 text-center text-xs font-['JetBrains_Mono']">
                  <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#222222]">
                    <div className="text-[#FFFFFF] font-bold">NGN</div>
                    <div className="text-[9px] sm:text-[10px] text-[#A9A9A9] truncate">Paystack/Monnify</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#222222]">
                    <div className="text-[#A9A9A9] font-bold">KES</div>
                    <div className="text-[9px] sm:text-[10px] text-[#A9A9A9] truncate">M-Pesa Express</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0A0A0A] border border-[#222222]">
                    <div className="text-[#777777] font-bold">USD</div>
                    <div className="text-[9px] sm:text-[10px] text-[#A9A9A9] truncate">Flutterwave</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Real-time Rails Health Monitor & Recent Stream */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-12">
              {/* Rails Health Grid */}
              <Card className="col-span-1 lg:col-span-5 bg-[#101010] border-[#222222] rounded-2xl shadow-sm">
                <CardHeader className="border-b border-[#222222] pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-['Satoshi'] text-base font-bold text-[#FFFFFF]">
                      Payment Rails Health
                    </CardTitle>
                    <span className="text-[11px] font-['JetBrains_Mono'] text-[#A9A9A9] bg-[#161616] px-2.5 py-0.5 rounded-full border border-[#222222]">
                      Autonomous Probing
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {connectedRails.map((rail, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#222222] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-center font-['JetBrains_Mono'] font-bold text-[10px] text-[#FFFFFF]">
                          {rail.code}
                        </div>
                        <div>
                          <div className="font-semibold text-[#FFFFFF]">{rail.name}</div>
                          <div className="text-[10px] text-[#A9A9A9] font-['JetBrains_Mono']">
                            Traffic Share: {rail.share}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[#FFFFFF]">
                          <span className="size-1.5 rounded-full bg-[#22C55E]" />
                          {rail.ping}
                        </div>
                        <div className="text-[10px] text-[#A9A9A9]">{rail.health}% uptime</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Stream */}
              <Card className="col-span-1 lg:col-span-7 bg-[#101010] border-[#222222] rounded-2xl shadow-sm">
                <CardHeader className="border-b border-[#222222] pb-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-['Satoshi'] text-base font-bold text-[#FFFFFF]">
                      Live Routed Transactions
                    </CardTitle>
                    <CardDescription className="text-xs text-[#A9A9A9]">
                      Latest customer charges handled by Quirk failover layer
                    </CardDescription>
                  </div>
                  <Link
                    to="/transactions"
                    className="text-xs text-[#FFFFFF] hover:underline inline-flex items-center gap-1 font-medium min-h-[44px] items-center"
                  >
                    <span>View all</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </CardHeader>
                <CardContent className="pt-4 divide-y divide-[#22303A]/60">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#161616] border border-[#222222] flex items-center justify-center font-bold text-[11px] text-[#FFFFFF] shrink-0">
                          {tx.customer[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#FFFFFF] flex items-center gap-2 flex-wrap">
                            <span className="truncate">{tx.customer}</span>
                            <span className="text-[10px] font-['JetBrains_Mono'] text-[#A9A9A9] bg-[#0A0A0A] px-1.5 py-0.5 rounded border border-[#222222]">
                              {tx.rail}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#A9A9A9] flex items-center gap-2 mt-0.5">
                            <span className="truncate max-w-[130px] sm:max-w-none">{tx.email}</span>
                            <span>·</span>
                            <button
                              onClick={() => copyToClipboard(tx.id, tx.id)}
                              className="font-['JetBrains_Mono'] hover:text-[#FFFFFF] inline-flex items-center gap-1 min-h-[28px]"
                              title="Copy transaction id"
                            >
                              <span>{tx.id}</span>
                              {copiedId === tx.id ? <Check className="size-2.5 text-[#22C55E]" /> : <Copy className="size-2.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:text-right pl-11 sm:pl-0">
                        <div className="font-['JetBrains_Mono'] font-bold text-sm text-[#FFFFFF] tabular-nums">
                          {formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <div className="text-[10px] font-['JetBrains_Mono'] text-[#A9A9A9]">
                          {tx.latency} · {tx.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Gateway Health Matrix */}
        {activeTab === 'health' && (
          <div className="bg-[#FFFFFF] text-[#080808] p-3.5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm">
            <GatewayHealthMatrix />
          </div>
        )}

        {/* Tab 3: Smart Routing Rules */}
        {activeTab === 'routing' && (
          <div className="bg-[#FFFFFF] text-[#080808] p-3.5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm">
            <RoutingRuleBuilder />
          </div>
        )}

        {/* Tab 4: Webhook Debugger */}
        {activeTab === 'webhooks' && (
          <div className="bg-[#FFFFFF] text-[#080808] p-3.5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm">
            <WebhookDebugger />
          </div>
        )}

        {/* Tab 5: SDK Integration Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="bg-[#FFFFFF] text-[#080808] p-3.5 sm:p-6 rounded-2xl border border-[#E5E5E5] shadow-sm">
            <IntegrationSandbox />
          </div>
        )}
      </Main>
    </>
  )
}
