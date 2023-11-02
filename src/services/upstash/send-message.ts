import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'
import { type Message } from '@/lib/validations/message'

export const sendMessage = async (chatId: string, message: Message) => {
  const { chatById } = redisKeys

  const res = await fetchRedis<0 | 1>({
    command: 'zadd',
    args: [chatById(chatId), message.timestamp, JSON.stringify(message)]
  })

  return res
}
