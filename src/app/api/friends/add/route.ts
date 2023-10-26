import { nextAuthOptions } from '@/lib/constants/auth.const'
import { addFriendDataValidator } from '@/lib/validations/add-friend'
import { checkFriendRequestSent } from '@/services/upstash/check-friend-request-sent'
import { checkFriendship } from '@/services/upstash/check-friendship'
import { getUserId } from '@/services/upstash/get-user-id'
import { sendFriendRequestUpstash } from '@/services/upstash/send-friend-request-upstash'
import { getServerSession } from 'next-auth'
import { ZodError } from 'zod'

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    const { email: emailToAdd } = addFriendDataValidator.parse(body)

    const idToAdd = await getUserId(emailToAdd)

    if (!idToAdd) {
      return new Response('This person does not exist', { status: 404 })
    }

    if (idToAdd === session.user.id) {
      return new Response('You cannot add yourself as a friend', { status: 400 })
    }

    const isFriendRequestSent = await checkFriendRequestSent(idToAdd, session.user.id)

    if (isFriendRequestSent) return new Response('Friend request already sent', { status: 400 })

    const isFriend = await checkFriendship(idToAdd, session.user.id)

    if (isFriend) {
      return new Response('The user you are trying to send the request to is already your friend', { status: 400 })
    }

    await sendFriendRequestUpstash(idToAdd, session.user.id)

    return new Response('OK')
  } catch (error) {
    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    console.log(error)
    return new Response('Unexpected error, check the console', { status: 500 })
  }
}
