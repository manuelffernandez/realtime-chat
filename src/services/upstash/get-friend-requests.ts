import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const getFriendRequests = async (userId: string) => {
  const { friendRequestsById } = redisKeys
  const friendRequests = await fetchRedis<string[]>(
    { command: 'smembers', args: [friendRequestsById(userId)] },
    { cache: 'no-store' }
  )
  return friendRequests
}
