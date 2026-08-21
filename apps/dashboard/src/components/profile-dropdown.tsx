import { Link } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { SlidersHorizontal, KeyRound, LogOut } from 'lucide-react'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()
  const user = auth.user

  const displayName = user?.business_name || user?.email?.split('@')[0] || 'Quirk Merchant'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'QM'

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative size-8 rounded-lg p-0 border border-[#E5E5E5] bg-[#F7F7F5] hover:bg-[#EBEBEA] transition-colors duration-150 active:scale-[0.98]'
            aria-label='User account menu'
          >
            <Avatar className='size-8 rounded-lg'>
              <AvatarFallback className='rounded-lg bg-[#F7F7F5] text-[#080808] font-mono font-bold text-xs'>
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-lg text-[#080808] p-1.5'
          align='end'
          sideOffset={8}
        >
          <DropdownMenuLabel className='p-2 font-normal border-b border-[#E5E5E5] mb-1'>
            <div className='flex flex-col gap-0.5'>
              <p className='text-xs font-["Satoshi"] font-bold text-[#080808] leading-none'>{displayName}</p>
              <p className='text-[10px] font-mono text-[#666666] leading-none mt-1 truncate'>
                {user?.email || 'merchant@quirk.dev'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className='rounded-lg text-xs font-medium hover:bg-[#F7F7F5] cursor-pointer'>
            <Link to='/settings'>
              <SlidersHorizontal className='size-3.5 mr-2 text-[#666666]' />
              <span>Platform Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className='rounded-lg text-xs font-medium hover:bg-[#F7F7F5] cursor-pointer'>
            <Link to='/settings'>
              <KeyRound className='size-3.5 mr-2 text-[#666666]' />
              <span>API & Webhook Keys</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='bg-[#E5E5E5] my-1' />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer'
          >
            <LogOut className='size-3.5 mr-2' />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
