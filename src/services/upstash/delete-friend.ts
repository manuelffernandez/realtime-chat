import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const deleteFriend = async (userId: string, senderId: string) => {
  const { friendsById } = redisKeys

  const removeFriend = await fetchRedis<0 | 1>({ command: 'srem', args: [friendsById(userId), senderId] })
  const removeUser = await fetchRedis<0 | 1>({ command: 'srem', args: [friendsById(senderId), userId] })

  return removeFriend && removeUser
}
