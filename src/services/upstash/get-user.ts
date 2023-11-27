import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const getUser = async (userId: string) => {
  const { userById } = redisKeys
  const JSONUser = await fetchRedis<string>({ command: 'get', args: [userById(userId)] }, { cache: 'no-store' })
  const user = JSON.parse(JSONUser) as User | null
  return user
}
