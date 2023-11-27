import { SignOutButton } from '@/components'
import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getChats, getUser } from '@/services/upstash'
import { getLastMessage } from '@/services/upstash/get-last-message'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'

const DashboardPage = async () => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) redirect(routes.pages.signIn)

  const chats = await getChats(session.user.id)
  const lastFriendMessages = await Promise.all(
    chats.map(async (chat): Promise<{ friend: User; lastMessage: Message }> => {
      try {
        const [lastMessage] = await getLastMessage(chat.chatId)
        const friend = await getUser(chat.partnerId)

        if (friend === null) {
          return {
            friend: { name: 'not found', email: 'not found', id: chat.partnerId, image: './alert-triangle.png' },
            lastMessage
          }
        }

        return { friend, lastMessage }
      } catch (error) {
        console.log('last friend message error', error)
        toast.error('error while getting last messages')
        return {
          friend: { name: 'not found', email: 'not found', id: chat.partnerId, image: './alert-triangle.png' },
          lastMessage: { id: '', senderId: '', text: '', timestamp: 0 }
        }
      }
    })
  )

  return (
    <div className='container py-12'>
      <p>Hello {session.user.name}</p>
      <h1 className='mb-8 text-5xl font-bold'>Recent chats</h1>
      {lastFriendMessages.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        lastFriendMessages
          .sort((a, b) => a.lastMessage.timestamp - b.lastMessage.timestamp)
          .map((lastFriendMessage) => {
            const { friend, lastMessage } = lastFriendMessage
            return (
              <Link key={friend.id} href={`${routes.pages.chat}/${chatIdConstructor(session.user.id, friend.id)}`}>
                <div className='relative mb-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:bg-zinc-100'>
                  <div className='absolute inset-y-0 right-4 flex items-center'>
                    <ChevronRight className='h-7 w-7 text-zinc-400' />
                  </div>

                  <div className='relative sm:flex'>
                    <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                      <div className='relative h-6 w-6'>
                        <Image
                          referrerPolicy='no-referrer'
                          className='rounded-full'
                          alt={`${friend.name} profile picture`}
                          src={friend.image}
                          fill
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className='text-lg font-semibold'>{friend.name}</h4>
                      <p className='mt-1 max-w-md'>
                        <span className='text-zinc-400'>{lastMessage.senderId === session.user.id ? 'You: ' : ''}</span>
                        {lastMessage.text}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
      )}
      <SignOutButton />
    </div>
  )
}

export default DashboardPage
