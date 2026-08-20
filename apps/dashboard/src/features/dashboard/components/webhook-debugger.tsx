import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react'

interface WebhookEventRecord {
  id: string
  event: string
  provider: string
  reference: string
  amount: number
  currency: string
  status: 'delivered' | 'failed' | 'retrying'
  statusCode: number
  latencyMs: number
  signatureValid: boolean
  timestamp: string
  payload: Record<string, any>
}

const SAMPLE_WEBHOOKS: WebhookEventRecord[] = [
  {
    id: 'evt_whk_019a4f21',
    event: 'payment.success',
    provider: 'Paystack Direct',
    reference: 'pvt_38d9f1a029',
    amount: 5000000,
    currency: 'NGN',
    status: 'delivered',
    statusCode: 200,
    latencyMs: 142,
    signatureValid: true,
    timestamp: '2 mins ago',
    payload: {
      event: 'payment.success',
      data: {
        id: 39481928,
        reference: 'pvt_38d9f1a029',
        amount: 5000000,
        currency: 'NGN',
        status: 'success',
        gateway_response: 'Successful',
        channel: 'card',
        customer: { email: 'alex@company.dev' },
        provider: 'paystack',
        paid_at: '2026-08-20T04:12:00Z',
      },
    },
  },
  {
    id: 'evt_whk_019a4f22',
    event: 'virtual_account.credited',
    provider: 'Monnify Dynamic VA',
    reference: 'mnfy_va_8492019',
    amount: 15000000,
    currency: 'NGN',
    status: 'delivered',
    statusCode: 200,
    latencyMs: 110,
    signatureValid: true,
    timestamp: '7 mins ago',
    payload: {
      event: 'virtual_account.credited',
      data: {
        account_number: '7482910291',
        bank_name: 'Wema Bank',
        amount_paid: 15000000,
        settlement_amount: 14925000,
        reference: 'mnfy_va_8492019',
        status: 'COMPLETED',
        provider: 'monnify',
      },
    },
  },
  {
    id: 'evt_whk_019a4f23',
    event: 'payment.failed',
    provider: 'Flutterwave Switch',
    reference: 'flw_mpesa_91028',
    amount: 8500,
    currency: 'KES',
    status: 'failed',
    statusCode: 504,
    latencyMs: 3820,
    signatureValid: true,
    timestamp: '15 mins ago',
    payload: {
      event: 'payment.failed',
      data: {
        reference: 'flw_mpesa_91028',
        amount: 8500,
        currency: 'KES',
        status: 'failed',
        reason: 'Provider gateway timeout on STK push prompt',
        failover_attempted: true,
        failover_target: 'Paystack Direct',
      },
    },
  },
]

