import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  Code2,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Sparkles,
  CreditCard,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

export function IntegrationSandbox() {
  const [language, setLanguage] = useState<'typescript' | 'python' | 'curl' | 'go'>('typescript')
  const [useCase, setUseCase] = useState<'multi_rail' | 'virtual_account' | 'webhook_verification' | 'bulk_transfer'>('multi_rail')
  const [amount, setAmount] = useState<number>(25000)
  const [currency, setCurrency] = useState<string>('NGN')
  const [customerEmail, setCustomerEmail] = useState<string>('billing@acme.corp')
  const [copiedCode, setCopiedCode] = useState(false)

  // Interactive Test Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutChannel, setCheckoutChannel] = useState<'card' | 'bank_transfer' | 'ussd'>('card')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleTestPayment = () => {
    setIsProcessingPayment(true)
    setTimeout(() => {
      setIsProcessingPayment(false)
      setPaymentDone(true)
    }, 900)
  }

  const resetCheckout = () => {
    setPaymentDone(false)
    setIsProcessingPayment(false)
    setIsCheckoutOpen(false)
  }

  const getCodeSnippet = () => {
    if (language === 'typescript') {
      if (useCase === 'multi_rail') {
        return `import { Quirk } from '@quirk/sdk';

const quirk = new Quirk({
  strategy: 'dynamic_failover',
  fallbackOrder: ['paystack', 'monnify', 'flutterwave', 'squad'],
  providers: {
    paystack: { secretKey: process.env.PAYSTACK_SECRET_KEY! },
    monnify: { apiKey: process.env.MONNIFY_API_KEY!, secretKey: process.env.MONNIFY_SECRET_KEY!, contractCode: '8492019482' },
    flutterwave: { secretKey: process.env.FLUTTERWAVE_SECRET_KEY! },
    squad: { secretKey: process.env.SQUAD_SECRET_KEY! }
  }
});

// Autonomous Multi-Rail Charge
const charge = await quirk.payments.create({
  amount: ${amount},
  currency: '${currency}',
  customer: { email: '${customerEmail}' },
  reference: 'inv_' + Date.now()
});

console.log('Payment URL:', charge.authorizationUrl);
console.log('Primary Routed Rail:', charge.provider);`
      }

      if (useCase === 'virtual_account') {
        return `import { Quirk } from '@quirk/sdk';

const quirk = new Quirk({ apiKey: process.env.QUIRK_SECRET_KEY! });

// Instant Dynamic Virtual Account (0.5% capped fee)
const account = await quirk.virtualAccounts.create({
  customerName: 'Acme Operations',
  customerEmail: '${customerEmail}',
  bvn: '22345678901',
  currency: 'NGN',
  expiresInHours: 24
});

console.log('Account Number:', account.accountNumber);
console.log('Bank Name:', account.bankName);`
      }

      if (useCase === 'webhook_verification') {
        return `import { Quirk } from '@quirk/sdk';
import express from 'express';

const app = express();
const quirk = new Quirk({ webhookSecret: process.env.QUIRK_WEBHOOK_SECRET! });

app.post('/webhooks/quirk', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-quirk-signature'] as string;
  const isValid = quirk.webhooks.verify(req.body, signature);

  if (!isValid) return res.status(401).send('Invalid signature');

  const event = quirk.webhooks.parse(req.body);
  console.log('Verified Event:', event.type, event.data.reference);
  res.sendStatus(200);
});`
      }

      return `import { Quirk } from '@quirk/sdk';

const quirk = new Quirk({ apiKey: process.env.QUIRK_SECRET_KEY! });

const bulk = await quirk.transfers.bulk({
  currency: 'NGN',
  transfers: [
    { recipientCode: 'RCP_91820', amount: ${amount}, reason: 'Monthly Settlement' }
  ]
});`
    }

    if (language === 'python') {
      return `from quirk import Quirk
import os

client = Quirk(
    strategy="dynamic_failover",
    fallback_order=["paystack", "monnify", "flutterwave", "squad"],
    paystack_key=os.getenv("PAYSTACK_SECRET_KEY"),
    monnify_key=os.getenv("MONNIFY_API_KEY"),
)

payment = client.payments.create(
    amount=${amount},
    currency="${currency}",
    customer={"email": "${customerEmail}"},
    reference="py_txn_001"
)

print("Status:", payment.status)
print("Authorization:", payment.authorization_url)`
    }

    if (language === 'curl') {
      return `curl -X POST https://api.quirk.africa/v1/payments \\
  -H "Authorization: Bearer qrk_live_9f81a20b7" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": ${amount},
    "currency": "${currency}",
    "customer": {
      "email": "${customerEmail}"
    },
    "strategy": "dynamic_failover",
    "fallback_order": ["paystack", "monnify", "flutterwave", "squad"]
  }'`
    }

    return `package main

import (
    "fmt"
    "github.com/quirk-africa/quirk-go"
)

func main() {
    client := quirk.NewClient("qrk_live_9f81a20b7")
    
    resp, err := client.Payments.Create(&quirk.PaymentRequest{
        Amount:   ${amount},
        Currency: "${currency}",
        Email:    "${customerEmail}",
        Strategy: "dynamic_failover",
    })
    if err != nil {
        panic(err)
    }
    fmt.Printf("Payment Created: %s on %s\\n", resp.ID, resp.Provider)
}`
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2.5">
            <Code2 className="size-4 text-[#080808]" />
            <h3 className="font-['Satoshi'] font-bold text-base text-[#080808]">
              Interactive SDK Sandbox
            </h3>
          </div>
          <p className="text-xs text-[#666666] font-['Inter'] mt-1">
            Generate production-ready integration snippets and test the drop-in checkout modal in real-time.
          </p>
        </div>

        <Button
          onClick={() => {
            setPaymentDone(false)
            setIsCheckoutOpen(true)
          }}
          className="bg-[#080808] hover:bg-[#222222] text-white font-['JetBrains_Mono'] text-xs h-9 px-4 gap-2"
        >
          <Sparkles className="size-3.5 text-[#ABFF2A]" />
          Preview Live Checkout Modal
        </Button>
      </div>

      {/* Code Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parameters Form */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-[#E5E5E5] bg-white">
            <CardHeader className="pb-3 pt-5 px-5">
              <CardTitle className="font-['Satoshi'] text-sm font-bold text-[#080808]">
                Integration Parameters
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5 space-y-3 font-['JetBrains_Mono'] text-xs">
              <div>
                <label className="text-[#666666] text-[11px] block mb-1">Use Case</label>
                <Select value={useCase} onValueChange={(val: any) => setUseCase(val)}>
                  <SelectTrigger className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-['JetBrains_Mono'] text-xs">
                    <SelectItem value="multi_rail">Autonomous Multi-Rail Charge</SelectItem>
                    <SelectItem value="virtual_account">Instant Dynamic Virtual Account</SelectItem>
                    <SelectItem value="webhook_verification">HMAC Webhook Listener</SelectItem>
                    <SelectItem value="bulk_transfer">Multi-Gateway Bulk Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[#666666] text-[11px] block mb-1">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#666666] text-[11px] block mb-1">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-['JetBrains_Mono'] text-xs">
                      <SelectItem value="NGN">NGN</SelectItem>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="GHS">GHS</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#666666] text-[11px] block mb-1">Language</label>
                  <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                    <SelectTrigger className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-['JetBrains_Mono'] text-xs">
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="curl">cURL</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[#666666] text-[11px] block mb-1">Customer Email</label>
                <Input
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="h-8 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Snippet Column */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border border-[#080808] bg-[#080808] text-white shadow-xl">
            <CardHeader className="pb-3 pt-4 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-[#A9B0BB]" />
                  <span className="font-['JetBrains_Mono'] text-xs text-[#A9B0BB] uppercase">
                    {language} Snippet
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(getCodeSnippet())}
                  className="h-7 px-2.5 text-xs font-['JetBrains_Mono'] border-[#22303A] bg-[#11161D] text-white hover:bg-[#171D26] gap-1.5"
                >
                  {copiedCode ? <Check className="size-3 text-[#ABFF2A]" /> : <Copy className="size-3" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="rounded-lg bg-[#080B10] p-4 text-[#E0E0E0] font-['JetBrains_Mono'] text-xs overflow-x-auto border border-[#22303A] max-h-[360px]">
                <pre className="leading-relaxed">{getCodeSnippet()}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Drop-in Checkout Preview Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 border border-[#E5E5E5] bg-[#FFFFFF] shadow-2xl overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-[#080808] text-white flex items-center justify-center font-bold text-xs font-['Satoshi']">
                  Q
                </div>
                <DialogTitle className="font-['Satoshi'] font-bold text-sm text-[#080808]">
                  Pay with Quirk
                </DialogTitle>
              </div>
              <Badge variant="outline" className="font-['JetBrains_Mono'] text-[10px] bg-white border-[#E5E5E5]">
                TEST SANDBOX
              </Badge>
            </div>
            <div className="mt-3">
              <div className="text-xs text-[#666666] font-['Inter']">Amount to pay</div>
              <div className="text-2xl font-bold font-['JetBrains_Mono'] text-[#080808]">
                {formatCurrency(amount, currency)}
              </div>
              <div className="text-xs text-[#888888] font-['JetBrains_Mono'] mt-0.5">
                {customerEmail}
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-4 font-['Inter']">
            {!paymentDone ? (
              <>
                {/* Channel Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCheckoutChannel('card')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      checkoutChannel === 'card'
                        ? 'border-[#080808] bg-[#080808] text-white font-medium'
                        : 'border-[#E5E5E5] bg-white text-[#444444] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <CreditCard className="size-4 mx-auto mb-1" />
                    <span className="text-xs block font-['JetBrains_Mono']">Card</span>
                  </button>

                  <button
                    onClick={() => setCheckoutChannel('bank_transfer')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      checkoutChannel === 'bank_transfer'
                        ? 'border-[#080808] bg-[#080808] text-white font-medium'
                        : 'border-[#E5E5E5] bg-white text-[#444444] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <Building2 className="size-4 mx-auto mb-1" />
                    <span className="text-xs block font-['JetBrains_Mono']">Transfer</span>
                  </button>

                  <button
                    onClick={() => setCheckoutChannel('ussd')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      checkoutChannel === 'ussd'
                        ? 'border-[#080808] bg-[#080808] text-white font-medium'
                        : 'border-[#E5E5E5] bg-white text-[#444444] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <Phone className="size-4 mx-auto mb-1" />
                    <span className="text-xs block font-['JetBrains_Mono']">USSD</span>
                  </button>
                </div>

                {/* Channel Form */}
                {checkoutChannel === 'card' && (
                  <div className="space-y-3 font-['JetBrains_Mono'] text-xs">
                    <div>
                      <label className="text-[11px] text-[#666666] block mb-1">Card Number</label>
                      <Input
                        defaultValue="4084 0000 0000 1234"
                        className="h-9 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-[#666666] block mb-1">Expiry</label>
                        <Input
                          defaultValue="12/28"
                          className="h-9 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#666666] block mb-1">CVV</label>
                        <Input
                          defaultValue="892"
                          className="h-9 font-['JetBrains_Mono'] text-xs border-[#E5E5E5]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {checkoutChannel === 'bank_transfer' && (
                  <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] space-y-2 font-['JetBrains_Mono'] text-xs">
                    <div className="text-[11px] text-[#666666]">Dynamic Virtual Account:</div>
                    <div className="text-sm font-bold text-[#080808]">7482 9102 91</div>
                    <div className="text-xs text-[#444444]">Wema Bank • Quirk Escrow</div>
                    <div className="text-[10px] text-[#888888] pt-1">
                      Account expires in 23m 59s. Automatic instant confirmation.
                    </div>
                  </div>
                )}

                {checkoutChannel === 'ussd' && (
                  <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5] space-y-2 font-['JetBrains_Mono'] text-xs">
                    <div className="text-[11px] text-[#666666]">Dial USSD Code on registered SIM:</div>
                    <div className="text-sm font-bold text-[#080808]">*737*50*25000*819#</div>
                    <div className="text-[10px] text-[#888888]">
                      Supports GTBank, Zenith, Access, UBA, and FirstBank.
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleTestPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-[#080808] hover:bg-[#222222] text-white font-['JetBrains_Mono'] text-xs h-10 gap-2 mt-3"
                >
                  <ShieldCheck className="size-4 text-[#22C55E]" />
                  {isProcessingPayment
                    ? 'Routing via Optimal Rail...'
                    : `Authorize ${formatCurrency(amount, currency)}`}
                </Button>
              </>
            ) : (
              <div className="text-center py-6 space-y-3 font-['Inter']">
                <div className="size-12 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="font-['Satoshi'] font-bold text-base text-[#080808]">
                  Payment Authorized Successfully
                </div>
                <p className="text-xs text-[#666666] font-['JetBrains_Mono'] max-w-[280px] mx-auto">
                  Routed via Paystack Direct • Latency 142ms • Telemetry recorded.
                </p>
                <Button
                  onClick={resetCheckout}
                  variant="outline"
                  className="font-['JetBrains_Mono'] text-xs h-8 border-[#E5E5E5] mt-2"
                >
                  Close Preview
                </Button>
              </div>
            )}

            <div className="text-center text-[10px] font-['JetBrains_Mono'] text-[#888888] pt-1">
              Secured with AES-256-GCM by Quirk Multi-Rail Control Plane
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
