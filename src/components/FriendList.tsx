'use client'

import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { routes } from '@/lib/constants/routes.const'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { type FC } from 'react'

interface Props {
  friends: User[]
  sessionId: string
}

const FriendList: FC<Props> = (props) => {
  const { friends, sessionId } = props

  return (
    <>
      {friends.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            className='flex w-full items-center justify-between gap-4 rounded-lg border border-indigo-100 px-5 py-2'
          >
            <div>
              <p className='text-lg font-normal'>{friend.name}</p>
              <p className='text-xs text-gray-400'>{friend.email}</p>
            </div>
            <Link
              href={`${routes.pages.chat}/${chatIdConstructor(sessionId, friend.id)}`}
              aria-label='accept friend'
              title='Start chatting'
              className='group grid h-8 w-8 place-items-center rounded-lg bg-indigo-300 transition hover:shadow-md group-hover:bg-indigo-200'
            >
              <MessageSquare className='h-3/4 w-3/4 font-semibold text-indigo-500 group-hover:text-indigo-600' />
            </Link>
          </div>
        ))
      )}
    </>
  )
}

export default FriendList
