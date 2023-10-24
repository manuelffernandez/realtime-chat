import { fetchRedis } from '@/helpers/redis'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { addFriendDataValidator } from '@/lib/validations/add-friend'
import { getServerSession } from 'next-auth'
import { ZodError } from 'zod'
import { redisKeys } from '@/lib/constants/redis-keys'

export const POST = async (req: Request) => {
  try {
    const { idByEmail, friendRequestsById, friendsById } = redisKeys
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    const { email: emailToAdd } = addFriendDataValidator.parse(body)

    const idToAdd = (await fetchRedis(
      { command: 'get', args: [idByEmail(emailToAdd)] },
      { cache: 'no-store' }
    )) as string

    if (!idToAdd) {
      return new Response('This person does not exist', { status: 404 })
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself as a friend', { status: 400 })
    }

    const isFriendRequestSent = await fetchRedis(
      { command: 'sismember', args: [friendRequestsById(idToAdd), session.user.id] },
      { cache: 'no-store' }
    )

    if (isFriendRequestSent) return new Response('Friend request already sent', { status: 400 })

    const isFriend = (await fetchRedis(
      { command: 'sismember', args: [friendsById(idToAdd), session.user.id] },
      { cache: 'no-store' }
    )) as 0 | 1

    if (isFriend) {
      return new Response('The user you are trying to send the request to is already your friend', { status: 400 })
    }

    await fetchRedis({
      command: 'sadd',
      args: [friendRequestsById(idToAdd), session.user.id]
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    console.log(error)
    return new Response('Unexpected error, check the console', { status: 500 })
  }
}
