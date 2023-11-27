'use client'

import { useFriendRequests } from '@/hooks/useFriendRequests'
import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'
import clsx from 'clsx'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

const FriendRequests = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { state } = useFriendRequests()
  const { friendRequests } = state

  const acceptFriend = async (senderId: string, senderEmail: string) => {
    setIsSubmitting(true)
    try {
      await axios.post(routes.api.acceptFriend, { id: senderId, email: senderEmail })

      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
      console.log('accept friend handler error', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const denyFriend = async (senderId: string, senderEmail: string) => {
    setIsSubmitting(true)
    try {
      await axios.post(routes.api.denyFriend, { id: senderId, email: senderEmail })

      router.refresh()
    } catch (error) {
      console.log('deny friend handler error', error)
    } finally {
      setIsSubmitting(false)
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
                void acceptFriend(request.senderId, request.senderEmail as string)
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
                void denyFriend(request.senderId, request.senderEmail as string)
              }}
              aria-label='deny friend'
              className={`grid h-8 w-8 place-items-center rounded-full ${clsx(
                isSubmitting ? 'cursor-default bg-red-300' : 'bg-red-600 transition hover:bg-red-700 hover:shadow-md'
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
