import { nextAuthOptions } from '@/lib/constants/auth.const'
import { checkFriendship, getUser } from '@/services/upstash'
import { getServerSession } from 'next-auth'

export const GET = async (req: Request, { params }: { params: { userId: string } }) => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { userId } = params
    if (session.user.id === userId) return new Response(JSON.stringify(session.user))

    const isFriend = await checkFriendship(userId, session.user.id)
    if (!isFriend) {
      return new Response('The requested user is not on your friends list', { status: 403 })
    }

    const user = await getUser(userId)
    if (user === null) return new Response('User does not exist', { status: 404 })

    return new Response(JSON.stringify(user))
  } catch (error) {
    console.log('get user by userId route handler error', error)
    return new Response(JSON.stringify({ message: 'Unexpected internal server error', serverError: error }), {
      status: 500
    })
  }
}
