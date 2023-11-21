import { nextAuthOptions } from '@/lib/constants/auth.const'
import { getFriendRequests, getUser } from '@/services/upstash'
import { getServerSession } from 'next-auth'

export const GET = async () => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const friendRequests = await getFriendRequests(session.user.id)

    const incomingFriendRequests = (
      await Promise.all(
        friendRequests.map(async (senderId) => {
          const sender = await getUser(senderId)
          if (sender === null) return null
          return {
            senderId,
            senderEmail: sender.email
          }
        })
      )
    ).filter((item) => item !== null)

    return new Response(JSON.stringify(incomingFriendRequests))
  } catch (error) {
    console.log(error)

    return new Response('Invalid request', { status: 400 })
  }
}
