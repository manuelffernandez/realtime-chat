import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const checkFriendRequestSent = async (userId: string, senderId: string) => {
  const { friendRequestsById } = redisKeys
  const isFriendRequestSent = await fetchRedis<0 | 1>(
    { command: 'sismember', args: [friendRequestsById(userId), senderId] },
    { cache: 'no-store' }
  )
  return isFriendRequestSent
}
