import { FriendRequests } from '@/components'

const FriendRequestsPage = () => {
  return (
    <main className='pt-8'>
      <h1 className='mb-8 text-5xl font-bold'>Friend requests</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests />
      </div>
    </main>
  )
}

export default FriendRequestsPage
