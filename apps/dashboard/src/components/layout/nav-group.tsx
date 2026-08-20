import { type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup className='py-1.5'>
      <SidebarGroupLabel className='text-[10px] font-mono font-semibold uppercase tracking-wider text-[#999999] px-2.5 mb-1'>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className='space-y-1'>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1.5 py-0 text-[10px] font-mono'>{children}</Badge>
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar()
  const active = checkIsActive(href, item)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.title}
        className={`h-9 rounded-xl px-2.5 text-xs font-medium transition-colors duration-150 active:scale-[0.98] ${
          active
            ? 'bg-[#F7F7F5] text-[#080808] font-semibold border border-[#E5E5E5] shadow-2xs'
            : 'text-[#666666] hover:text-[#080808] hover:bg-[#FAFAFA]'
        }`}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon className='size-4 text-[#080808]' />}
          <span className='font-["Satoshi"]'>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className='h-9 rounded-xl px-2.5 text-xs font-medium text-[#666666] hover:text-[#080808] hover:bg-[#FAFAFA] transition-colors duration-150 active:scale-[0.98]'
          >
            {item.icon && <item.icon className='size-4 text-[#080808]' />}
            <span className='font-["Satoshi"]'>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto size-3.5 text-[#999999] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent pl-4 pt-1 space-y-1'>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                  className='h-8 rounded-lg px-2 text-xs text-[#666666] hover:text-[#080808] hover:bg-[#FAFAFA] transition-colors duration-150'
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon className='size-3.5' />}
                    <span className='font-["Satoshi"]'>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
            className='h-9 rounded-xl p-2'
          >
            {item.icon && <item.icon className='size-4' />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4} className='bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl shadow-lg p-1.5'>
          <DropdownMenuLabel className='text-xs font-mono font-semibold text-[#666666] p-2'>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='bg-[#E5E5E5]' />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild className='rounded-lg text-xs font-medium p-2 hover:bg-[#F7F7F5] cursor-pointer'>
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub) ? 'bg-[#F7F7F5] font-semibold text-[#080808]' : 'text-[#666666]'}`}
              >
                {sub.icon && <sub.icon className='size-3.5 mr-2' />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && <span className='ms-auto text-[10px]'>{sub.badge}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // Exact match
    href.split('?')[0] === item.url || // Match without query parameters
    !!item?.items?.some((match) => match.url === href) || // Child match
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
