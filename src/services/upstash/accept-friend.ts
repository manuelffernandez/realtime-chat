import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const acceptFriend = async (userId: string, senderId: string) => {
  const { friendsById, friendRequestsById } = redisKeys

  const addSenderFriend = await fetchRedis<0 | 1>({ command: 'sadd', args: [friendsById(userId), senderId] })
  const addUserFriend = await fetchRedis<0 | 1>({ command: 'sadd', args: [friendsById(senderId), userId] })
  await fetchRedis<0 | 1>({
    command: 'srem',
    args: [friendRequestsById(userId), senderId]
  })

  await fetchRedis<0 | 1>({
    command: 'srem',
    args: [friendRequestsById(senderId), userId]
  })

  return addSenderFriend && addUserFriend
}
