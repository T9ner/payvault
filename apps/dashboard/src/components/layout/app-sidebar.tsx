import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useAuthStore } from '@/stores/auth-store'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { auth } = useAuthStore()
  const user = auth.user

  const userData = {
    name: user?.business_name || 'Quirk Merchant',
    email: user?.email || 'merchant@quirk.dev',
    avatar: '',
  }

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className='bg-[#FFFFFF] border-r border-[#E5E5E5] text-[#080808]'
    >
      <SidebarHeader className='p-3 border-b border-[#E5E5E5] bg-[#FFFFFF]'>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent className='p-2 space-y-1 bg-[#FFFFFF]'>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter className='p-3 border-t border-[#E5E5E5] bg-[#FAFAFA]'>
        <NavUser user={userData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
