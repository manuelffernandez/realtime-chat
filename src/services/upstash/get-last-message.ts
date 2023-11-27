import { redisKeys } from '@/lib/constants/redis-keys.const'
import { db } from '@/lib/db'
import { type Message } from '@/lib/validations/message'

export const getLastMessage = async (chatId: string) => {
  const { chatById } = redisKeys
  const res = await db.zrange<Message[]>(chatById(chatId), -1, -1)
  return res
}
