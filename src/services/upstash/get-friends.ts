import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const getFriends = async (userId: string) => {
  const { friendsById, userById } = redisKeys

  const friendsIds = await fetchRedis<string[]>(
    { command: 'smembers', args: [friendsById(userId)] },
    { cache: 'no-cache' }
  )

  const friends = await Promise.all(
    friendsIds.map(async (friendId) => {
      const friendJSON = await fetchRedis<string>({ command: 'get', args: [userById(friendId)] }, { cache: 'no-cache' })
      const friend = JSON.parse(friendJSON)
      return friend as User
    })
  )

  return friends
}
