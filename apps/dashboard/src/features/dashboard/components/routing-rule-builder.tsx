import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Route,
  ArrowRight,
  ShieldAlert,
  Play,
  Sliders,
  CheckCircle2,
  ArrowDownUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

interface RoutingRule {
  id: string
  name: string
  condition: string
  targetProvider: string
  fallbackProvider: string
  active: boolean
}

const DEFAULT_RULES: RoutingRule[] = [
  {
    id: 'rule-1',
    name: 'High-Ticket Bank Transfers',
    condition: 'Amount > NGN 50,000',
    targetProvider: 'Monnify Dynamic VA',
    fallbackProvider: 'Paystack Direct',
    active: true,
  },
  {
    id: 'rule-2',
    name: 'East African Mobile Money',
    condition: 'Currency == KES (M-Pesa STK)',
    targetProvider: 'Flutterwave Switch',
    fallbackProvider: 'Paystack Direct',
    active: true,
  },
  {
    id: 'rule-3',
    name: 'Retail Cards & Recurring Billing',
    condition: 'Channel == Card & Amount < NGN 50,000',
    targetProvider: 'Paystack Direct',
    fallbackProvider: 'Flutterwave Switch',
    active: true,
  },
  {
    id: 'rule-4',
    name: 'GTBank Direct USSD Rail',
    condition: 'Bank == GTBank (*737#)',
    targetProvider: 'Squad by Habari',
    fallbackProvider: 'Paystack Direct',
    active: true,
  },
]

