import { pusher } from '@/lib/constants/pusher.const'
import { redisKeys } from '@/lib/constants/redis-keys.const'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { type Message } from '@/lib/validations/message'
import { getChats } from '@/services/upstash'
import { type User } from 'next-auth'

export const sendMessage = async (sessionUser: User, receiverId: string, chatId: string, message: Message) => {
  const {
    channels: { chatById, userChats },
    events: { incomingMessage, newMessage, newActiveChat }
  } = pusher
  const { chatById: chatByIdRedis, chatsByUserId } = redisKeys

  const chats = await getChats(sessionUser.id)
  const chatExists = chats.some((chat) => chat.chatId === chatId)

  if (!chatExists) {
    const tx = db.multi()
    tx.sadd(chatsByUserId(sessionUser.id), JSON.stringify({ chatId, partnerId: receiverId }))
    tx.sadd(chatsByUserId(receiverId), JSON.stringify({ chatId, partnerId: sessionUser.id }))
    tx.zadd(chatByIdRedis(chatId), {
      score: message.timestamp,
      member: JSON.stringify(message)
    })
    await tx.exec()
    await pusherServer.trigger(userChats(sessionUser.id), newActiveChat, { chatId, partnerId: receiverId })
    await pusherServer.trigger(userChats(receiverId), newActiveChat, { chatId, partnerId: sessionUser.id })
  } else {
    await db.zadd(chatByIdRedis(chatId), {
      score: message.timestamp,
      member: JSON.stringify(message)
    })
  }

  void pusherServer.trigger(chatById(chatId), incomingMessage, message)
  void pusherServer.trigger(userChats(receiverId), newMessage, {
    ...message,
    senderImg: sessionUser.image,
    senderName: sessionUser.name
  })
}
