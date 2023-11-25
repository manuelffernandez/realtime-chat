'use client'

import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { pusher } from '@/lib/constants/pusher.const'
import { routes } from '@/lib/constants/routes.const'
import { pusherClient } from '@/lib/pusher'
import { getUserAPI } from '@/services/api/get-user-api'
import { MessageSquarePlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'
import { type Message } from '@/lib/validations/message'

interface Props {
  sessionId: string
  initialChatFriends: User[]
}

const SidebarChatList = (props: Props) => {
  const { sessionId, initialChatFriends } = props
  const {
    channels: { userChats, userFriends },
    events: { newMessage, newFriend, newActiveChat }
  } = pusher

  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [chatFriends, setChatFriends] = useState(initialChatFriends)

  useEffect(() => {
    const newFriendHandler = (newFriend: User) => {
      console.log('new friend handler newFriend bind', newFriend)
      setChatFriends((prev) => [...prev, newFriend])
      router.refresh()
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
      console.log('chat handler newMessage bind', extendedMessage)
      setUnseenMessages((prev) => [...prev, message])
    }
    const newActiveChatHandler = async (newChat: CustomChat) => {
      try {
        const { data: newPartner } = await getUserAPI(newChat.partnerId)
        console.log('active chat handler newActiveChat bind', newChat)
        setChatFriends((prev) => [...prev, newPartner])
      } catch (error) {
        toast.error('An error ocurred while creating new chat')
        console.log('new active chat handler error', error)
      }
    }

    pusherClient.subscribe(userChats(sessionId))
    pusherClient.subscribe(userFriends(sessionId))
    pusherClient.bind(newMessage, chatHandler)
    pusherClient.bind(newFriend, newFriendHandler)
    pusherClient.bind(newActiveChat, newActiveChatHandler)

    return () => {
      pusherClient.unsubscribe(userChats(sessionId))
      pusherClient.unsubscribe(userFriends(sessionId))
      pusherClient.unbind(newMessage, chatHandler)
      pusherClient.unbind(newFriend, newFriendHandler)
      pusherClient.unbind(newActiveChat, newActiveChatHandler)
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
      {chatFriends.map((friend) => {
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
      <li>
        <Link
          href={routes.pages.friends}
          className='group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
        >
          <span className='-h-6 flex w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
            <MessageSquarePlus className='h-4 w-4' />
          </span>
          <span className='truncate'>New chat</span>
        </Link>
      </li>
    </ul>
  )
}

export default SidebarChatList
