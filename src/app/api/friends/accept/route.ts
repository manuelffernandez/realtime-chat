import { nextAuthOptions } from '@/lib/constants/auth.const'
import { acceptFriend, checkFriendRequestSent, checkFriendship } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { ZodError, z } from 'zod'

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

    const isFriend = await checkFriendship(session.user.id, idToAdd)
    if (isFriend) return new Response('Already friends', { status: 400 })

    const hasFriendRequest = await checkFriendRequestSent(session.user.id, idToAdd)
    if (!hasFriendRequest) return new Response('No friend request', { status: 400 })

    const isAccepted = await acceptFriend(session.user.id, idToAdd)
    if (!isAccepted) return new Response('Something went wrong while accepting the friend request', { status: 500 })

    return new Response('OK')
  } catch (error) {
    console.log(error)

    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    return new Response('Invalid request', { status: 400 })
  }
}
