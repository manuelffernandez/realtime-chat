import { FriendRequests } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { getFriendRequests, getUser } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const FriendRequestsPage = async () => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) notFound()

  const incomingSenderIds = await getFriendRequests(session.user.id)

  const incomingFriendRequests = await Promise.all(
    incomingSenderIds.map(async (senderId) => {
      const sender = await getUser(senderId)

      return {
        senderId,
        senderEmail: sender.email
      }
    })
  )

  return (
    <main className='pt-8'>
      <h1 className='mb-8 text-5xl font-bold'>Friend requests</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests incomingFriendRequest={incomingFriendRequests} sessionId={session.user.id} />
      </div>
    </main>
  )
}

export default FriendRequestsPage
