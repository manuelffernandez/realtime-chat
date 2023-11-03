'use client'

import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { routes } from '@/lib/constants/routes.const'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  friends: User[]
  sessionId: string
}

const SidebarChatList = (props: Props) => {
  const { friends, sessionId } = props
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list' className='-mx-2 max-h-[25rem] space-y-1 overflow-y-auto'>
      {friends.map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        return (
          <li key={friend.id}>
            <a
              href={`${routes.pages.chat}/${chatIdConstructor(sessionId, friend.id)}`}
              className='group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className='flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white'>
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList
