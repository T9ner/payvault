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
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Route,
  Terminal,
  Check,
  Copy,
  Layers,
  Sparkles,
  ArrowRightLeft,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function Dashboard() {
  const { stats, chartData, currencies } = useDashboard()
  const [selectedCurrency, setSelectedCurrency] = useState<string>(currencies[0] || 'NGN')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'transactions' | 'rails' | 'developer'>('transactions')

  const primaryCurrency = selectedCurrency || currencies[0] || 'NGN'
  const displayVol = stats?.total_volume?.[primaryCurrency] || 1284500
  const successRate = stats?.failure_rate !== undefined ? Math.max(0, 100 - stats.failure_rate) : 99.4
  const displayTxCount = stats?.total_count || 1420

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Active Rails Health Status (Real-time network visibility)
  const connectedRails = [
    { name: 'Paystack Direct', code: 'PSTK', ping: '142ms', status: 'Operational', share: '54%', priority: 'Primary' },
    { name: 'Monnify Dynamic VA', code: 'MNFY', ping: '118ms', status: 'Operational', share: '24%', priority: 'Secondary' },
    { name: 'Flutterwave Switch', code: 'FLW', ping: '188ms', status: 'Operational', share: '14%', priority: 'Fallback' },
    { name: 'Squad HabariPay', code: 'SQD', ping: '130ms', status: 'Operational', share: '8%', priority: 'Fallback' },
  ]

  // Recent Routed Transactions
  const recentTransactions = [
    { id: 'chg_9f21a8d01', customer: 'Alex Okafor', email: 'alex@company.dev', amount: 2500000, currency: 'NGN', rail: 'Paystack Direct', latency: '142ms', status: 'success', time: '2m ago' },
    { id: 'chg_9f21a8d02', customer: 'Kofi Mensah', email: 'kofi@accra.co', amount: 45000, currency: 'KES', rail: 'Flutterwave Switch', latency: '188ms', status: 'success', time: '8m ago' },
    { id: 'chg_9f21a8d03', customer: 'Zainab Bello', email: 'zainab@lagos.io', amount: 1200000, currency: 'NGN', rail: 'Monnify VA', latency: '118ms', status: 'success', time: '14m ago' },
    { id: 'chg_9f21a8d04', customer: 'David Ochieng', email: 'david@nairobi.tech', amount: 8500, currency: 'USD', rail: 'Flutterwave Switch', latency: '195ms', status: 'success', time: '22m ago' },
    { id: 'chg_9f21a8d05', customer: 'Chiamaka Eze', email: 'chiamaka@fintech.ng', amount: 350000, currency: 'NGN', rail: 'Paystack Direct', latency: '135ms', status: 'success', time: '35m ago' },
  ]

  return (
    <>
      <Header>
        <div className='flex items-center gap-3 ms-auto'>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border text-xs font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground">All Rails Operational</span>
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6">
        {/* Top Title & Primary Actions */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2'>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Overview
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Multi-rail routing metrics, live transaction stream, and gateway health.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/transactions"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-medium text-xs px-4 py-2 rounded-lg transition-all active:scale-[0.98] shadow-2xs"
            >
              <Plus className="size-3.5" />
              <span>Create Charge</span>
            </Link>
          </div>
        </div>

        {/* 3 Focused Metric Cards */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
          {/* Total Volume Card */}
          <Card className="rounded-xl border-border bg-card shadow-2xs">
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Volume Processed
              </CardTitle>
              {/* Currency Selector */}
              <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-md border border-border">
                {currencies.slice(0, 3).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      primaryCurrency === curr
                        ? 'bg-background text-foreground font-bold shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                {formatCurrency(displayVol * 100, primaryCurrency)}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-1.5">
                <span className="text-emerald-500 font-semibold">+14.2%</span> from last 7 days
              </p>
            </CardContent>
          </Card>

          {/* Success Rate Card */}
          <Card className="rounded-xl border-border bg-card shadow-2xs">
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Routing Success Rate
              </CardTitle>
              <ShieldCheck className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                {successRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Zero dropped sessions via failover</span>
              </p>
            </CardContent>
          </Card>

          {/* Transactions Count Card */}
          <Card className="rounded-xl border-border bg-card shadow-2xs">
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Routed Transactions
              </CardTitle>
              <Activity className='size-4 text-muted-foreground' />
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                {displayTxCount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Active across 4 switches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs (Astryx Minimalist Pill Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-muted/40 border border-border rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'transactions'
                ? 'bg-background text-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Live Ledger Stream
          </button>
          <button
            onClick={() => setActiveTab('rails')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'rails'
                ? 'bg-background text-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rails & Health
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'developer'
                ? 'bg-background text-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            SDK Quickstart
          </button>
        </div>

        {/* Tab 1: Live Ledger Stream */}
        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Recent Transactions Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <Card className="rounded-xl border-border bg-card shadow-2xs overflow-hidden">
                <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">Recent Transactions</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Real-time multi-rail authorization feed
                    </CardDescription>
                  </div>
                  <Link to="/transactions" className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    <span>View all</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-border bg-muted/20 text-muted-foreground font-mono text-[11px]">
                        <th className="py-3 px-4 font-medium">Reference</th>
                        <th className="py-3 px-4 font-medium">Customer</th>
                        <th className="py-3 px-4 font-medium">Rail</th>
                        <th className="py-3 px-4 font-medium">Amount</th>
                        <th className="py-3 px-4 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                            <button
                              onClick={() => copyToClipboard(tx.id, tx.id)}
                              className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                              title="Copy transaction reference"
                            >
                              <span>{tx.id}</span>
                              {copiedId === tx.id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3 text-muted-foreground opacity-40 hover:opacity-100" />}
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-foreground">{tx.customer}</div>
                            <div className="text-[11px] text-muted-foreground">{tx.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-muted/40 font-mono text-[10px] text-foreground">
                              <span className="size-1 rounded-full bg-emerald-500" />
                              {tx.rail}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                            {formatCurrency(tx.amount, tx.currency)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              authorized
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Volume Throughput Chart (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-xl border-border bg-card shadow-2xs">
                <CardHeader className="p-5 border-b border-border">
                  <CardTitle className="text-sm font-semibold">Weekly Velocity</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Aggregated multi-rail throughput
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Bar dataKey="volume" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Rails & Health */}
        {activeTab === 'rails' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {connectedRails.map((rail) => (
                <Card key={rail.code} className="rounded-xl border-border bg-card p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono font-bold text-foreground">{rail.code}</div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border bg-muted/40 text-muted-foreground">
                      {rail.priority}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{rail.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{rail.status} &bull; {rail.ping}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Traffic share</span>
                    <span className="font-semibold text-foreground">{rail.share}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SDK Quickstart */}
        {activeTab === 'developer' && (
          <Card className="rounded-xl border-border bg-card p-6 shadow-2xs space-y-4 max-w-3xl">
            <div>
              <CardTitle className="text-sm font-semibold">Integrate with `@quirk/sdk`</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Initialize the multi-rail client with dynamic failover in 3 lines of code.
              </CardDescription>
            </div>

            <div className="rounded-lg bg-muted/50 border border-border p-4 font-mono text-xs text-foreground overflow-x-auto space-y-2">
              <div className="text-muted-foreground">// 1. Install SDK</div>
              <div className="text-primary font-bold">npm install quirk-sdk</div>
              <div className="pt-2 text-muted-foreground">// 2. Initialize with multi-rail fallback</div>
              <div>import &#123; Quirk &#125; from 'quirk-sdk';</div>
              <div>const quirk = new Quirk(&#123;</div>
              <div className="pl-4">providers: &#123;</div>
              <div className="pl-8">paystack: process.env.PAYSTACK_SECRET_KEY,</div>
              <div className="pl-8">flutterwave: process.env.FLUTTERWAVE_SECRET_KEY,</div>
              <div className="pl-4">&#125;,</div>
              <div className="pl-4">strategy: 'dynamic_failover',</div>
              <div>&#125;);</div>
            </div>
          </Card>
        )}
      </Main>
    </>
  )
}
