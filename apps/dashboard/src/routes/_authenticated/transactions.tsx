import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { transactionStatusTabs } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { TransactionStatus } from '@/lib/types'
import { 
  Loader2, Search, Filter, Copy, 
  ArrowUpRight, CreditCard, Banknote, RefreshCcw, 
  XCircle, Clock, CheckCircle2, Plus, Check 
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/transactions')({
  component: Transactions,
})

const statusStyles: Record<TransactionStatus, { bg: string; text: string; icon: any }> = {
  pending: { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700', icon: Clock },
  success: { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', icon: CheckCircle2 },
  failed: { bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-700', icon: XCircle },
  refunded: { bg: 'bg-sky-50 border border-sky-200', text: 'text-sky-700', icon: RefreshCcw },
}

function Transactions() {
  const { 
    loading, filteredTransactions, filter, setFilter, setPage, searchQuery, setSearchQuery,
    createModalOpen, setCreateModalOpen, creating, form, setForm, handleCreateTransaction,
    stats, selected, setSelected, refunding, confirmRefundOpen, setConfirmRefundOpen, handleRefund
  } = useTransactions()

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    toast.success(`${label} copied`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className='min-h-screen bg-[#F7F7F5] text-[#080808]'>
      <Header className='bg-[#FFFFFF]/95 border-b border-[#E5E5E5]'>
        <div className='flex items-center gap-3 font-["Satoshi"] font-semibold text-sm text-[#080808]'>
          <span>Transactions</span>
        </div>

        <div className='flex items-center gap-3 ms-auto'>
          <div
            role='status'
            className='hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-xs font-mono text-[#080808]'
          >
            <span className='size-2 rounded-full bg-[#22C55E] animate-pulse' />
            <span className='text-[11px] font-medium'>All Rails Operational (99.98%)</span>
          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className='inline-flex items-center justify-center gap-1.5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-medium text-xs px-3.5 py-1.5 rounded-lg active:scale-[0.98] transition-transform duration-150 ease-out shadow-xs'
          >
            <Plus className='size-3.5' />
            <span>Create charge</span>
          </Button>

          <ProfileDropdown />
        </div>
      </Header>

      <Main className='px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]'>
          <div className='space-y-1'>
            <h1 className='font-["Satoshi"] text-2xl sm:text-3xl font-bold tracking-tight text-[#080808] [text-wrap:balance]'>
              Transaction Ledger
            </h1>
            <p className='text-xs sm:text-sm text-[#666666] [text-wrap:pretty]'>
              Real-time multi-rail authorization stream, settlement states, and payment telemetry.
            </p>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <p className='text-[10px] font-mono text-[#666666] uppercase tracking-wider font-semibold'>Total Volume (NGN)</p>
            <p className='text-xl sm:text-2xl font-bold font-mono text-[#080808] mt-1 tabular-nums'>
              {formatCurrency(stats.totalVolume, 'NGN')}
            </p>
          </Card>
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <p className='text-[10px] font-mono text-[#666666] uppercase tracking-wider font-semibold'>Success Rate</p>
            <p className='text-xl sm:text-2xl font-bold font-mono text-[#22C55E] mt-1 tabular-nums'>
              {stats.successRate.toFixed(1)}%
            </p>
          </Card>
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <p className='text-[10px] font-mono text-[#666666] uppercase tracking-wider font-semibold'>Authorized Count</p>
            <p className='text-xl sm:text-2xl font-bold font-mono text-[#080808] mt-1 tabular-nums'>
              {stats.successCount}
            </p>
          </Card>
          <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
            <p className='text-[10px] font-mono text-[#666666] uppercase tracking-wider font-semibold'>Failed / Retried</p>
            <p className='text-xl sm:text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums'>
              {stats.failedCount}
            </p>
          </Card>
        </div>

        {/* Filter Controls (Astryx Pill Segmented Controls) */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
          <div className='flex items-center gap-1 p-1 bg-[#EBEBEA] border border-[#E0E0DE] rounded-xl overflow-x-auto no-scrollbar'>
            {transactionStatusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setFilter(tab.value as any)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap ${
                  filter === tab.value
                    ? 'bg-[#FFFFFF] text-[#080808] font-semibold shadow-2xs'
                    : 'text-[#666666] hover:text-[#080808]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='relative w-full sm:w-72'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#666666]' />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search reference, customer, or rail...'
              className='pl-9 bg-[#FFFFFF] border-[#E5E5E5] rounded-xl text-xs text-[#080808] h-9 focus-visible:ring-[#080808]'
            />
          </div>
        </div>

        {/* Transactions Table */}
        <Card className='rounded-2xl border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden'>
          {loading ? (
            <div className='p-6 space-y-4'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center justify-between py-2 border-b border-[#E5E5E5]'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-16' />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className='p-12 text-center text-[#666666] space-y-2'>
              <p className='text-sm font-semibold text-[#080808] font-["Satoshi"]'>No transactions matching criteria</p>
              <p className='text-xs'>Try refining your filter parameters or search query.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='border-b border-[#E5E5E5] bg-[#FAFAFA] text-[#666666] font-mono text-[11px]'>
                    <th className='py-3.5 px-4 font-medium'>Reference</th>
                    <th className='py-3.5 px-4 font-medium'>Customer</th>
                    <th className='py-3.5 px-4 font-medium'>Active rail</th>
                    <th className='py-3.5 px-4 font-medium'>Amount</th>
                    <th className='py-3.5 px-4 font-medium'>Date</th>
                    <th className='py-3.5 px-4 font-medium text-right'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#E5E5E5]'>
                  {filteredTransactions.map((tx) => {
                    const statusConfig = statusStyles[tx.status] || statusStyles.pending
                    const StatusIcon = statusConfig.icon

                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelected(tx)}
                        className='hover:bg-[#F7F7F5] transition-colors duration-100 cursor-pointer'
                      >
                        <td className='py-3.5 px-4 font-mono font-medium text-[#080808]'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(tx.reference || tx.id, 'Transaction ID')
                            }}
                            className='hover:text-[#666666] transition-colors duration-150 inline-flex items-center gap-1.5'
                            title='Copy reference'
                            aria-label={`Copy reference ${tx.reference || tx.id}`}
                          >
                            <span className='truncate max-w-[120px]'>{tx.reference || tx.id}</span>
                            {copiedKey === (tx.reference || tx.id) ? (
                              <Check className='size-3 text-[#22C55E]' />
                            ) : (
                              <Copy className='size-3 text-[#999999] opacity-40 hover:opacity-100' />
                            )}
                          </button>
                        </td>
                        <td className='py-3.5 px-4'>
                          <div className='font-medium text-[#080808]'>{tx.customer_email || 'Customer'}</div>
                          <div className='text-[10px] text-[#666666] font-mono'>via {tx.channel || 'card'}</div>
                        </td>
                        <td className='py-3.5 px-4'>
                          <span className='inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] font-mono text-[10px] text-[#080808] whitespace-nowrap'>
                            <span className='size-1 rounded-full bg-[#22C55E]' />
                            {tx.provider || 'Paystack'}
                          </span>
                        </td>
                        <td className='py-3.5 px-4 font-mono font-semibold text-[#080808] tabular-nums'>
                          {formatCurrency(tx.amount, tx.currency)}
                        </td>
                        <td className='py-3.5 px-4 text-[#666666] font-mono text-[11px] tabular-nums'>
                          {formatDate(tx.created_at)}
                        </td>
                        <td className='py-3.5 px-4 text-right'>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className='size-3' />
                            <span>{tx.status}</span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </Main>

      {/* Transaction Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className='bg-[#FFFFFF] border-l border-[#E5E5E5] text-[#080808] w-full sm:max-w-md p-6 overflow-y-auto'>
          {selected && (
            <div className='space-y-6'>
              <SheetHeader className='pb-4 border-b border-[#E5E5E5]'>
                <SheetTitle className='font-["Satoshi"] text-lg text-[#080808] font-bold'>
                  Transaction Details
                </SheetTitle>
                <SheetDescription className='text-xs text-[#666666] font-mono break-all'>
                  {selected.reference || selected.id}
                </SheetDescription>
              </SheetHeader>

              <div className='space-y-4 text-xs font-mono'>
                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Settlement amount</span>
                  <span className='font-bold text-[#080808] text-sm tabular-nums'>
                    {formatCurrency(selected.amount, selected.currency)}
                  </span>
                </div>

                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Authorization status</span>
                  <span className='font-semibold text-emerald-700 capitalize'>{selected.status}</span>
                </div>

                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Selected switch rail</span>
                  <span className='font-semibold text-[#080808]'>{selected.provider || 'Paystack'}</span>
                </div>

                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Customer identifier</span>
                  <span className='text-[#080808] font-sans font-medium'>{selected.customer_email}</span>
                </div>

                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Authorization channel</span>
                  <span className='text-[#080808] capitalize'>{selected.channel || 'Card'}</span>
                </div>

                <div className='flex justify-between py-2 border-b border-[#E5E5E5]'>
                  <span className='text-[#666666]'>Creation timestamp</span>
                  <span className='text-[#080808] tabular-nums'>{formatDate(selected.created_at)}</span>
                </div>
              </div>

              {selected.status === 'success' && (
                <div className='pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => setConfirmRefundOpen(true)}
                    className='w-full border-[#E5E5E5] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-medium rounded-xl h-10'
                  >
                    Initiate refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Charge Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className='bg-[#FFFFFF] border-[#E5E5E5] text-[#080808] rounded-2xl shadow-xl'>
          <DialogHeader>
            <DialogTitle className='font-["Satoshi"] text-lg text-[#080808] font-bold'>Initiate Multi-Rail Charge</DialogTitle>
            <DialogDescription className='text-xs text-[#666666]'>Test real-time routing and simulated settlement.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='tx-email' className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>Customer email</label>
              <Input
                id='tx-email'
                value={form.customer_email}
                onChange={(e) => setForm(prev => ({ ...prev, customer_email: e.target.value }))}
                placeholder='customer@company.com'
                className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808]'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='tx-amount' className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>Amount (NGN)</label>
              <Input
                id='tx-amount'
                type='number'
                value={form.amount}
                onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808] font-mono font-bold'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setCreateModalOpen(false)} className='text-xs text-[#666666] hover:text-[#080808] rounded-lg'>Cancel</Button>
            <Button onClick={handleCreateTransaction} disabled={creating} className='rounded-lg px-5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-xs'>
              {creating ? <><Loader2 className='size-3.5 mr-2 animate-spin' /> Processing...</> : 'Execute charge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
