import { redisKeys } from '@/lib/constants/redis-keys.const'
import { db } from '@/lib/db'

export const getChats = async (userId: string) => {
  const { chatsByUserId } = redisKeys
  const res = await db.smembers<CustomChat[]>(chatsByUserId(userId))

  if (res === null) {
    return []
  }

  return res
}
