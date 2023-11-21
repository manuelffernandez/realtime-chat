import { redisKeys } from '@/lib/constants/redis-keys.const'
import { db } from '@/lib/db'
import { type Message } from '@/lib/validations/message'

export const sendMessage = async (chatId: string, message: Message) => {
  const { chatById } = redisKeys

  await db.zadd(chatById(chatId), {
    score: message.timestamp,
    member: JSON.stringify(message)
  })
}