export function RoutingRuleBuilder() {
  const [strategy, setStrategy] = useState<'dynamic_failover' | 'least_cost' | 'highest_success_rate'>('dynamic_failover')
  const [priorityOrder, setPriorityOrder] = useState<string[]>([
    'Paystack Direct',
    'Monnify Dynamic VA',
    'Flutterwave Switch',
    'Squad by Habari',
  ])
  const [rules, setRules] = useState<RoutingRule[]>(DEFAULT_RULES)

  // Simulator State
  const [simAmount, setSimAmount] = useState<number>(25000)
  const [simCurrency, setSimCurrency] = useState<string>('NGN')
  const [simChannel, setSimChannel] = useState<string>('card')
  const [simulationResult, setSimulationResult] = useState<{
    primaryRail: string
    secondaryRail: string
    tertiaryRail: string
    estimatedLatency: string
    estimatedFee: string
    failoverTrigger: string
    simulatedTrace: string[]
  } | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      let primary = 'Paystack Direct'
      let secondary = 'Monnify Dynamic VA'
      let tertiary = 'Flutterwave Switch'
      let fee = '1.5% (capped at ₦2,000)'

      if (simCurrency === 'KES') {
        primary = 'Flutterwave Switch'
        secondary = 'Paystack Direct'
        fee = '2.5% M-Pesa STK'
      } else if (simAmount > 50000 && simCurrency === 'NGN') {
        primary = 'Monnify Dynamic VA'
        secondary = 'Paystack Direct'
        fee = '0.5% (capped at ₦1,000)'
      } else if (simChannel === 'ussd') {
        primary = 'Squad by Habari'
        secondary = 'Paystack Direct'
        fee = '1.0% USSD rail'
      }

      setSimulationResult({
        primaryRail: primary,
        secondaryRail: secondary,
        tertiaryRail: tertiary,
        estimatedLatency: '135ms',
        estimatedFee: fee,
        failoverTrigger: 'HTTP 5xx, gateway timeout (>3500ms), or provider network downtime',
        simulatedTrace: [
          `1. Quirk SDK intercepted transaction for ${formatCurrency(simAmount, simCurrency)} (${simChannel}).`,
          `2. Rule Engine evaluated active conditions: Matched "${simAmount > 50000 && simCurrency === 'NGN' ? 'High-Ticket Bank Transfers' : simCurrency === 'KES' ? 'East African Mobile Money' : 'Default Retail Priority'}".`,
          `3. Primary dispatch assigned to: ${primary}.`,
          `4. Autonomous failover prepared: If ${primary} drops, failover sequence transfers to ${secondary} -> ${tertiary} in 80ms.`,
        ],
      })
      setIsSimulating(false)
    }, 450)
  }

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...priorityOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      const temp = newOrder[index]
      newOrder[index] = newOrder[targetIndex]
      newOrder[targetIndex] = temp
      setPriorityOrder(newOrder)
    }
  }

  return (
    <div className="space-y-6">
      {/* Strategy Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Failover Chain */}
          <Card className="border border-[#E5E5E5] bg-white">
            <CardHeader className="pb-3 pt-5 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-['Satoshi'] text-base font-bold text-[#080808]">
                    Autonomous Fallback Sequence
                  </CardTitle>
                  <CardDescription className="text-xs text-[#666666] font-['Inter']">
                    The SDK cascades through these rails automatically if the primary gateway fails or times out.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-['JetBrains_Mono'] text-xs border-[#E5E5E5] text-[#080808] bg-[#FAFAFA]">
                  Strategy: Dynamic Failover
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-3">
              {priorityOrder.map((providerName, idx) => (
                <div
                  key={providerName}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] transition-all hover:border-[#D5D5D5]"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#080808] text-white flex items-center justify-center text-xs font-['JetBrains_Mono'] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-['Satoshi'] text-sm font-bold text-[#080808]">
                        {providerName}
                      </div>
                      <div className="text-xs font-['JetBrains_Mono'] text-[#888888]">
                        {idx === 0 ? 'Primary Rail (Default dispatch)' : `Tier ${idx + 1} Standby Rail`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={idx === 0}
                      onClick={() => movePriority(idx, 'up')}
                      className="h-8 w-8 p-0 text-[#666666] hover:text-[#080808] disabled:opacity-30"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={idx === priorityOrder.length - 1}
                      onClick={() => movePriority(idx, 'down')}
                      className="h-8 w-8 p-0 text-[#666666] hover:text-[#080808] disabled:opacity-30"
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conditional Routing Rules */}
          <Card className="border border-[#E5E5E5] bg-white">
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className="font-['Satoshi'] text-base font-bold text-[#080808]">
                Condition-Based Routing Rules
              </CardTitle>
              <CardDescription className="text-xs text-[#666666] font-['Inter']">
                Deterministic routing override rules evaluated before standard fallback execution.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-3">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-white border border-[#E5E5E5]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-['Satoshi'] font-bold text-sm text-[#080808]">
                        {rule.name}
                      </span>
                      <span className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]">
                        Active
                      </span>
                    </div>
                    <div className="text-xs font-['JetBrains_Mono'] text-[#666666]">
                      If <span className="font-bold text-[#080808]">{rule.condition}</span> → Route via{' '}
                      <span className="font-bold text-[#080808]">{rule.targetProvider}</span>
                    </div>
                  </div>

                  <div className="text-xs font-['JetBrains_Mono'] text-[#888888]">
                    Fallback: {rule.fallbackProvider}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live Simulator Panel */}
        <div className="space-y-6">
          <Card className="border border-[#080808] bg-[#080808] text-white shadow-xl">
            <CardHeader className="pb-3 pt-5 px-6">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-[#ABFF2A]" />
                <CardTitle className="font-['Satoshi'] text-base font-bold text-white">
                  Routing Simulator
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-[#A9B0BB] font-['Inter']">
                Dry-run simulated transactions to inspect rail resolution and failover logic in real-time.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-4">
              <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
                <div>
                  <label className="text-[#A9B0BB] text-[11px] block mb-1">Simulated Amount</label>
                  <Input
                    type="number"
                    value={simAmount}
                    onChange={e => setSimAmount(Number(e.target.value))}
                    className="bg-[#11161D] border-[#22303A] text-white h-9 font-['JetBrains_Mono'] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#A9B0BB] text-[11px] block mb-1">Currency</label>
                    <Select value={simCurrency} onValueChange={setSimCurrency}>
                      <SelectTrigger className="bg-[#11161D] border-[#22303A] text-white h-9 font-['JetBrains_Mono'] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#11161D] border-[#22303A] text-white font-['JetBrains_Mono'] text-xs">
                        <SelectItem value="NGN">NGN (Nigeria)</SelectItem>
                        <SelectItem value="KES">KES (Kenya)</SelectItem>
                        <SelectItem value="GHS">GHS (Ghana)</SelectItem>
                        <SelectItem value="USD">USD (Global)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#A9B0BB] text-[11px] block mb-1">Channel</label>
                    <Select value={simChannel} onValueChange={setSimChannel}>
                      <SelectTrigger className="bg-[#11161D] border-[#22303A] text-white h-9 font-['JetBrains_Mono'] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#11161D] border-[#22303A] text-white font-['JetBrains_Mono'] text-xs">
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="ussd">USSD</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="w-full bg-white hover:bg-[#EAEAEA] text-[#080808] font-bold font-['JetBrains_Mono'] text-xs h-9 gap-2 mt-2"
                >
                  <Play className="size-3.5 fill-current" />
                  {isSimulating ? 'Evaluating Rails...' : 'Simulate Transaction Route'}
                </Button>
              </div>

              {/* Simulation Result Output */}
              {simulationResult && (
                <div className="mt-4 p-4 rounded-lg bg-[#11161D] border border-[#22303A] space-y-3 font-['JetBrains_Mono'] text-xs">
                  <div className="flex items-center justify-between border-b border-[#22303A] pb-2">
                    <span className="text-[#A9B0BB]">Resolved Primary:</span>
                    <span className="text-[#ABFF2A] font-bold">{simulationResult.primaryRail}</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#22303A] pb-2">
                    <span className="text-[#A9B0BB]">Estimated Fee:</span>
                    <span className="text-white">{simulationResult.estimatedFee}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-[#A9B0BB] block">Execution Path Trace:</span>
                    <div className="text-[11px] text-[#CCCCCC] space-y-1 bg-[#080B10] p-2.5 rounded border border-[#171D26]">
                      {simulationResult.simulatedTrace.map((step, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
