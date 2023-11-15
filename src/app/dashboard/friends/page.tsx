import { FriendList } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { getFriends } from '@/services/upstash'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const FriendsPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const session = await getServerSession(nextAuthOptions)
  if (!session) return notFound()

  const friends = await getFriends(session.user.id)

  return (
    <main className='pt-8'>
      <h1 className='mb-8 text-5xl font-bold'>Friends</h1>
      <div className='flex flex-col gap-4'>
        <FriendList sessionId={session.user.id} friends={friends} />
      </div>
    </main>
  )
}

export default FriendsPage