export function WebhookDebugger() {
  const [events, setEvents] = useState<WebhookEventRecord[]>(SAMPLE_WEBHOOKS)
  const [selectedEvent, setSelectedEvent] = useState<WebhookEventRecord>(SAMPLE_WEBHOOKS[0])
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [targetEndpoint, setTargetEndpoint] = useState('https://api.mycompany.com/webhooks/quirk')
  const [isReplaying, setIsReplaying] = useState(false)
  const [replaySuccessMessage, setReplaySuccessMessage] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPayload(true)
    setTimeout(() => setCopiedPayload(false), 2000)
  }

  const handleReplayEvent = () => {
    setIsReplaying(true)
    setReplaySuccessMessage(null)
    setTimeout(() => {
      setIsReplaying(false)
      setReplaySuccessMessage(`Dispatched ${selectedEvent.event} to ${targetEndpoint} with valid HMAC-SHA256 signature (HTTP 200 OK).`)
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="size-4 text-[#080808]" />
            <h3 className="font-['Satoshi'] font-bold text-base text-[#080808]">
              Webhook Inspector & Event Replay
            </h3>
          </div>
          <p className="text-xs text-[#666666] font-['Inter'] mt-1">
            Debug incoming gateway webhooks, verify cryptographic signatures, and replay events to your staging server.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E5] text-[#080808]">
          <ShieldCheck className="size-4 text-[#22C55E]" />
          HMAC-SHA256 Signature Checking Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Events Table Column */}
        <div className="lg:col-span-7 space-y-3">
          <Card className="border border-[#E5E5E5] bg-white">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="font-['Satoshi'] text-sm font-bold text-[#080808]">
                Recent Ingested Events
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-[#F0F0F0]">
                {events.map(item => {
                  const isSelected = selectedEvent.id === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedEvent(item)
                        setReplaySuccessMessage(null)
                      }}
                      className={`w-full text-left p-4 transition-colors flex items-center justify-between gap-3 ${
                        isSelected ? 'bg-[#F7F7F5]' : 'hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#080808]">
                            {item.event}
                          </span>
                          <span
                            className={`text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded ${
                              item.status === 'delivered'
                                ? 'bg-[#F0FDF4] text-[#15803D]'
                                : 'bg-[#FEF2F2] text-[#B91C1C]'
                            }`}
                          >
                            HTTP {item.statusCode}
                          </span>
                        </div>
                        <div className="text-[11px] font-['JetBrains_Mono'] text-[#666666]">
                          {item.provider} • ref: {item.reference}
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-['JetBrains_Mono'] text-[#888888]">
                        <div>{item.timestamp}</div>
                        <div className="text-[#080808] font-medium">{item.latencyMs}ms</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payload & Replay Column */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-[#E5E5E5] bg-white">
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="font-['Satoshi'] text-sm font-bold text-[#080808]">
                  Event Payload Inspector
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(selectedEvent.payload, null, 2))}
                  className="h-7 px-2.5 text-xs font-['JetBrains_Mono'] border-[#E5E5E5] gap-1.5"
                >
                  {copiedPayload ? <Check className="size-3 text-[#22C55E]" /> : <Copy className="size-3" />}
                  {copiedPayload ? 'Copied' : 'Copy JSON'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5 space-y-4">
              {/* Event Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs font-['JetBrains_Mono'] p-2.5 bg-[#FBFBFA] border border-[#ECECE9] rounded-md">
                <div>
                  <span className="text-[#888888] text-[10px] block">EVENT ID</span>
                  <span className="font-bold text-[#080808]">{selectedEvent.id}</span>
                </div>
                <div>
                  <span className="text-[#888888] text-[10px] block">HMAC SIGNATURE</span>
                  <span className="text-[#15803D] font-bold">✓ Validated</span>
                </div>
              </div>

              {/* JSON Viewer */}
              <div className="rounded-lg bg-[#080B10] p-3 text-white font-['JetBrains_Mono'] text-[11px] overflow-x-auto max-h-[220px] border border-[#22303A]">
                <pre className="text-[#E0E0E0]">{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
              </div>

              {/* Replay Console */}
              <div className="space-y-2 pt-2 border-t border-[#F0F0F0]">
                <label className="text-xs font-['JetBrains_Mono'] text-[#444444] font-medium block">
                  Replay to Webhook Endpoint
                </label>
                <Input
                  value={targetEndpoint}
                  onChange={e => setTargetEndpoint(e.target.value)}
                  className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                  placeholder="https://api.mycompany.com/webhooks/quirk"
                />

                <Button
                  onClick={handleReplayEvent}
                  disabled={isReplaying}
                  className="w-full bg-[#080808] hover:bg-[#222222] text-white font-['JetBrains_Mono'] text-xs h-8 gap-2"
                >
                  <Send className={`size-3 ${isReplaying ? 'animate-spin' : ''}`} />
                  {isReplaying ? 'Dispatching Webhook...' : 'Dispatch Replay Webhook'}
                </Button>

                {replaySuccessMessage && (
                  <div className="p-2.5 rounded bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] font-['JetBrains_Mono'] text-[#15803D] flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" />
                    <span>{replaySuccessMessage}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
