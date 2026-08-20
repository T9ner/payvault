import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
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
    XCircle, Clock, CheckCircle2 
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/transactions')({
  component: Transactions,
})

const statusStyles: Record<TransactionStatus, { bg: string; text: string; icon: any }> = {
  pending: { bg: 'bg-amber-500/10 border border-amber-500/20', text: 'text-amber-400', icon: Clock },
  success: { bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2 },
  failed: { bg: 'bg-rose-500/10 border border-rose-500/20', text: 'text-rose-400', icon: XCircle },
  refunded: { bg: 'bg-blue-500/10 border border-blue-500/20', text: 'text-blue-400', icon: RefreshCcw },
}

function Transactions() {
  const { 
    loading, filteredTransactions, filter, setFilter, setPage, searchQuery, setSearchQuery,
    createModalOpen, setCreateModalOpen, creating, form, setForm, handleCreateTransaction,
    stats, selected, setSelected, refunding, confirmRefundOpen, setConfirmRefundOpen, handleRefund
  } = useTransactions()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center gap-3'>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#101010] border border-[#222222] text-xs font-['JetBrains_Mono']">
            <span className="size-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#A9A9A9]">All Rails Operational</span>
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="bg-[#000000] text-[#FFFFFF]">
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight font-["Satoshi"] text-[#FFFFFF]'>Transactions</h1>
            <p className='text-xs sm:text-sm text-[#A9A9A9] mt-1'>Real-time ledger monitor across all vaulted payment switches.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreateModalOpen(true)} className="rounded-full px-5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs transition-all active:scale-[0.97]">
                <ArrowUpRight className="mr-1.5 size-3.5" /> Initialize Payment
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-[#101010] border-[#222222] shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-[#A9A9A9]">Total Volume (30d)</CardTitle>
                    <Banknote className="size-4 text-[#FFFFFF]" />
                </CardHeader>
                <CardContent>
                    <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#FFFFFF]">
                        {stats ? formatCurrency(stats.total_volume["NGN"] || 0, "NGN") : <Skeleton className="h-8 w-24" />}
                    </div>
                    <p className="text-[11px] text-[#A9A9A9] mt-1">Unified multi-currency settlement</p>
                </CardContent>
            </Card>
            <Card className="bg-[#101010] border-[#222222] shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-[#A9A9A9]">Success Rate</CardTitle>
                    <CheckCircle2 className="size-4 text-[#22C55E]" />
                </CardHeader>
                <CardContent>
                    <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#FFFFFF]">
                        {stats ? `${stats.failure_rate ? (100 - stats.failure_rate).toFixed(1) : "100"}%` : <Skeleton className="h-8 w-20" />}
                    </div>
                    <p className="text-[11px] text-[#A9A9A9] mt-1">Autonomous multi-rail failover active</p>
                </CardContent>
            </Card>
            <Card className="bg-[#101010] border-[#222222] shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-[#A9A9A9]">Captured Charges</CardTitle>
                    <ArrowUpRight className="size-4 text-[#FFFFFF]" />
                </CardHeader>
                <CardContent>
                    <div className="font-['JetBrains_Mono'] text-2xl font-bold text-[#FFFFFF]">
                         {stats ? stats.total_count : <Skeleton className="h-8 w-16" />}
                    </div>
                    <p className="text-[11px] text-[#A9A9A9] mt-1">Confirmed transactions</p>
                </CardContent>
            </Card>
            <Card className="bg-[#101010] border-[#222222] shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-[#A9A9A9]">Pending Clearing</CardTitle>
                    <Clock className="size-4 text-amber-400" />
                </CardHeader>
                <CardContent>
                    <div className="font-['JetBrains_Mono'] text-2xl font-bold text-amber-400">
                        {stats ? (stats as any).pending_count || 0 : <Skeleton className="h-8 w-16" />}
                    </div>
                    <p className="text-[11px] text-[#A9A9A9] mt-1">Awaiting bank verification</p>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-[#101010] border-[#222222] shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-[#222222] bg-[#141414] pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-[#222222] w-fit">
                    {transactionStatusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => { setFilter(tab.value); setPage(1); }}
                            className={cn(
                                "px-3.5 py-1.5 transition-all rounded-lg text-xs font-medium whitespace-nowrap",
                                filter === tab.value 
                                    ? "bg-[#1C1C1C] text-[#FFFFFF] font-semibold" 
                                    : "text-[#A9A9A9] hover:text-[#FFFFFF]"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#A9A9A9]" />
                    <Input 
                        placeholder="Search by reference or customer email..." 
                        className="pl-9 rounded-full bg-[#0A0A0A] border-[#222222] text-xs text-[#FFFFFF] placeholder:text-[#A9A9A9]/60 focus:border-[#444444]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             {/* Desktop Table View */}
             <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs font-['Inter']">
                    <thead>
                        <tr className="border-b border-[#222222] bg-[#121212] text-[#A9A9A9] font-['JetBrains_Mono']">
                            <th className="h-9 px-4 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Reference</th>
                            <th className="h-9 px-4 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Customer</th>
                            <th className="h-9 px-4 text-right align-middle font-medium uppercase text-[10px] tracking-wider">Amount</th>
                            <th className="h-9 px-4 text-center align-middle font-medium uppercase text-[10px] tracking-wider">Status</th>
                            <th className="h-9 px-4 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Gateway</th>
                            <th className="h-9 px-4 text-left align-middle font-medium uppercase text-[10px] tracking-wider">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222222]">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <tr key={i} className="group">
                                    <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                    <td className="p-4 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                                    <td className="p-4 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                </tr>
                            ))
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Filter className="size-8 text-[#A9A9A9]/40" />
                                        <p className="text-[#FFFFFF] font-medium text-sm">No transactions found</p>
                                        <p className="text-xs text-[#A9A9A9] text-center max-w-[240px]">
                                            Adjust your filters or query to inspect matching ledger entries.
                                        </p>
                                        {filter !== 'all' || searchQuery !== '' ? (
                                            <Button variant="link" size="sm" onClick={() => {setFilter('all'); setSearchQuery('')}} className="text-[#FFFFFF] mt-2 text-xs">
                                                Clear all filters
                                            </Button>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map(tx => {
                                const style = statusStyles[tx.status as TransactionStatus] || { bg: 'bg-[#161616] border border-[#222222]', text: 'text-[#A9A9A9]', icon: Clock }
                                const StatusIcon = style.icon
                                return (
                                    <tr 
                                        key={tx.id} 
                                        className="group cursor-pointer transition-colors hover:bg-[#161616]/50"
                                        onClick={() => setSelected(tx)}
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <span className="font-['JetBrains_Mono'] text-[11px] font-medium text-[#FFFFFF]">
                                                    {tx.reference.slice(0, 12)}...
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(tx.reference, "Reference") }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#222222] rounded transition-opacity"
                                                    title="Copy reference"
                                                >
                                                    <Copy className="size-3 text-[#A9A9A9]" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-[#FFFFFF] font-medium">{tx.email}</td>
                                        <td className="p-4 align-middle text-right font-['JetBrains_Mono'] font-bold text-[#FFFFFF] tabular-nums">
                                            {formatCurrency(tx.amount, tx.currency)}
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-['JetBrains_Mono']",
                                                style.bg, style.text
                                            )}>
                                                <StatusIcon className="size-2.5" />
                                                {tx.status}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="size-3 text-[#A9A9A9]" />
                                                <span className="capitalize text-[#A9A9A9]">{tx.provider}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-[#A9A9A9] text-xs font-['JetBrains_Mono']">{formatDate(tx.created_at)}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
             </div>

             {/* Mobile Card Stream (Optimized for one-thumb lookup) */}
             <div className="md:hidden divide-y divide-[#222222]">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 space-y-2.5">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-44" />
                            <div className="flex justify-between items-center pt-1">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <Filter className="size-8 text-[#A9A9A9]/40 mx-auto mb-2" />
                        <p className="text-[#FFFFFF] font-medium text-sm">No transactions found</p>
                        <p className="text-xs text-[#A9A9A9] mt-1">Adjust search or filter parameters.</p>
                    </div>
                ) : (
                    filteredTransactions.map(tx => {
                        const style = statusStyles[tx.status as TransactionStatus] || { bg: 'bg-[#161616] border border-[#222222]', text: 'text-[#A9A9A9]', icon: Clock }
                        const StatusIcon = style.icon
                        return (
                            <div
                                key={tx.id}
                                onClick={() => setSelected(tx)}
                                className="p-4 active:bg-[#181818] transition-colors cursor-pointer space-y-2.5"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#FFFFFF] truncate">
                                            {tx.reference.slice(0, 14)}...
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(tx.reference, "Reference") }}
                                            className="p-1 hover:bg-[#222222] rounded shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                            title="Copy reference"
                                        >
                                            <Copy className="size-3 text-[#A9A9A9]" />
                                        </button>
                                    </div>
                                    <div className={cn(
                                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-['JetBrains_Mono'] shrink-0",
                                        style.bg, style.text
                                    )}>
                                        <StatusIcon className="size-2.5" />
                                        {tx.status}
                                    </div>
                                </div>

                                <div className="text-xs text-[#A9A9A9] flex items-center justify-between">
                                    <span className="truncate max-w-[200px]">{tx.email}</span>
                                    <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#181818] border border-[#262626] text-[#CCCCCC] capitalize">
                                        {tx.provider}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-[#1C1C1C]">
                                    <div className="font-['JetBrains_Mono'] font-bold text-sm text-[#FFFFFF] tabular-nums">
                                        {formatCurrency(tx.amount, tx.currency)}
                                    </div>
                                    <div className="text-[10px] text-[#777777] font-['JetBrains_Mono']">
                                        {formatDate(tx.created_at)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
             </div>
          </CardContent>
        </Card>
      </Main>

      {/* Transaction Details Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="sm:max-w-md bg-[#101010] border-[#222222] text-[#FFFFFF]">
            <SheetHeader className="mb-6 border-b border-[#222222] pb-4">
                <SheetTitle className="text-lg font-['Satoshi'] text-[#FFFFFF]">Transaction Details</SheetTitle>
                <SheetDescription className="text-xs text-[#A9A9A9]">Full ledger breakdown of #{selected?.reference.slice(0, 10)}</SheetDescription>
            </SheetHeader>
            {selected && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#141414] border border-[#222222]">
                        <div className="space-y-1">
                            <p className="text-[10px] text-[#A9A9A9] uppercase tracking-widest font-['JetBrains_Mono']">Settled Amount</p>
                            <p className="text-2xl font-bold font-['JetBrains_Mono'] text-[#FFFFFF]">{formatCurrency(selected.amount, selected.currency)}</p>
                        </div>
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-['JetBrains_Mono']",
                            statusStyles[selected.status as TransactionStatus]?.bg,
                            statusStyles[selected.status as TransactionStatus]?.text
                        )}>
                            {selected.status}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <section>
                            <h4 className="text-[10px] font-semibold text-[#A9A9A9] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">Basic Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] text-[#A9A9A9]">Reference</p>
                                    <div className="flex items-center gap-1 text-xs font-['JetBrains_Mono'] font-medium text-[#FFFFFF]">
                                        {selected.reference.slice(0, 16)}...
                                        <Copy className="size-3 cursor-pointer text-[#A9A9A9] hover:text-[#FFFFFF]" onClick={() => copyToClipboard(selected.reference, "Reference")} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-[#A9A9A9]">Date</p>
                                    <p className="text-xs font-['JetBrains_Mono'] text-[#FFFFFF]">{formatDate(selected.created_at)}</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-semibold text-[#A9A9A9] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">Customer Details</h4>
                            <div className="p-3 border border-[#222222] rounded-xl bg-[#141414] flex flex-col gap-1">
                                <p className="text-[11px] text-[#A9A9A9]">Email Address</p>
                                <p className="text-xs font-medium text-[#FFFFFF]">{selected.email}</p>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-semibold text-[#A9A9A9] uppercase tracking-widest font-['JetBrains_Mono'] mb-2">Payment Rail</h4>
                            <div className="grid grid-cols-2 gap-4 border border-[#222222] rounded-xl p-3 bg-[#141414]">
                                <div className="space-y-1">
                                    <p className="text-[11px] text-[#A9A9A9]">Provider</p>
                                    <p className="text-xs font-medium text-[#FFFFFF] capitalize">{selected.provider}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-[#A9A9A9]">Channel</p>
                                    <p className="text-xs font-medium text-[#FFFFFF] capitalize">{selected.channel || "Auto Route"}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="pt-6 space-y-3">
                        {selected.status === 'success' && (
                            <Button 
                                variant="outline" 
                                className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border-rose-900/30 text-xs"
                                onClick={() => setConfirmRefundOpen(true)}
                            >
                                <RefreshCcw className="mr-2 size-3.5" /> Refund Transaction
                            </Button>
                        )}
                        <Button variant="secondary" className="w-full bg-[#161616] hover:bg-[#202020] border border-[#222222] text-[#FFFFFF] text-xs" onClick={() => setSelected(null)}>
                            Close Details
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>

      {/* Manual Charge Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-[#101010] border-[#222222] text-[#FFFFFF]">
              <DialogHeader>
                  <DialogTitle className="font-['Satoshi'] text-lg text-[#FFFFFF]">Initialize Payment</DialogTitle>
                  <DialogDescription className="text-xs text-[#A9A9A9]">Execute a normalized charge request via the internal routing worker.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                      <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A9A9] font-['JetBrains_Mono']">Customer Email</label>
                      <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="customer@example.com"
                          className="rounded-xl bg-[#0A0A0A] border-[#222222] text-xs text-[#FFFFFF]"
                      />
                  </div>
                  <div className="grid gap-2">
                      <label htmlFor="amount" className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A9A9] font-['JetBrains_Mono']">Amount (NGN)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A9A9A9] text-xs font-bold font-['JetBrains_Mono']">₦</span>
                        <Input
                            id="amount"
                            type="number"
                            value={form.amount || ''}
                            onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            placeholder="0.00"
                            className="pl-8 rounded-xl bg-[#0A0A0A] border-[#222222] text-xs font-['JetBrains_Mono'] font-bold text-[#FFFFFF]"
                        />
                      </div>
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setCreateModalOpen(false)} className="text-xs text-[#A9A9A9] hover:text-[#FFFFFF]">Cancel</Button>
                  <Button onClick={handleCreateTransaction} disabled={creating} className="rounded-full px-6 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs">
                      {creating ? <><Loader2 className="size-3.5 mr-2 animate-spin" /> Processing...</> : 'Execute Charge'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <Dialog open={confirmRefundOpen} onOpenChange={setConfirmRefundOpen}>
          <DialogContent className="bg-[#101010] border-[#222222] text-[#FFFFFF]">
              <DialogHeader>
                  <DialogTitle className="font-['Satoshi'] text-lg text-[#FFFFFF]">Confirm Refund</DialogTitle>
                  <DialogDescription className="text-xs text-[#A9A9A9]">
                      Are you sure you want to refund this transaction? This action will reverse the ledger entry across the payment rail.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setConfirmRefundOpen(false)} className="text-xs text-[#A9A9A9] hover:text-[#FFFFFF]">Cancel</Button>
                  <Button variant="destructive" onClick={handleRefund} disabled={refunding} className="text-xs">
                      {refunding ? <Loader2 className="size-3.5 animate-spin mr-2" /> : null}
                      Confirm Refund
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  )
}
