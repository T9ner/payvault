import {
  LayoutDashboard,
  CreditCard,
  Link as LinkIcon,
  ShieldAlert,
  Settings,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'dbosshonour@gmail.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Quirk',
      logo: Command,
      plan: 'Live Platform',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: CreditCard,
        },
        {
          title: 'Payment Links',
          url: '/payment-links',
          icon: LinkIcon,
        },
        {
          title: 'Fraud Matrix',
          url: '/fraud',
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
