import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { pusher } from '@/lib/constants/pusher.const'
import { routes } from '@/lib/constants/routes.const'
import { pusherClient } from '@/lib/pusher'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import UnseenChatToast from '../components/UnseenChatToast'

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const useNewMsgToast = () => {
  const {
    channels: { userChats, userFriends },
    events: { newMessage, newFriend }
  } = pusher
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      const newMessageHandler = (message: ExtendedMessage) => {
        const shouldNotify = pathname !== `${routes.pages.chat}/${chatIdConstructor(session.user.id, message.senderId)}`
        if (!shouldNotify) return

        toast.custom((t) => (
          <UnseenChatToast
            senderId={message.senderId}
            senderImg={message.senderImg}
            senderMessage={message.text}
            senderName={message.senderName}
            sessionId={session.user.id}
            t={t}
          />
        ))
      }

      const newFriendHandler = () => {
        router.refresh()
      }

      pusherClient.subscribe(userChats(session.user.id))
      pusherClient.subscribe(userFriends(session.user.id))
      pusherClient.bind(newMessage, newMessageHandler)
      pusherClient.bind(newFriend, newFriendHandler)

      return () => {
        pusherClient.unsubscribe(userChats(session.user.id))
        pusherClient.unsubscribe(userFriends(session.user.id))
        pusherClient.unbind(newMessage, newMessageHandler)
        pusherClient.unbind(newFriend, newFriendHandler)
      }
    }
  }, [status, pathname])
}

export default useNewMsgToast
