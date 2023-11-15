'use client'

import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { pusher } from '@/lib/constants/pusher.const'
import { routes } from '@/lib/constants/routes.const'
import { pusherClient } from '@/lib/pusher'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'

interface Props {
  friends: User[]
  sessionId: string
}

const SidebarChatList = (props: Props) => {
  const { friends, sessionId } = props
  const {
    channels: { userChats, userFriends },
    events: { newMessage, newFriend }
  } = pusher

  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    const newFriendHandler = (newFriend: User) => {
      router.refresh()
      console.log('received new user', newFriend)
      setActiveChats((prev) => [...prev, newFriend])
    }
    const chatHandler = (extendedMessage: ExtendedMessage) => {
      const { senderImg, senderName, ...message } = extendedMessage
      const shouldNotify = pathname !== `${routes.pages.chat}/${chatIdConstructor(sessionId, extendedMessage.senderId)}`

      if (!shouldNotify) return

      // should be notified
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={extendedMessage.senderId}
          senderImg={extendedMessage.senderImg}
          senderMessage={extendedMessage.text}
          senderName={extendedMessage.senderName}
        />
      ))
      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.subscribe(userChats(sessionId))
    pusherClient.subscribe(userFriends(sessionId))
    pusherClient.bind(newMessage, chatHandler)
    pusherClient.bind(newFriend, newFriendHandler)

    return () => {
      pusherClient.unsubscribe(userChats(sessionId))
      pusherClient.unsubscribe(userFriends(sessionId))
      pusherClient.unbind(newMessage, chatHandler)
      pusherClient.unbind(newFriend, newFriendHandler)
    }
  }, [pathname, sessionId])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return (
    <ul role='list' className='-mx-2 max-h-[25rem] space-y-1 overflow-y-auto'>
      {activeChats.map((friend) => {
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
