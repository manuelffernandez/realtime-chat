import { nextAuthOptions } from '@/lib/constants/auth.const'
import { pusher } from '@/lib/constants/pusher.const'
import { pusherServer } from '@/lib/pusher'
import { checkFriendRequestSent, checkFriendship, denyFriend } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { ZodError, z } from 'zod'

export const POST = async (req: Request) => {
  const {
    channels: { friendRequestsById },
    events: { outgoingFriendRequests }
  } = pusher

  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { id: idToDeny, email: emailToDeny } = z.object({ id: z.string(), email: z.string().email() }).parse(body)

    const isFriend = await checkFriendship(session.user.id, idToDeny)
    if (isFriend) return new Response('Already friends', { status: 400 })

    const hasFriendRequest = await checkFriendRequestSent(session.user.id, idToDeny)
    if (!hasFriendRequest) return new Response('No friend request', { status: 400 })

    await denyFriend(session.user.id, idToDeny)
    await pusherServer.trigger(friendRequestsById(session.user.id), outgoingFriendRequests, {
      senderId: idToDeny,
      senderEmail: emailToDeny
    })

    return new Response('OK')
  } catch (error) {
    console.log('deny friend route handler error', error)

    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    return new Response(JSON.stringify({ message: 'Unexpected internal server error', serverError: error }), {
      status: 500
    })
  }
}
