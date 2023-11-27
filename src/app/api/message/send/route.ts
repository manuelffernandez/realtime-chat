import { nextAuthOptions } from '@/lib/constants/auth.const'
import { messageValidator, type Message } from '@/lib/validations/message'
import { checkFriendship, sendMessage } from '@/services/upstash'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(nextAuthOptions)
    if (!session) return new Response('Unauthorized, invalid session', { status: 401 })

    const {
      text,
      chatId
    }: {
      text: string
      chatId: string
    } = await req.json()

    const [userId1, userId2] = chatId.split('--')
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized, invalid chat id', { status: 401 })
    }

    const receiverId = session.user.id === userId1 ? userId2 : userId1
    const senderId = session.user.id
    const isFriend = await checkFriendship(senderId, receiverId)
    if (!isFriend) return new Response('Unauthorized', { status: 401 })

    const messageData: Message = {
      id: nanoid(),
      senderId,
      timestamp: Date.now(),
      text
    }

    const message = messageValidator.parse(messageData)
    await sendMessage(session.user, receiverId, chatId, message)

    return new Response('OK')
  } catch (error) {
    console.log('send message route handler error', error)

    if (error instanceof Error) return new Response(error.message, { status: 500 })

    return new Response(JSON.stringify({ message: 'Unexpected internal server error', serverError: error }), {
      status: 500
    })
  }
}
