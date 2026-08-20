import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, RefreshCw, Server, ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'

interface GatewayStatus {
  id: string
  name: string
  code: string
  provider: 'paystack' | 'flutterwave' | 'monnify' | 'squad'
  status: 'operational' | 'degraded' | 'maintenance'
  latencyMs: number
  successRate24h: number
  uptime30d: number
  supportedRails: string[]
  recommendedFor: string
  lastChecked: string
}

const INITIAL_GATEWAYS: GatewayStatus[] = [
  {
    id: 'pstk',
    name: 'Paystack Direct',
    code: 'PSTK',
    provider: 'paystack',
    status: 'operational',
    latencyMs: 142,
    successRate24h: 99.7,
    uptime30d: 99.98,
    supportedRails: ['Cards (Visa/Mastercard/Verve)', 'Direct Debit', 'Apple Pay', 'USSD'],
    recommendedFor: 'High-velocity retail cards & tokenized recurring billing',
    lastChecked: 'Just now',
  },
  {
    id: 'flw',
    name: 'Flutterwave Switch',
    code: 'FLW',
    provider: 'flutterwave',
    status: 'operational',
    latencyMs: 188,
    successRate24h: 98.9,
    uptime30d: 99.85,
    supportedRails: ['Multi-currency (NGN, KES, GHS, ZAR, USD)', 'M-Pesa STK', 'Cards', 'Bank Transfer'],
    recommendedFor: 'Pan-African cross-border payments & mobile money',
    lastChecked: 'Just now',
  },
  {
    id: 'mnfy',
    name: 'Monnify Dynamic VA',
    code: 'MNFY',
    provider: 'monnify',
    status: 'operational',
    latencyMs: 118,
    successRate24h: 99.9,
    uptime30d: 99.99,
    supportedRails: ['Reserved & Dynamic Virtual Accounts', 'Account Transfer', 'USSD'],
    recommendedFor: 'High-ticket B2B transfers with instant bank notification & 0.5% fee cap',
    lastChecked: 'Just now',
  },
  {
    id: 'sqd',
    name: 'Squad by Habari',
    code: 'SQD',
    provider: 'squad',
    status: 'operational',
    latencyMs: 130,
    successRate24h: 99.4,
    uptime30d: 99.92,
    supportedRails: ['Virtual Accounts', 'Cards', 'USSD (*737#)', 'Payment Links'],
    recommendedFor: 'Guaranty Trust Bank ecosystem & low-latency USSD rails',
    lastChecked: 'Just now',
  },
]

export function GatewayHealthMatrix() {
  const [gateways, setGateways] = useState<GatewayStatus[]>(INITIAL_GATEWAYS)
  const [isPinging, setIsPinging] = useState(false)

  const handlePingAll = () => {
    setIsPinging(true)
    setTimeout(() => {
      setGateways(prev =>
        prev.map(g => ({
          ...g,
          latencyMs: Math.max(90, Math.floor(g.latencyMs + (Math.random() * 30 - 15))),
          lastChecked: 'Just now',
        }))
      )
      setIsPinging(false)
    }, 600)
  }

  const averageLatency = Math.round(
    gateways.reduce((acc, curr) => acc + curr.latencyMs, 0) / gateways.length
  )
  const networkSuccessRate = (
    gateways.reduce((acc, curr) => acc + curr.successRate24h, 0) / gateways.length
  ).toFixed(2)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
              <h3 className="font-['Satoshi'] font-bold text-base text-[#080808]">
                Multi-Rail Network Status
              </h3>
              <Badge variant="outline" className="text-xs font-['JetBrains_Mono'] border-[#E5E5E5] bg-white text-[#080808]">
                4 / 4 Gateways Connected
              </Badge>
            </div>
            <p className="text-xs text-[#666666] font-['Inter'] mt-1">
              Real-time telemetry and ping health across African payment gateways.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handlePingAll}
            disabled={isPinging}
            className="w-full sm:w-auto bg-[#080808] hover:bg-[#222222] text-white font-['JetBrains_Mono'] text-xs h-10 sm:h-9 px-4 gap-2 rounded-xl active:scale-[0.97]"
          >
            <RefreshCw className={`size-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging Rails...' : 'Ping All Rails'}
          </Button>
        </div>

        {/* Telemetry Summary Bar (Visible on all mobile screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:inline-flex md:w-fit items-center gap-2 sm:gap-4 text-xs font-['JetBrains_Mono'] p-2.5 sm:px-4 sm:py-2 bg-white border border-[#E5E5E5] rounded-xl">
          <div>
            <span className="text-[#888888] block sm:inline">Avg Latency:</span>{' '}
            <span className="font-bold text-[#080808]">{averageLatency}ms</span>
          </div>
          <div className="hidden sm:block h-3 w-px bg-[#E5E5E5]" />
          <div>
            <span className="text-[#888888] block sm:inline">Network Success:</span>{' '}
            <span className="font-bold text-[#080808]">{networkSuccessRate}%</span>
          </div>
        </div>
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map(gateway => (
          <Card key={gateway.id} className="border border-[#E5E5E5] bg-white hover:border-[#CCCCCC] transition-colors rounded-2xl">
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-['Satoshi'] text-base font-bold text-[#080808]">
                      {gateway.name}
                    </CardTitle>
                    <span className="text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#555555]">
                      {gateway.code}
                    </span>
                  </div>
                  <CardDescription className="text-xs text-[#666666] font-['Inter'] line-clamp-2 sm:line-clamp-1">
                    {gateway.recommendedFor}
                  </CardDescription>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] font-['JetBrains_Mono'] text-[#15803D]">
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                  Operational
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-5 pb-4 space-y-4">
              {/* Telemetry Stats Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#FBFBFA] border border-[#ECECE9] rounded-xl text-center sm:text-left">
                <div>
                  <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-[#888888]">
                    Latency
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-['JetBrains_Mono'] text-[#080808] mt-0.5 tabular-nums">
                    {gateway.latencyMs}ms
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-[#888888]">
                    24h Success
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-['JetBrains_Mono'] text-[#080808] mt-0.5 tabular-nums">
                    {gateway.successRate24h}%
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-['JetBrains_Mono'] text-[#888888]">
                    30d Uptime
                  </div>
                  <div className="text-xs sm:text-sm font-bold font-['JetBrains_Mono'] text-[#080808] mt-0.5 tabular-nums">
                    {gateway.uptime30d}%
                  </div>
                </div>
              </div>

              {/* Supported Rails Pills */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-[#444444] font-['Inter']">
                  Active Payment Methods
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gateway.supportedRails.map((rail, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-lg bg-white border border-[#E5E5E5] text-[#333333]"
                    >
                      {rail}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0F0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#888888] font-['JetBrains_Mono']">
                <span>Health check: {gateway.lastChecked}</span>
                <span className="text-[#080808] font-medium flex items-center gap-1">
                  <ShieldCheck className="size-3 text-[#22C55E]" /> Direct-to-Gateway Fallback
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
