import { fetchRedis } from '@/helpers/redis'
import { redisKeys } from '@/lib/constants/redis-keys.const'

export const getUserId = async (email: string) => {
  const { idByEmail } = redisKeys
  const id = await fetchRedis<string>({ command: 'get', args: [idByEmail(email)] }, { cache: 'no-store' })
  return id
}
