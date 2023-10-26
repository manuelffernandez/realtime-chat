type Command = 'zrange' | 'sismember' | 'get' | 'smembers' | 'sadd'

interface RedisRequest {
  command: Command
  args: Array<string | number>
}

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
