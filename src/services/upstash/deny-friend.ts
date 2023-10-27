import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const denyFriend = async (userId: string, senderId: string) => {
  const { friendRequestsById } = redisKeys

  await fetchRedis<0 | 1>({
    command: 'srem',
    args: [friendRequestsById(userId), senderId]
  })

  await fetchRedis<0 | 1>({
    command: 'srem',
    args: [friendRequestsById(senderId), userId]
  })
}
