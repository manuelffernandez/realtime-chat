import { Redis } from '@upstash/redis'

// typescript problem
// More info https://stackoverflow.com/questions/76118394/passing-a-strings-from-env-local-on-new-redis-instance-giving-an-error
// export const db = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN
// })

export const db = Redis.fromEnv()
