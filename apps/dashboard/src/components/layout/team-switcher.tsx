import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { QuirkLogo } from '@/components/quirk-logo'
import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          to='/dashboard'
          className='flex w-full items-center justify-between p-2 rounded-xl hover:bg-[#F7F7F5] transition-colors duration-150 group'
        >
          <div className='flex items-center gap-2.5'>
            <QuirkLogo size={22} lightMode={true} />
            <div className='flex flex-col text-start leading-tight'>
              <span className='font-["Satoshi"] font-bold text-sm text-[#080808] tracking-tight'>
                Quirk
              </span>
              <span className='text-[10px] font-mono text-[#666666]'>
                Control Plane
              </span>
            </div>
          </div>

          <div className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] text-[10px] font-mono text-[#080808]'>
            <span className='size-1.5 rounded-full bg-[#22C55E] animate-pulse' />
            <span>Live</span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
