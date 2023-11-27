import { nextAuthOptions } from '@/lib/constants/auth.const'
import { checkFriendship, deleteFriend } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { ZodError, z } from 'zod'

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()
    const { id: idToDelete } = z.object({ id: z.string() }).parse(body)

    const isFriend = await checkFriendship(session.user.id, idToDelete)
    if (!isFriend) return new Response('Unable to remove someone not currently listed as a friend.', { status: 404 })

    const isDeleted = await deleteFriend(session.user.id, idToDelete)
    if (!isDeleted) {
      return new Response('Something went wrong while deleting the user from the friend list', { status: 403 })
    }

    return new Response('OK')
  } catch (error) {
    console.log('delete friend route handler error', error)

    if (error instanceof ZodError) return new Response('Invalid request payload', { status: 422 })

    return new Response(JSON.stringify({ message: 'Unexpected internal server error', serverError: error }), {
      status: 500
    })
  }
}
