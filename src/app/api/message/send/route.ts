import { nextAuthOptions } from '@/lib/constants/auth.const'
import { type Message, messageValidator } from '@/lib/validations/message'
import { checkFriendship, sendMessage } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { nanoid } from 'nanoid'

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

    const friendId = session.user.id === userId1 ? userId2 : userId1
    const isFriend = await checkFriendship(session.user.id, friendId)
    if (!isFriend) return new Response('Unauthorized', { status: 401 })

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      timestamp: Date.now(),
      text
    }

    const message = messageValidator.parse(messageData)

    await sendMessage(chatId, message)
    return new Response('OK')
  } catch (error) {
    if (error instanceof Error) return new Response(error.message, { status: 500 })

    console.log(error)
    return new Response('Internal server Error', { status: 500 })
  }
}
