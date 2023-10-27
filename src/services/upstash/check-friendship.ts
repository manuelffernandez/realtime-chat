import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const checkFriendship = async (userId: string, idToCheck: string) => {
  const { friendsById } = redisKeys
  const isFriend = await fetchRedis<0 | 1>(
    { command: 'sismember', args: [friendsById(userId), idToCheck] },
    { cache: 'no-store' }
  )
  return isFriend
}
