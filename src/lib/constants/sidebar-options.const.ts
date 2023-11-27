import { routes } from '@/lib/constants/routes.const'
import { UserPlus, Users, type LucideIcon } from 'lucide-react'
import { type ElementType } from 'react'

interface SidebarOption {
  id: number
  name: string
  href: string
  Icon: LucideIcon | ElementType
}

export const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: routes.pages.addFriend,
    Icon: UserPlus
  },
  {
    id: 2,
    name: 'Your friends',
    href: routes.pages.friends,
    Icon: Users
  }
]
