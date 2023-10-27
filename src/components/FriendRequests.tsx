'use client'

import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'
import clsx from 'clsx'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type FC } from 'react'

interface Props {
  incomingFriendRequest: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<Props> = (props) => {
  const { incomingFriendRequest } = props
  const router = useRouter()
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequest)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const acceptFriend = async (senderId: string) => {
    setIsSubmitting(true)
    try {
      await axios.post(routes.api.acceptFriend, { id: senderId })

      setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId))

      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  const denyFriend = async (senderId: string) => {
    setIsSubmitting(true)
    try {
      await axios.post(routes.api.denyFriend, { id: senderId })

      setFriendRequests((prev) => prev.filter((req) => req.senderId !== senderId))

      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex items-center gap-4'>
            <UserPlus className='text-black' />
            <p className='text-lg font-normal'>{request.senderEmail}</p>
            <button
              disabled={isSubmitting}
              onClick={() => {
                void acceptFriend(request.senderId)
              }}
              aria-label='accept friend'
              className={`grid h-8 w-8 place-items-center rounded-full ${clsx(
                isSubmitting
                  ? 'cursor-default bg-indigo-300'
                  : 'bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md'
              )}`}
            >
              <Check className='h-3/4 w-3/4 font-semibold text-white' />
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => {
                void denyFriend(request.senderId)
              }}
              aria-label='deny friend'
              className={`grid h-8 w-8 place-items-center rounded-full ${clsx(
                isSubmitting
                  ? 'cursor-default bg-indigo-300'
                  : 'bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md'
              )}`}
            >
              <X className='h-3/4 w-3/4 font-semibold text-white' />
            </button>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests
