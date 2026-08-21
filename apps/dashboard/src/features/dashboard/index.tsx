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
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/lib/formatters'
import { toast } from 'sonner'
import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Check,
  Copy,
  RefreshCw,
  Search,
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
  const [activeTab, setActiveTab] = useState<'transactions' | 'rails' | 'routing' | 'developer'>('transactions')
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false)
  const [activeRoutingStrategy, setActiveRoutingStrategy] = useState<'dynamic_failover' | 'cost_optimized' | 'round_robin'>('dynamic_failover')

  const primaryCurrency = selectedCurrency || currencies[0] || 'NGN'
  const displayVol = stats?.total_volume?.[primaryCurrency] || 1284500
  const successRate = stats?.failure_rate !== undefined ? Math.max(0, 100 - stats.failure_rate) : 99.4
  const displayTxCount = stats?.total_count || 1420

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const triggerFailoverSimulation = () => {
    setIsSimulatingFailover(true)
    toast.warning('Simulating primary switch degradation on Paystack (timeout > 5000ms)...')
    
    setTimeout(() => {
      setIsSimulatingFailover(false)
      toast.success('Failover executed in 118ms: Traffic rerouted to Monnify Dynamic VA with 0 dropped sessions.')
    }, 1200)
  }

  // Active African Rails Health Status
  const connectedRails = [
    { name: 'Paystack Direct', code: 'PSTK', ping: isSimulatingFailover ? '5120ms (Degraded)' : '142ms', status: isSimulatingFailover ? 'Degraded' : 'Operational', share: isSimulatingFailover ? '0%' : '54%', priority: 'Primary', type: 'Cards & Transfer' },
    { name: 'Monnify Dynamic VA', code: 'MNFY', ping: '118ms', status: 'Operational', share: isSimulatingFailover ? '78%' : '24%', priority: isSimulatingFailover ? 'Active Switch' : 'Secondary', type: 'Virtual Accounts' },
    { name: 'Flutterwave Switch', code: 'FLW', ping: '188ms', status: 'Operational', share: isSimulatingFailover ? '14%' : '14%', priority: 'Fallback', type: 'Pan-African & Card' },
    { name: 'Squad HabariPay', code: 'SQD', ping: '130ms', status: 'Operational', share: isSimulatingFailover ? '8%' : '8%', priority: 'Fallback', type: 'USSD & VA' },
  ]

  // Recent Routed Transactions
  const recentTransactions = [
    { id: 'chg_9f21a8d01', customer: 'Alex Okafor', email: 'alex@company.dev', amount: 2500000, currency: 'NGN', rail: isSimulatingFailover ? 'Monnify VA' : 'Paystack Direct', latency: isSimulatingFailover ? '118ms' : '142ms', status: 'authorized', time: 'Just now' },
    { id: 'chg_9f21a8d02', customer: 'Kofi Mensah', email: 'kofi@accra.co', amount: 45000, currency: 'KES', rail: 'Flutterwave Switch', latency: '188ms', status: 'authorized', time: '4m ago' },
    { id: 'chg_9f21a8d03', customer: 'Zainab Bello', email: 'zainab@lagos.io', amount: 1200000, currency: 'NGN', rail: 'Monnify VA', latency: '118ms', status: 'authorized', time: '12m ago' },
    { id: 'chg_9f21a8d04', customer: 'David Ochieng', email: 'david@nairobi.tech', amount: 8500, currency: 'USD', rail: 'Flutterwave Switch', latency: '195ms', status: 'authorized', time: '21m ago' },
    { id: 'chg_9f21a8d05', customer: 'Chiamaka Eze', email: 'chiamaka@fintech.ng', amount: 350000, currency: 'NGN', rail: 'Paystack Direct', latency: '135ms', status: 'authorized', time: '34m ago' },
  ]

  return (
    <div className='min-h-screen bg-[#F7F7F5] text-[#080808]'>
      {/* ── 1. TASKBAR (ASTRYX-INSPIRED NAVBAR) ── */}
      <Header className='bg-[#FFFFFF]/95 border-b border-[#E5E5E5]'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <span className='font-["Satoshi"] font-bold text-sm text-[#080808] tracking-tight'>
              Overview
            </span>
            <span className='hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7F7F5] border border-[#E5E5E5] text-[#666666]'>
              Multi-Rail Control Plane
            </span>
          </div>

          {/* Astryx-Style Cmd+K Search Bar */}
          <Link
            to='/transactions'
            className='hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBEA] border border-[#E5E5E5] text-xs text-[#666666] hover:text-[#080808] transition-colors duration-150 ml-4'
          >
            <Search className='size-3.5 text-[#666666]' />
            <span className='font-mono text-[11px]'>Search ledger, rails, or docs...</span>
            <kbd className='text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FFFFFF] border border-[#E5E5E5] text-[#666666]'>
              ⌘K
            </kbd>
          </Link>
        </div>

        <div className='flex items-center gap-3 ms-auto'>
          {/* Live Rails Status Pill */}
          <div
            role='status'
            className='hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono text-[#080808]'
          >
            <span className='size-2 rounded-full bg-[#22C55E] animate-pulse' />
            <span className='text-[11px] font-medium'>All Rails Operational (99.98%)</span>
          </div>

          <Link
            to='/transactions'
            className='inline-flex items-center justify-center gap-1.5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-medium text-xs px-3.5 py-1.5 rounded-lg active:scale-[0.98] transition-transform duration-150 ease-out shadow-xs'
          >
            <Plus className='size-3.5' />
            <span>Create charge</span>
          </Link>

          <ProfileDropdown />
        </div>
      </Header>

      {/* ── 2. DASHBOARD BODY ── */}
      <Main className='px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-8'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]'>
          <div className='space-y-1'>
            <h1 className='font-["Satoshi"] text-2xl sm:text-3xl font-bold tracking-tight text-[#080808] [text-wrap:balance]'>
              Control Plane Overview
            </h1>
            <p className='text-xs sm:text-sm text-[#666666] [text-wrap:pretty]'>
              Multi-rail health matrix, autonomous failover routing, and real-time transaction ledger.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={triggerFailoverSimulation}
              disabled={isSimulatingFailover}
              className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F0F0EE] text-xs font-medium text-[#080808] active:scale-[0.98] transition-transform duration-150 ease-out shadow-2xs'
              title='Simulate primary gateway downtime and test autonomous failover'
            >
              <RefreshCw className={`size-3.5 text-[#666666] ${isSimulatingFailover ? 'animate-spin' : ''}`} />
              <span>{isSimulatingFailover ? 'Testing failover...' : 'Test failover simulation'}</span>
            </button>
          </div>
        </div>

        {/* ── 3. THREE FOCUSED KPI METRIC CARDS ── */}
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-3'>
          {/* Volume Processed */}
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-mono'>
                Volume processed
              </CardTitle>
              {/* Currency Selector */}
              <div className='flex items-center gap-1 bg-[#F7F7F5] p-0.5 rounded-lg border border-[#E5E5E5]' role='group' aria-label='Select currency'>
                {currencies.slice(0, 3).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors duration-150 ${
                      primaryCurrency === curr
                        ? 'bg-[#FFFFFF] text-[#080808] font-bold shadow-2xs'
                        : 'text-[#666666] hover:text-[#080808]'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className='p-5 pt-0'>
              <div className='font-mono text-2xl sm:text-3xl font-bold text-[#080808] tabular-nums tracking-tight'>
                {formatCurrency(displayVol * 100, primaryCurrency)}
              </div>
              <p className='text-xs text-[#666666] mt-2 font-mono flex items-center gap-1.5'>
                <span className='text-[#22C55E] font-semibold'>+14.2%</span> from last 7 days
              </p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-mono'>
                Routing success rate
              </CardTitle>
              <ShieldCheck className='size-4 text-[#666666]' />
            </CardHeader>
            <CardContent className='p-5 pt-0'>
              <div className='font-mono text-2xl sm:text-3xl font-bold text-[#080808] tabular-nums tracking-tight'>
                {successRate.toFixed(1)}%
              </div>
              <p className='text-xs text-[#666666] mt-2 font-mono flex items-center gap-1.5'>
                <span className='size-1.5 rounded-full bg-[#22C55E] inline-block' />
                <span>Zero dropped sessions via failover</span>
              </p>
            </CardContent>
          </Card>

          {/* Routed Transactions */}
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <CardHeader className='flex flex-row items-center justify-between pb-2 p-5'>
              <CardTitle className='text-xs font-semibold text-[#666666] uppercase tracking-wider font-mono'>
                Routed transactions
              </CardTitle>
              <Activity className='size-4 text-[#666666]' />
            </CardHeader>
            <CardContent className='p-5 pt-0'>
              <div className='font-mono text-2xl sm:text-3xl font-bold text-[#080808] tabular-nums tracking-tight'>
                {displayTxCount.toLocaleString()}
              </div>
              <p className='text-xs text-[#666666] mt-2 font-mono'>
                Active across 4 switches
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ── 4. ASTRYX-STYLE SEGMENTED NAVIGATION CONTROL ── */}
        <div className='flex items-center gap-1 p-1 bg-[#EBEBEA] border border-[#E0E0DE] rounded-xl w-fit'>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'transactions'
                ? 'bg-[#FFFFFF] text-[#080808] font-semibold shadow-2xs'
                : 'text-[#666666] hover:text-[#080808]'
            }`}
          >
            Live ledger stream
          </button>
          <button
            onClick={() => setActiveTab('rails')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'rails'
                ? 'bg-[#FFFFFF] text-[#080808] font-semibold shadow-2xs'
                : 'text-[#666666] hover:text-[#080808]'
            }`}
          >
            Rails & health
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'routing'
                ? 'bg-[#FFFFFF] text-[#080808] font-semibold shadow-2xs'
                : 'text-[#666666] hover:text-[#080808]'
            }`}
          >
            Routing rules
          </button>
          <button
            onClick={() => setActiveTab('developer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              activeTab === 'developer'
                ? 'bg-[#FFFFFF] text-[#080808] font-semibold shadow-2xs'
                : 'text-[#666666] hover:text-[#080808]'
            }`}
          >
            SDK quickstart
          </button>
        </div>

        {/* ── TAB 1: LIVE LEDGER STREAM & VELOCITY CHART ── */}
        {activeTab === 'transactions' && (
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
            {/* Live Transactions Table (8 Cols) */}
            <div className='lg:col-span-8 space-y-4'>
              <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden'>
                <CardHeader className='p-5 border-b border-[#E5E5E5] flex flex-row items-center justify-between'>
                  <div>
                    <CardTitle className='text-sm font-bold text-[#080808] font-["Satoshi"]'>
                      Recent authorizations
                    </CardTitle>
                    <CardDescription className='text-xs text-[#666666] mt-0.5'>
                      Live multi-rail transaction stream with minor-unit settlement
                    </CardDescription>
                  </div>
                  <Link
                    to='/transactions'
                    className='text-xs font-medium text-[#666666] hover:text-[#080808] inline-flex items-center gap-1 transition-colors duration-150'
                  >
                    <span>View all</span>
                    <ArrowUpRight className='size-3' />
                  </Link>
                </CardHeader>
                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs'>
                    <thead>
                      <tr className='border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666] font-mono text-[11px]'>
                        <th className='py-3 px-4 font-medium'>Reference</th>
                        <th className='py-3 px-4 font-medium'>Customer</th>
                        <th className='py-3 px-4 font-medium'>Active rail</th>
                        <th className='py-3 px-4 font-medium'>Amount</th>
                        <th className='py-3 px-4 font-medium text-right'>Status</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#E5E5E5]'>
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} className='hover:bg-[#F7F7F5] transition-colors duration-100'>
                          <td className='py-3.5 px-4 font-mono font-medium text-[#080808]'>
                            <button
                              onClick={() => copyToClipboard(tx.id, tx.id)}
                              className='hover:text-[#666666] transition-colors duration-150 inline-flex items-center gap-1.5'
                              title='Copy transaction reference'
                              aria-label={`Copy reference ${tx.id}`}
                            >
                              <span>{tx.id}</span>
                              {copiedId === tx.id ? (
                                <Check className='size-3 text-[#22C55E]' />
                              ) : (
                                <Copy className='size-3 text-[#999999] opacity-50 hover:opacity-100' />
                              )}
                            </button>
                          </td>
                          <td className='py-3.5 px-4'>
                            <div className='font-medium text-[#080808]'>{tx.customer}</div>
                            <div className='text-[11px] text-[#666666] font-mono'>{tx.email}</div>
                          </td>
                          <td className='py-3.5 px-4'>
                            <span className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] font-mono text-[10px] text-[#080808] whitespace-nowrap'>
                              <span className='size-1 rounded-full bg-[#22C55E]' />
                              {tx.rail}
                            </span>
                          </td>
                          <td className='py-3.5 px-4 font-mono font-semibold text-[#080808] tabular-nums'>
                            {formatCurrency(tx.amount, tx.currency)}
                          </td>
                          <td className='py-3.5 px-4 text-right'>
                            <span className='inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200'>
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

            {/* Weekly Velocity Chart (4 Cols) */}
            <div className='lg:col-span-4 space-y-4'>
              <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
                <CardHeader className='p-5 border-b border-[#E5E5E5]'>
                  <CardTitle className='text-sm font-bold text-[#080808] font-["Satoshi"]'>
                    Weekly velocity
                  </CardTitle>
                  <CardDescription className='text-xs text-[#666666]'>
                    Aggregated multi-rail throughput
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-5'>
                  <div className='h-[230px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E5E5' opacity={0.7} />
                        <XAxis dataKey='date' stroke='#666666' fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke='#666666' fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E5E5E5',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#080808',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          }}
                        />
                        <Bar dataKey='volume' fill='#080808' radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── TAB 2: RAILS & HEALTH MATRIX ── */}
        {activeTab === 'rails' && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {connectedRails.map((rail) => (
                <Card key={rail.code} className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='text-xs font-mono font-bold text-[#080808]'>{rail.code}</div>
                    <span className='text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#666666]'>
                      {rail.priority}
                    </span>
                  </div>
                  <div>
                    <div className='text-sm font-semibold text-[#080808]'>{rail.name}</div>
                    <div className='text-xs text-[#666666] font-mono mt-0.5 flex items-center gap-1.5'>
                      <span className={`size-1.5 rounded-full ${rail.status === 'Operational' ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'}`} />
                      <span>{rail.status} &bull; {rail.ping}</span>
                    </div>
                  </div>
                  <div className='pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-mono text-[#666666]'>
                    <span>Traffic allocation</span>
                    <span className='font-semibold text-[#080808]'>{rail.share}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: SMART ROUTING RULES ── */}
        {activeTab === 'routing' && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <Card className='lg:col-span-2 rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4'>
              <div>
                <CardTitle className='text-sm font-bold text-[#080808] font-["Satoshi"]'>
                  Active routing strategies
                </CardTitle>
                <CardDescription className='text-xs text-[#666666] mt-0.5'>
                  Configure multi-rail fallback priorities and latency circuit breakers
                </CardDescription>
              </div>

              <div className='space-y-3 pt-2'>
                <div
                  onClick={() => setActiveRoutingStrategy('dynamic_failover')}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                    activeRoutingStrategy === 'dynamic_failover'
                      ? 'border-[#080808] bg-[#F7F7F5]'
                      : 'border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className='space-y-1'>
                    <div className='font-semibold text-xs text-[#080808] flex items-center gap-2'>
                      <span>Dynamic failover (Recommended)</span>
                      <span className='text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'>Active</span>
                    </div>
                    <p className='text-xs text-[#666666]'>
                      Routes primary traffic to Paystack. If latency exceeds 2500ms or 500 status returned, auto-routes to Monnify VA and Flutterwave.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveRoutingStrategy('cost_optimized')}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                    activeRoutingStrategy === 'cost_optimized'
                      ? 'border-[#080808] bg-[#F7F7F5]'
                      : 'border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <div className='space-y-1'>
                    <div className='font-semibold text-xs text-[#080808]'>Cost optimized</div>
                    <p className='text-xs text-[#666666]'>
                      Routes NGN bank transfers to Monnify (lower capped fee) and cards to Paystack Direct.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4'>
              <CardTitle className='text-sm font-bold text-[#080808] font-["Satoshi"]'>
                Circuit breaker config
              </CardTitle>
              <div className='space-y-3 text-xs font-mono text-[#666666]'>
                <div className='flex justify-between py-1.5 border-b border-[#E5E5E5]'>
                  <span>Failure threshold</span>
                  <span className='font-semibold text-[#080808]'>3 attempts</span>
                </div>
                <div className='flex justify-between py-1.5 border-b border-[#E5E5E5]'>
                  <span>Timeout limit</span>
                  <span className='font-semibold text-[#080808]'>2500ms</span>
                </div>
                <div className='flex justify-between py-1.5 border-b border-[#E5E5E5]'>
                  <span>Reset timeout</span>
                  <span className='font-semibold text-[#080808]'>30 seconds</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── TAB 4: SDK QUICKSTART ── */}
        {activeTab === 'developer' && (
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4 max-w-3xl'>
            <div>
              <CardTitle className='text-sm font-bold text-[#080808] font-["Satoshi"]'>
                Integrate with `quirk-sdk`
              </CardTitle>
              <CardDescription className='text-xs text-[#666666] mt-0.5'>
                Initialize the multi-rail client with dynamic failover in 3 lines of code.
              </CardDescription>
            </div>

            <div className='rounded-xl bg-[#080B10] border border-[#22303A] p-4 font-mono text-xs text-[#F5F7FA] overflow-x-auto space-y-2 select-text'>
              <div className='text-[#666666]'>// 1. Install official SDK</div>
              <div className='text-[#ABFF2A] font-bold'>npm install quirk-sdk</div>
              <div className='pt-2 text-[#666666]'>// 2. Initialize with multi-rail fallback</div>
              <div>import &#123; Quirk &#125; from 'quirk-sdk';</div>
              <div>const quirk = new Quirk(&#123;</div>
              <div className='pl-4'>providers: &#123;</div>
              <div className='pl-8'>paystack: process.env.PAYSTACK_SECRET_KEY,</div>
              <div className='pl-8'>flutterwave: process.env.FLUTTERWAVE_SECRET_KEY,</div>
              <div className='pl-4'>&#125;,</div>
              <div className='pl-4'>strategy: 'dynamic_failover',</div>
              <div>&#125;);</div>
            </div>
          </Card>
        )}
      </Main>
    </div>
  )
}
