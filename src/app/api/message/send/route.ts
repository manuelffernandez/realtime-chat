// import { fetchRedis } from '@/helpers/redis'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { pusher } from '@/lib/constants/pusher.const'
import { redisKeys } from '@/lib/constants/redis-keys.const'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { messageValidator, type Message } from '@/lib/validations/message'
import { checkFriendship, getChats } from '@/services/upstash'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export const POST = async (req: Request) => {
  const {
    channels: { chatById, userChats },
    events: { incomingMessage, newMessage, newActiveChat }
  } = pusher
  const { chatById: chatByIdRedis, chatsByUserId } = redisKeys

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
    const senderId = session.user.id
    const isFriend = await checkFriendship(senderId, receiverId)
    if (!isFriend) return new Response('Unauthorized', { status: 401 })

    const messageData: Message = {
      id: nanoid(),
      senderId,
      timestamp: Date.now(),
      text
    }

    const message = messageValidator.parse(messageData)

    const chats = await getChats(senderId)
    const chatExists = chats.some((chat) => chat.chatId === chatId)

    // TODO: use transaction instead
    if (!chatExists) {
      const tx = db.multi()
      tx.sadd(chatsByUserId(senderId), JSON.stringify({ chatId, partnerId: receiverId }))
      tx.sadd(chatsByUserId(receiverId), JSON.stringify({ chatId, partnerId: senderId }))
      tx.zadd(chatByIdRedis(chatId), {
        score: message.timestamp,
        member: JSON.stringify(message)
      })
      await tx.exec()
      await pusherServer.trigger(userChats(senderId), newActiveChat, { chatId, partnerId: receiverId })
      await pusherServer.trigger(userChats(receiverId), newActiveChat, { chatId, partnerId: senderId })
    } else {
      await db.zadd(chatByIdRedis(chatId), {
        score: message.timestamp,
        member: JSON.stringify(message)
      })
    }

    void pusherServer.trigger(chatById(chatId), incomingMessage, message)
    void pusherServer.trigger(userChats(receiverId), newMessage, {
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
