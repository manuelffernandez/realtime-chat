import { ChatInput, Messages } from '@/components'
import { fetchRedis } from '@/helpers/redis'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { redisKeys } from '@/lib/constants/redis-keys.const'
import { routes } from '@/lib/constants/routes.const'
import { messageArrayValidator } from '@/lib/validations/message'
import { getUser } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: {
    chatId: string
  }
}

const getChatMessages = async (chatId: string) => {
  const { chatById } = redisKeys
  try {
    const result = await fetchRedis<string[]>({ command: 'zrange', args: [chatById(chatId), 0, -1] })
    const dbMessages = result.map((msg) => JSON.parse(msg))
    const reversedDbMessages = dbMessages.reverse()
    const messages = messageArrayValidator.parse(reversedDbMessages)
    return messages
  } catch (error) {
    console.log(error)
    // TODO: improve not-found chat case
    notFound()
  }
}

const ChatIdPage = async (props: Props) => {
  const { params } = props
  const { chatId } = params
  const session = await getServerSession(nextAuthOptions)
  if (!session) redirect(routes.pages.signIn)

  const DELIMITER = '--'
  const [userId1, userId2] = chatId.split(DELIMITER)

  if (session.user.id !== userId1 && session.user.id !== userId2) notFound()

  const chatPartnerId = session.user.id === userId1 ? userId2 : userId1
  const chatPartner = await getUser(chatPartnerId)
  if (chatPartner === null) notFound()
  const initialMessages = await getChatMessages(chatId)

  return (
    <div className='flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between'>
      <div className='flex justify-between border-b-2 border-gray-200 py-3 sm:items-center'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative h-8 w-8 sm:h-12 sm:w-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.image} profile picture `}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='flex items-center text-xl'>
              <span className='mr-3 font-semibold text-gray-700'>{chatPartner.name}</span>
            </div>
            <span className='text-sm text-gray-600'>{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        sessionImg={session.user.image}
        chatPartner={chatPartner}
        initialMessages={initialMessages}
        sessionId={session.user.id}
        chatId={chatId}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
  )
}

export default ChatIdPage
