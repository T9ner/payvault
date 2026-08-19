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
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { usePaymentLinks } from '@/hooks/usePaymentLinks'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Link2, ExternalLink, Copy, Check, Loader2, Trash2, AlertTriangle, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/payment-links')({
  component: PaymentLinks,
})

function PaymentLinks() {
  const { 
    links, loading, showCreate, setShowCreate, creating, copied,
    form, setForm, handleCreate, getCheckoutUrl, handleCopyLink, handleOpenLink,
    linkToDelete, setLinkToDelete, deleting, handleDelete
  } = usePaymentLinks()

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
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold tracking-tight font-["Satoshi"] text-[#FFFFFF]'>Payment Links</h1>
            <p className='text-xs sm:text-sm text-[#A9A9A9] mt-1'>Generate shareable checkout endpoints with automatic multi-rail fallback.</p>
          </div>
          <div>
            <Button onClick={() => setShowCreate(true)} className="rounded-full px-5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs transition-all active:scale-[0.97]">
              <Plus className="mr-1.5 size-3.5" /> Create Link
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-[#101010] border-[#222222] rounded-2xl">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60 mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-6 border-b border-[#222222] pb-4">
                    <div>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {links.length === 0 ? (
                <div className="col-span-full border border-dashed border-[#222222] bg-[#101010] rounded-2xl p-12 text-center text-[#A9A9A9]">
                    <Link2 className="mx-auto size-8 mb-4 opacity-40 text-[#FFFFFF]" />
                    <p className="text-sm font-medium text-[#FFFFFF]">No payment links created yet.</p>
                    <p className="text-xs text-[#A9A9A9] mt-1">Generate a shareable checkout URL to collect payments without code.</p>
                </div>
            ) : (
                links.map(link => (
                    <Card key={link.id} className="relative overflow-hidden bg-[#101010] border-[#222222] rounded-2xl shadow-sm hover:border-[#333333] transition-all">
                        <CardHeader className="pb-3 border-b border-[#222222] bg-[#141414]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="font-['Satoshi'] text-base text-[#FFFFFF] font-bold">{link.name}</CardTitle>
                                    {link.description && <CardDescription className="line-clamp-2 mt-1 text-xs text-[#A9A9A9]">{link.description}</CardDescription>}
                                </div>
                                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-['JetBrains_Mono'] ${link.is_active ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-[#161616] border border-[#222222] text-[#A9A9A9]'}`}>
                                    {link.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="flex justify-between items-center mb-6 border-b border-[#222222] pb-4">
                                <div>
                                    <p className="text-[10px] text-[#A9A9A9] uppercase tracking-widest font-semibold font-['JetBrains_Mono']">Amount</p>
                                    <p className="text-xl font-bold font-['JetBrains_Mono'] text-[#FFFFFF] mt-0.5">{link.amount > 0 ? formatCurrency(link.amount, link.currency) : "Flexible Amount"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-[#A9A9A9] uppercase tracking-widest font-semibold font-['JetBrains_Mono']">Created</p>
                                    <p className="text-xs font-medium text-[#A9A9A9] font-['JetBrains_Mono'] mt-0.5">{formatDate(link.created_at).split(' ')[0]}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="secondary" className="flex-1 justify-start overflow-hidden text-xs bg-[#161616] hover:bg-[#202020] border border-[#222222] text-[#A9A9A9] font-['JetBrains_Mono'] rounded-xl">
                                   <Link2 className="size-3.5 mr-2 text-[#FFFFFF]" />
                                   <span className="truncate">{getCheckoutUrl(link)}</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCopyLink(link)}
                                  title="Copy link"
                                  className="bg-[#101010] border-[#222222] hover:bg-[#161616] rounded-xl text-[#FFFFFF]"
                                >
                                    {copied === link.id ? <Check className="size-3.5 text-[#22C55E]" /> : <Copy className="size-3.5" />}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleOpenLink(link)}
                                  title="Open in new tab"
                                  className="bg-[#101010] border-[#222222] hover:bg-[#161616] rounded-xl text-[#FFFFFF]"
                                >
                                    <ExternalLink className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[#A9A9A9] hover:text-rose-400 hover:bg-rose-950/20 rounded-xl"
                                  onClick={() => setLinkToDelete(link.id)}
                                  title="Delete link"
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
          </div>
        )}
      </Main>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-[#101010] border-[#222222] text-[#FFFFFF]">
              <DialogHeader>
                  <DialogTitle className="font-['Satoshi'] text-lg text-[#FFFFFF]">Create Payment Link</DialogTitle>
                  <DialogDescription className="text-xs text-[#A9A9A9]">Generate a shareable checkout URL for your customers.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                      <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A9A9] font-['JetBrains_Mono']">Link Title</label>
                      <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Enterprise Platform License"
                          className="rounded-xl bg-[#0A0A0A] border-[#222222] text-xs text-[#FFFFFF]"
                      />
                  </div>
                  <div className="grid gap-2">
                      <label htmlFor="description" className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A9A9] font-['JetBrains_Mono']">Description</label>
                      <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Customer facing details..."
                          className="rounded-xl bg-[#0A0A0A] border-[#222222] text-xs text-[#FFFFFF]"
                      />
                  </div>
                  <div className="grid gap-2">
                      <label htmlFor="amount" className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A9A9] font-['JetBrains_Mono']">Fixed Amount (Optional - NGN)</label>
                      <Input
                          id="amount"
                          type="number"
                          value={form.amount || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                          placeholder="0 for custom customer amount"
                          className="rounded-xl bg-[#0A0A0A] border-[#222222] text-xs text-[#FFFFFF] font-['JetBrains_Mono'] font-bold"
                      />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-xs text-[#A9A9A9] hover:text-[#FFFFFF]">Cancel</Button>
                  <Button onClick={handleCreate} disabled={creating} className="rounded-full px-6 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] font-semibold text-xs">
                      {creating ? <><Loader2 className="size-3.5 mr-2 animate-spin" /> Creating...</> : 'Publish Link'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <Dialog open={!!linkToDelete} onOpenChange={(open) => !open && setLinkToDelete(null)}>
          <DialogContent className="max-w-md bg-[#101010] border-[#222222] text-[#FFFFFF]">
              <DialogHeader>
                  <div className="mx-auto size-12 rounded-full bg-rose-950/30 border border-rose-900/30 flex items-center justify-center mb-4">
                    <AlertTriangle className="size-5 text-rose-400" />
                  </div>
                  <DialogTitle className="text-center font-['Satoshi'] text-lg text-[#FFFFFF]">Delete Payment Link?</DialogTitle>
                  <DialogDescription className="text-center text-xs text-[#A9A9A9]">
                      This action is permanent. Customers navigating to this checkout URL will no longer be able to complete charges.
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setLinkToDelete(null)} className="flex-1 text-xs text-[#A9A9A9] hover:text-[#FFFFFF]">Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="flex-1 text-xs">
                      {deleting ? <><Loader2 className="size-3.5 mr-2 animate-spin" /> Deleting...</> : 'Delete Link'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  )
}
