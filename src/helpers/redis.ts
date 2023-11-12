type Command = 'zrange' | 'sismember' | 'get' | 'smembers' | 'sadd' | 'srem' | 'zadd'

interface RedisRequest {
  command: Command
  args: Array<string | number>
}

// This function is exclusively callable from the server side due to the necessity of keeping the environment variable UPSTASH_REDIS_REST_TOKEN confidential,
// which cannot be exposed on the client side. The requirement to keep this env var confidential comes from the Redis.fromEnv method called within "./src/lib/db.ts" file
export const fetchRedis = async <T = any>(req: RedisRequest, init: RequestInit | undefined = {}): Promise<T> => {
  const { command, args } = req
  const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL ?? ''}/${command}/${args.join('/')}`

  const response = await fetch(commandUrl, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN ?? ''}`
    }
  })

  if (!response.ok) {
    throw new Error(`Error executing Redis command ${response.statusText}`)
  }

  const data = await response.json()
  return data.result
}
