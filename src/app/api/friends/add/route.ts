import { nextAuthOptions } from '@/lib/constants/auth.const'
import { pusher } from '@/lib/constants/pusher.const'
import { pusherServer } from '@/lib/pusher'
import { addFriendDataValidator } from '@/lib/validations/add-friend'
import { checkFriendRequestSent, checkFriendship, getUserId, sendFriendRequestUpstash } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { ZodError } from 'zod'

export const POST = async (req: Request) => {
  const {
    channels: { friendRequestsById },
    events: { incomingFriendRequests }
  } = pusher

  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { email: emailToAdd } = addFriendDataValidator.parse(body)
    const idToAdd = await getUserId(emailToAdd)

    if (!idToAdd) return new Response('This person does not exist', { status: 404 })
    if (idToAdd === session.user.id) return new Response('You cannot add yourself as a friend', { status: 400 })

    const isFriendRequestSent = await checkFriendRequestSent(idToAdd, session.user.id)
    if (isFriendRequestSent) return new Response('Friend request already sent', { status: 400 })

    const isFriend = await checkFriendship(idToAdd, session.user.id)
    if (isFriend) {
      return new Response('The user you are trying to send the request to is already your friend', { status: 400 })
    }

    await sendFriendRequestUpstash(idToAdd, session.user.id)
    await pusherServer.trigger(friendRequestsById(idToAdd), incomingFriendRequests, {
      senderId: session.user.id,
      senderEmail: session.user.email
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    console.log(error)

    return new Response('Unexpected error, check the console', { status: 500 })
  }
}
