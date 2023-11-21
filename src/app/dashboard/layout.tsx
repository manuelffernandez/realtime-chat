import { Logo } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ReactNode } from 'react'
import Navbar from './_components/Navbar'
import { getFriends } from '@/services/upstash'

interface Props {
  children: ReactNode
}

const DashboardLayout = async (props: Props) => {
  const { children } = props
  const session = await getServerSession(nextAuthOptions)
  if (!session) notFound()

  const friends = await getFriends(session.user.id)

  return (
    <div className='flex h-screen w-full'>
      <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href={routes.pages.dashboard} className='flex h-16 shrink-0 items-center'>
          <Logo className='h-8 w-auto text-indigo-600' />
        </Link>
        {friends.length > 0 ? <div className='text-xs font-semibold leading-6 text-gray-400'>Your chats</div> : null}
        <Navbar session={session} />
      </div>
      <aside className='nax-h-screen container w-full py-16 md:py-12'>{children}</aside>
    </div>
  )
}

export default DashboardLayout
