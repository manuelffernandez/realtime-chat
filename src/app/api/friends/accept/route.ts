import { nextAuthOptions } from '@/lib/constants/auth.const'
import { pusher } from '@/lib/constants/pusher.const'
import { pusherServer } from '@/lib/pusher'
import { acceptFriend, checkFriendRequestSent, checkFriendship } from '@/services/upstash'
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
    const { id: idToAccept, email: emailToAccept } = z.object({ id: z.string(), email: z.string().email() }).parse(body)

    const isFriend = await checkFriendship(session.user.id, idToAccept)
    if (isFriend) return new Response('Already friends', { status: 400 })

    const hasFriendRequest = await checkFriendRequestSent(session.user.id, idToAccept)
    if (!hasFriendRequest) return new Response('No friend request', { status: 400 })

    const isAccepted = await acceptFriend(session.user.id, idToAccept)
    if (!isAccepted) return new Response('Something went wrong while accepting the friend request', { status: 500 })

    await pusherServer.trigger(friendRequestsById(session.user.id), outgoingFriendRequests, {
      senderId: idToAccept,
      senderEmail: emailToAccept
    })

    return new Response('OK')
  } catch (error) {
    console.log('accept friend route handler error', error)

    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    return new Response(JSON.stringify({ message: 'Unexpected internal server error', serverError: error }), {
      status: 500
    })
  }
}
