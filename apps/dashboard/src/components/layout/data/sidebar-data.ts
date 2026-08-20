import {
  Activity,
  ArrowRightLeft,
  Link2,
  ShieldAlert,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Quirk Merchant',
    email: 'merchant@quirk.dev',
    avatar: '',
  },
  teams: [
    {
      name: 'Quirk Control Plane',
      plan: 'Live Multi-Rail',
    },
  ],
  navGroups: [
    {
      title: 'Control Plane',
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
          icon: Activity,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: ArrowRightLeft,
        },
        {
          title: 'Payment Links',
          url: '/payment-links',
          icon: Link2,
        },
        {
          title: 'Fraud Matrix',
          url: '/fraud',
          icon: ShieldAlert,
        },
      ],
    },
    {
      title: 'Platform',
      items: [
        {
          title: 'Settings & Keys',
          url: '/settings',
          icon: SlidersHorizontal,
        },
        {
          title: 'SDK Reference',
          url: '/insights',
          icon: Terminal,
        },
      ],
    },
  ],
}
