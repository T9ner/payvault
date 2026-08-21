import { Link } from '@tanstack/react-router'
import {
  ChevronsUpDown,
  LogOut,
  SlidersHorizontal,
  KeyRound,
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'QM'

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='h-12 rounded-xl p-2 hover:bg-[#F0F0EE] transition-colors duration-150 active:scale-[0.98]'
              >
                {/* Clean Monogram Circle Avatar with 1px border */}
                <Avatar className='size-8 rounded-lg border border-[#E5E5E5] bg-[#F7F7F5] shadow-2xs'>
                  <AvatarFallback className='rounded-lg bg-[#F7F7F5] text-[#080808] font-mono font-bold text-xs'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start leading-tight'>
                  <span className='truncate font-["Satoshi"] font-semibold text-xs text-[#080808]'>
                    {user.name}
                  </span>
                  <span className='truncate font-mono text-[10px] text-[#666666]'>
                    {user.email}
                  </span>
                </div>
                <ChevronsUpDown className='ms-auto size-3.5 text-[#666666]' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-lg text-[#080808] p-1.5'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={8}
            >
              <DropdownMenuLabel className='p-2 font-normal border-b border-[#E5E5E5] mb-1'>
                <div className='flex items-center gap-2.5 text-start'>
                  <Avatar className='size-8 rounded-lg border border-[#E5E5E5] bg-[#F7F7F5]'>
                    <AvatarFallback className='rounded-lg font-mono font-bold text-xs text-[#080808]'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start leading-tight'>
                    <span className='truncate font-["Satoshi"] font-semibold text-xs text-[#080808]'>
                      {user.name}
                    </span>
                    <span className='truncate font-mono text-[10px] text-[#666666]'>
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup className='space-y-0.5'>
                <DropdownMenuItem asChild className='rounded-lg text-xs font-medium hover:bg-[#F7F7F5] cursor-pointer'>
                  <Link to='/settings'>
                    <SlidersHorizontal className='size-3.5 mr-2 text-[#666666]' />
                    <span>Control Plane Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='rounded-lg text-xs font-medium hover:bg-[#F7F7F5] cursor-pointer'>
                  <Link to='/settings'>
                    <KeyRound className='size-3.5 mr-2 text-[#666666]' />
                    <span>API & Webhook Keys</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

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
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
