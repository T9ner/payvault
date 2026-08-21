import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
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
    <div className='min-h-screen bg-[#F7F7F5] text-[#080808]'>
      <Header className='bg-[#FFFFFF]/95 border-b border-[#E5E5E5]'>
        <div className='flex items-center gap-3 font-["Satoshi"] font-semibold text-sm text-[#080808]'>
          <span>Payment links</span>
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
            onClick={() => setShowCreate(true)}
            className='inline-flex items-center justify-center gap-1.5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-medium text-xs px-3.5 py-1.5 rounded-lg active:scale-[0.98] transition-transform duration-150 ease-out shadow-xs'
          >
            <Plus className='size-3.5' />
            <span>Create link</span>
          </Button>

          <ProfileDropdown />
        </div>
      </Header>

      <Main className='px-4 sm:px-8 py-8 max-w-7xl mx-auto space-y-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]'>
          <div className='space-y-1'>
            <h1 className='font-["Satoshi"] text-2xl sm:text-3xl font-bold tracking-tight text-[#080808] [text-wrap:balance]'>
              Payment Links
            </h1>
            <p className='text-xs sm:text-sm text-[#666666] [text-wrap:pretty]'>
              Generate hosted checkout endpoints with automatic multi-rail routing and minor-unit precision.
            </p>
          </div>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className='bg-[#FFFFFF] border-[#E5E5E5] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4'>
                <Skeleton className='h-5 w-40' />
                <Skeleton className='h-4 w-60' />
                <div className='flex justify-between items-center pt-4 border-t border-[#E5E5E5]'>
                  <Skeleton className='h-6 w-28' />
                  <Skeleton className='h-4 w-24' />
                </div>
                <Skeleton className='h-9 w-full rounded-xl' />
              </Card>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {links.length === 0 ? (
              <div className='col-span-full border border-dashed border-[#E5E5E5] bg-[#FFFFFF] rounded-2xl p-12 text-center text-[#666666] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'>
                <Link2 className='mx-auto size-8 mb-4 text-[#080808] opacity-40' />
                <p className='text-sm font-semibold text-[#080808] font-["Satoshi"]'>No payment links created yet</p>
                <p className='text-xs text-[#666666] mt-1'>Generate a shareable checkout URL to collect payments across African rails without code.</p>
                <Button
                  onClick={() => setShowCreate(true)}
                  className='mt-4 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] text-xs font-semibold px-4 py-2 rounded-lg'
                >
                  Create first link
                </Button>
              </div>
            ) : (
              links.map((link) => (
                <Card key={link.id} className='relative overflow-hidden bg-[#FFFFFF] border-[#E5E5E5] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#D0D0D0] transition-colors duration-150'>
                  <CardHeader className='p-5 pb-3 border-b border-[#E5E5E5] bg-[#FAFAFA]'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='font-["Satoshi"] text-base text-[#080808] font-bold'>{link.name}</CardTitle>
                        {link.description && <CardDescription className='line-clamp-2 mt-1 text-xs text-[#666666]'>{link.description}</CardDescription>}
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${link.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#F0F0EE] text-[#666666] border border-[#E5E5E5]'}`}>
                        {link.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='p-5 pt-4'>
                    <div className='flex justify-between items-center mb-5 border-b border-[#E5E5E5] pb-4'>
                      <div>
                        <p className='text-[10px] text-[#666666] uppercase tracking-widest font-semibold font-mono'>Amount</p>
                        <p className='text-xl font-bold font-mono text-[#080808] mt-0.5 tabular-nums'>
                          {link.amount > 0 ? formatCurrency(link.amount, link.currency) : 'Flexible amount'}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-[10px] text-[#666666] uppercase tracking-widest font-semibold font-mono'>Created</p>
                        <p className='text-xs font-medium text-[#666666] font-mono mt-0.5 tabular-nums'>{formatDate(link.created_at).split(' ')[0]}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button variant='secondary' className='flex-1 justify-start overflow-hidden text-xs bg-[#F7F7F5] hover:bg-[#EBEBEA] border border-[#E5E5E5] text-[#080808] font-mono rounded-xl h-10'>
                        <Link2 className='size-3.5 mr-2 text-[#666666]' />
                        <span className='truncate'>{getCheckoutUrl(link)}</span>
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleCopyLink(link)}
                        title='Copy link URL'
                        aria-label={`Copy link ${link.name}`}
                        className='bg-[#FFFFFF] border-[#E5E5E5] hover:bg-[#F7F7F5] rounded-xl text-[#080808] size-10 active:scale-[0.98] transition-transform duration-150'
                      >
                        {copied === link.id ? <Check className='size-3.5 text-[#22C55E]' /> : <Copy className='size-3.5 text-[#666666]' />}
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => handleOpenLink(link)}
                        title='Open checkout in new tab'
                        aria-label={`Open link ${link.name}`}
                        className='bg-[#FFFFFF] border-[#E5E5E5] hover:bg-[#F7F7F5] rounded-xl text-[#080808] size-10 active:scale-[0.98] transition-transform duration-150'
                      >
                        <ExternalLink className='size-3.5 text-[#666666]' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-[#666666] hover:text-rose-600 hover:bg-rose-50 rounded-xl size-10 active:scale-[0.98] transition-colors duration-150'
                        onClick={() => setLinkToDelete(link.id)}
                        title='Delete link'
                        aria-label={`Delete link ${link.name}`}
                      >
                        <Trash2 className='size-3.5' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </Main>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className='bg-[#FFFFFF] border-[#E5E5E5] text-[#080808] rounded-2xl shadow-xl'>
          <DialogHeader>
            <DialogTitle className='font-["Satoshi"] text-lg text-[#080808] font-bold'>Create payment link</DialogTitle>
            <DialogDescription className='text-xs text-[#666666]'>Generate a hosted multi-rail checkout URL for your customers.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='name' className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>Link title</label>
              <Input
                id='name'
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder='e.g. Annual Platform Subscription'
                className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808]'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='description' className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>Description</label>
              <Textarea
                id='description'
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder='Customer-facing checkout notes...'
                className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808]'
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='amount' className='text-[10px] font-semibold uppercase tracking-wider text-[#666666] font-mono'>Fixed amount (NGN)</label>
              <Input
                id='amount'
                type='number'
                value={form.amount || ''}
                onChange={(e) => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder='0 for flexible customer amount'
                className='rounded-xl bg-[#FFFFFF] border-[#E5E5E5] text-xs text-[#080808] font-mono font-bold'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setShowCreate(false)} className='text-xs text-[#666666] hover:text-[#080808] rounded-lg'>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating} className='rounded-lg px-5 bg-[#080808] hover:bg-[#222222] text-[#FFFFFF] font-semibold text-xs'>
              {creating ? <><Loader2 className='size-3.5 mr-2 animate-spin' /> Publishing...</> : 'Publish link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!linkToDelete} onOpenChange={(open) => !open && setLinkToDelete(null)}>
        <DialogContent className='max-w-md bg-[#FFFFFF] border-[#E5E5E5] text-[#080808] rounded-2xl shadow-xl'>
          <DialogHeader>
            <div className='mx-auto size-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-3'>
              <AlertTriangle className='size-5 text-rose-600' />
            </div>
            <DialogTitle className='text-center font-["Satoshi"] text-lg text-[#080808] font-bold'>Delete payment link?</DialogTitle>
            <DialogDescription className='text-center text-xs text-[#666666]'>
              This action is permanent. Customers navigating to this checkout URL will no longer be able to complete charges.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button variant='ghost' onClick={() => setLinkToDelete(null)} className='flex-1 text-xs text-[#666666] hover:text-[#080808] rounded-lg'>Cancel</Button>
            <Button variant='destructive' onClick={handleDelete} disabled={deleting} className='flex-1 text-xs rounded-lg'>
              {deleting ? <><Loader2 className='size-3.5 mr-2 animate-spin' /> Deleting...</> : 'Delete link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
