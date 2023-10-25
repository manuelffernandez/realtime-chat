import { Logo, SignOutButton } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ElementType, type ReactNode } from 'react'
import { type LucideIcon, UserPlus } from 'lucide-react'
import Image from 'next/image'

interface Props {
  children: ReactNode
}

interface SidebarOption {
  id: number
  name: string
  href: string
  Icon: LucideIcon | ElementType
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: routes.pages.dashboard,
    Icon: UserPlus
  }
]

const DashboardLayout = async (props: Props) => {
  const { children } = props
  const session = await getServerSession(nextAuthOptions)
  if (!session) notFound()

  return (
    <div className='flex h-screen w-full'>
      <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href={routes.pages.dashboard} className='flex h-16 shrink-0 items-center'>
          <Logo className='h-8 w-auto text-indigo-600' />
        </Link>
        <div className='text-xs font-semibold leading-6 text-gray-400'>Your chats</div>
        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>chats that user has</li>
            <li>
              <div className='text-xs font-semibold leading-6 text-gray-400'>Overview</div>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sidebarOptions.map((option) => {
                  const { Icon } = option
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className='group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                      >
                        <span className='-h-6 flex w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
                          <Icon className='h-4 w-4' />
                        </span>
                        <span className='truncate'>{option.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ''}
                    alt='Your profile picture'
                  />
                </div>
                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs font-normal text-zinc-400' aria-hidden='true' title={session.user.email}>
                    {session.user.email.length > 20 ? `${session.user.email.slice(0, 20)}...` : session.user.email}
                  </span>
                </div>
                <SignOutButton className='aspect-square h-full' />
              </div>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  )
}

export default DashboardLayout
