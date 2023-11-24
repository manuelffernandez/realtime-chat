import { Logo, MobileChatLayout } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getChats, getFriends, getUser } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ReactNode } from 'react'
import Navbar from './_components/Navbar'

interface Props {
  children: ReactNode
}

const DashboardLayout = async (props: Props) => {
  const { children } = props
  const session = await getServerSession(nextAuthOptions)
  if (!session) notFound()

  const chats = await getChats(session.user.id)
  const chatFriends = (
    await Promise.all(
      chats.map(async (chat) => {
        try {
          const user = await getUser(chat.partnerId)
          return user
        } catch (error) {
          console.log('getUser on DashboardLayout for chatFriends error', error)
          return null
        }
      })
    )
  ).filter((user) => user !== null) as User[]

  const friends = await getFriends(session.user.id)

  return (
    <div className='flex h-screen w-full'>
      <div className='md:hidden'>
        <MobileChatLayout chatFriends={chatFriends} friends={friends} session={session} />
      </div>
      <div className='hidden h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 md:flex'>
        <Link href={routes.pages.dashboard} className='flex h-16 shrink-0 items-center'>
          <Logo className='h-8 w-auto text-indigo-600' />
        </Link>
        <div className='text-xs font-semibold leading-6 text-gray-400'>Your chats</div>
        <Navbar session={session} />
      </div>
      <aside className='nax-h-screen container w-full py-16 md:py-12'>{children}</aside>
    </div>
  )
}

export default DashboardLayout
