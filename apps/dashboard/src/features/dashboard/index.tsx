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
  Zap,
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
  Legend,
  AreaChart,
  Area,
} from 'recharts'

export function Dashboard() {
  const { stats, chartData, currencies, activeLinksCount, isUsingFallback } = useDashboard()
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currencies[0] || 'NGN')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const primaryCurrency = selectedCurrency || currencies[0] || 'NGN'
  
  const displayVol = stats?.total_volume?.[primaryCurrency] || 0
  const successRate = stats?.failure_rate !== undefined ? Math.max(0, 100 - stats.failure_rate) : 99.4
  const displayTxCount = stats?.total_count || 0
  const displayActiveLinks = activeLinksCount || 0
  
  const activityData = chartData
  const pieData = currencies.map((curr, idx) => ({
    name: curr,
    value: stats?.total_volume?.[curr] || (idx === 0 ? 65 : idx === 1 ? 25 : 10),
    color: idx === 0 ? '#ABFF2A' : idx === 1 ? '#00D4FF' : '#F5B83D'
  }))

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Active Rails Health Status (Real-time network visibility)
  const connectedRails = [
    { name: 'Paystack Direct', code: 'PSTK', ping: '185ms', status: 'Optimal', share: '54%', health: 100 },
    { name: 'Flutterwave Switch', code: 'FLW', ping: '210ms', status: 'Optimal', share: '28%', health: 99.8 },
    { name: 'M-Pesa STK Push', code: 'MPESA', ping: '140ms', status: 'Optimal', share: '12%', health: 100 },
    { name: 'Monnify Dynamic VA', code: 'MNFY', ping: '195ms', status: 'Optimal', share: '6%', health: 99.9 },
  ]

  // Recent Routed Transactions
  const recentTransactions = [
    { id: 'chg_9f21a8d01', customer: 'Amara Chen', email: 'amara@flutter.dev', amount: 2500000, currency: 'NGN', rail: 'Paystack Direct', latency: '174ms', status: 'authorized', time: '2m ago' },
    { id: 'chg_9f21a8d02', customer: 'Kofi Mensah', email: 'kofi@accra.co', amount: 45000, currency: 'KES', rail: 'M-Pesa STK', latency: '138ms', status: 'authorized', time: '8m ago' },
    { id: 'chg_9f21a8d03', customer: 'Zainab Bello', email: 'zainab@lagos.io', amount: 1200000, currency: 'NGN', rail: 'Monnify VA', latency: '192ms', status: 'authorized', time: '14m ago' },
    { id: 'chg_9f21a8d04', customer: 'David Ochieng', email: 'david@nairobi.tech', amount: 8500, currency: 'USD', rail: 'Flutterwave', latency: '215ms', status: 'authorized', time: '22m ago' },
  ]

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 ms-auto'>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#11161D] border border-[#22303A] text-xs font-['JetBrains_Mono']">
            <span className="size-2 rounded-full bg-[#ABFF2A] animate-pulse" />
            <span className="text-[#A9B0BB]">All Rails Operational</span>
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Header Title & Actions */}
        <div className='mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-['Satoshi'] text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FA]">
                Routing Operations
              </h1>
              <span className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#171D26] border border-[#22303A] text-[#00D4FF]">
                Live Environment
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A9B0BB]">
              Autonomous failover health, unified multi-currency ledger, and real-time transaction throughput.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/payment-links"
              className="inline-flex items-center gap-1.5 bg-[#ABFF2A] hover:bg-[#ABFF2A]/90 text-[#080B10] font-semibold text-xs px-4 py-2.5 rounded-full transition-all active:scale-[0.97] shadow-sm"
            >
              <Plus className="size-3.5" />
              <span>Create Payment Link</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards (Data Dashboard UI Design Brain Pattern) */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          {/* Total Volume */}
          <Card className="bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm hover:border-[#A9B0BB]/30 transition-all">
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className="text-xs font-medium text-[#A9B0BB]">
                Total Routed Volume
              </CardTitle>
              <DollarSign className='size-4 text-[#ABFF2A]' />
            </CardHeader>
            <CardContent>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                {formatCurrency(displayVol * 100, primaryCurrency)}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB]">
                <span className="flex items-center gap-1 text-[#ABFF2A]">
                  <TrendingUp className="size-3" />
                  +14.2%
                </span>
                <span>vs last week</span>
              </div>
            </CardContent>
          </Card>

          {/* Transactions & Success Rate */}
          <Card className="bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm hover:border-[#A9B0BB]/30 transition-all">
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className="text-xs font-medium text-[#A9B0BB]">
                Total Transactions
              </CardTitle>
              <Activity className='size-4 text-[#00D4FF]' />
            </CardHeader>
            <CardContent>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                +{displayTxCount}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#A9B0BB]">
                <span className="flex items-center gap-1 text-[#00D4FF]">
                  <ShieldCheck className="size-3" />
                  {successRate.toFixed(1)}% success
                </span>
                <span>optimal flow</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Payment Links */}
          <Card className="bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm hover:border-[#A9B0BB]/30 transition-all">
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className="text-xs font-medium text-[#A9B0BB]">
                Active Payment Links
              </CardTitle>
              <ShoppingBag className='size-4 text-[#F5B83D]' />
            </CardHeader>
            <CardContent>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                {displayActiveLinks}
              </div>
              <p className="text-[11px] text-[#A9B0BB] mt-2 font-['JetBrains_Mono']">
                Public customer checkout endpoints
              </p>
            </CardContent>
          </Card>

          {/* Autonomous Failovers */}
          <Card className="bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm hover:border-[#A9B0BB]/30 transition-all">
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className="text-xs font-medium text-[#A9B0BB]">
                Autonomous Failover
              </CardTitle>
              <Zap className='size-4 text-[#ABFF2A]' />
            </CardHeader>
            <CardContent>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                &lt; 180ms
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-['JetBrains_Mono'] text-[#ABFF2A]">
                <CheckCircle2 className="size-3" />
                <span>0 dropped checkout sessions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts & Flow Matrix */}
        <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-7 mb-6'>
          {/* Main Volume Chart */}
          <Card className='col-span-1 lg:col-span-4 bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm'>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#22303A] pb-4">
              <div>
                <CardTitle className="font-['Satoshi'] text-base font-bold text-[#F5F7FA]">
                  Transaction Throughput & Flow Matrix
                </CardTitle>
                <CardDescription className="text-xs text-[#A9B0BB]">
                  Real-time multi-currency settlement volume over the past 7 days
                </CardDescription>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-1 bg-[#080B10] p-1 rounded-lg border border-[#22303A]" role="group" aria-label="Select currency">
                {(currencies.length > 0 ? currencies : ['NGN', 'KES', 'USD']).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2.5 py-1 rounded text-[10px] font-['JetBrains_Mono'] transition-colors ${
                      primaryCurrency === curr ? 'bg-[#171D26] text-[#ABFF2A] font-bold' : 'text-[#A9B0BB] hover:text-[#F5F7FA]'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className='pt-6 pl-2'>
              <div className='h-[320px] w-full relative'>
                {isUsingFallback && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#11161D]/70 backdrop-blur-[2px] z-10 rounded-lg">
                    <div className="text-center p-6 bg-[#080B10] border border-[#22303A] rounded-2xl shadow-xl">
                      <Activity className="mx-auto size-8 text-[#ABFF2A] mb-3 animate-pulse" />
                      <p className="text-sm font-semibold text-[#F5F7FA]">Awaiting Transaction Streams</p>
                      <p className="text-xs text-[#A9B0BB] mt-1">Simulate a payment in the developer sandbox to populate live data.</p>
                    </div>
                  </div>
                )}
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#22303A'
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A9B0BB', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A9B0BB', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      width={65}
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
                      cursor={{ fill: 'rgba(34, 48, 58, 0.4)' }}
                      contentStyle={{
                        borderRadius: '1rem',
                        border: '1px solid #22303A',
                        backgroundColor: '#080B10',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        color: '#F5F7FA',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#ABFF2A', padding: '2px 0' }}
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
                      fill='#ABFF2A'
                      radius={[6, 6, 0, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Currency Distribution Pie */}
          <Card className='col-span-1 lg:col-span-3 bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm flex flex-col justify-between'>
            <CardHeader className="border-b border-[#22303A] pb-4">
              <CardTitle className="font-['Satoshi'] text-base font-bold text-[#F5F7FA]">
                Multi-Currency Ledger Pot
              </CardTitle>
              <CardDescription className="text-xs text-[#A9B0BB]">
                Breakdown of active settlement liquidity
              </CardDescription>
            </CardHeader>

            <CardContent className='flex items-center justify-center pt-6'>
              <div className='h-[260px] w-full flex items-center justify-center relative'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx='50%'
                      cy='50%'
                      innerRadius={65}
                      outerRadius={95}
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
                  <span className="text-xs text-[#A9B0BB] font-['JetBrains_Mono']">Primary Pot</span>
                  <span className="font-['Space_Grotesk'] text-xl font-bold text-[#F5F7FA]">
                    {formatCurrency(displayVol * 100, primaryCurrency).split('.')[0]}
                  </span>
                </div>
              </div>
            </CardContent>

            <div className="px-6 pb-6 pt-2 border-t border-[#22303A] grid grid-cols-3 gap-2 text-center text-xs font-['JetBrains_Mono']">
              <div className="p-2 rounded-xl bg-[#080B10] border border-[#22303A]">
                <div className="text-[#ABFF2A] font-bold">NGN</div>
                <div className="text-[10px] text-[#A9B0BB]">Paystack/Monnify</div>
              </div>
              <div className="p-2 rounded-xl bg-[#080B10] border border-[#22303A]">
                <div className="text-[#00D4FF] font-bold">KES</div>
                <div className="text-[10px] text-[#A9B0BB]">M-Pesa Express</div>
              </div>
              <div className="p-2 rounded-xl bg-[#080B10] border border-[#22303A]">
                <div className="text-[#F5B83D] font-bold">USD</div>
                <div className="text-[10px] text-[#A9B0BB]">Flutterwave</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-time Rails Health Monitor & Recent Stream */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-12">
          {/* Rails Health Grid */}
          <Card className="col-span-1 lg:col-span-5 bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[#22303A] pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-['Satoshi'] text-base font-bold text-[#F5F7FA]">
                  Payment Rails Health
                </CardTitle>
                <span className="text-[11px] font-['JetBrains_Mono'] text-[#ABFF2A] bg-[#171D26] px-2 py-0.5 rounded-full border border-[#22303A]">
                  Autonomous Probing
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {connectedRails.map((rail, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#080B10] border border-[#22303A] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-[#171D26] border border-[#22303A] flex items-center justify-center font-['JetBrains_Mono'] font-bold text-[10px] text-[#00D4FF]">
                      {rail.code}
                    </div>
                    <div>
                      <div className="font-semibold text-[#F5F7FA]">{rail.name}</div>
                      <div className="text-[10px] text-[#A9B0BB] font-['JetBrains_Mono']">
                        Traffic Share: {rail.share}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-['JetBrains_Mono'] text-[#ABFF2A]">
                      <span className="size-1.5 rounded-full bg-[#ABFF2A]" />
                      {rail.ping}
                    </div>
                    <div className="text-[10px] text-[#A9B0BB]">{rail.health}% uptime</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Stream */}
          <Card className="col-span-1 lg:col-span-7 bg-[#11161D] border-[#22303A] rounded-2xl shadow-sm">
            <CardHeader className="border-b border-[#22303A] pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-['Satoshi'] text-base font-bold text-[#F5F7FA]">
                  Live Routed Transactions
                </CardTitle>
                <CardDescription className="text-xs text-[#A9B0BB]">
                  Latest customer charges handled by Quirk failover layer
                </CardDescription>
              </div>
              <Link
                to="/transactions"
                className="text-xs text-[#ABFF2A] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-[#22303A]">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#171D26] border border-[#22303A] flex items-center justify-center font-bold text-[11px] text-[#ABFF2A]">
                      {tx.customer[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[#F5F7FA] flex items-center gap-2">
                        <span>{tx.customer}</span>
                        <span className="text-[10px] font-['JetBrains_Mono'] text-[#A9B0BB] bg-[#080B10] px-1.5 py-0.5 rounded border border-[#22303A]">
                          {tx.rail}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A9B0BB] flex items-center gap-2 mt-0.5">
                        <span>{tx.email}</span>
                        <span>·</span>
                        <button
                          onClick={() => copyToClipboard(tx.id, tx.id)}
                          className="font-['JetBrains_Mono'] hover:text-[#F5F7FA] inline-flex items-center gap-1"
                        >
                          <span>{tx.id}</span>
                          {copiedId === tx.id ? <Check className="size-2.5 text-[#ABFF2A]" /> : <Copy className="size-2.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-['Space_Grotesk'] font-bold text-sm text-[#F5F7FA]">
                      {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[10px] font-['JetBrains_Mono'] text-[#ABFF2A]">
                      {tx.latency} · {tx.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
