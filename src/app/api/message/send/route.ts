import { nextAuthOptions } from '@/lib/constants/auth.const'
import { pusher } from '@/lib/constants/pusher.const'
import { pusherServer } from '@/lib/pusher'
import { messageValidator, type Message } from '@/lib/validations/message'
import { checkFriendship, sendMessage } from '@/services/upstash'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export const POST = async (req: Request) => {
  const {
    channels: { chatById, userChats },
    events: { incomingMessage, newMessage }
  } = pusher

  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized, invalid session', { status: 401 })

    const {
      text,
      chatId
    }: {
      text: string
      chatId: string
    } = await req.json()

    const [userId1, userId2] = chatId.split('--')
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized, invalid chat id', { status: 401 })
    }

    const receiverId = session.user.id === userId1 ? userId2 : userId1
    const isFriend = await checkFriendship(session.user.id, receiverId)
    if (!isFriend) return new Response('Unauthorized', { status: 401 })

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      timestamp: Date.now(),
      text
    }

    const message = messageValidator.parse(messageData)

    await sendMessage(chatId, message)
    await pusherServer.trigger(chatById(chatId), incomingMessage, message)
    await pusherServer.trigger(userChats(receiverId), newMessage, {
      ...message,
      senderImg: session.user.image,
      senderName: session.user.name
    })

    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof Error) return new Response(error.message, { status: 500 })

    return new Response('Internal server Error', { status: 500 })
  }
}
