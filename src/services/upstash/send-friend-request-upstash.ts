import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const sendFriendRequestUpstash = async (userId: string, senderId: string) => {
  const { friendRequestsById } = redisKeys
  const isSended = await fetchRedis<0 | 1>(
    { command: 'sadd', args: [friendRequestsById(userId), senderId] },
    { cache: 'no-store' }
  )
  return isSended
}
