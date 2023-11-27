'use client'

import { Modal } from '@/components'
import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'
import { MessageSquare, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FC } from 'react'

interface Props {
  friends: User[]
  sessionId: string
}

const FriendList: FC<Props> = (props) => {
  const { friends, sessionId } = props

  const router = useRouter()
  const [selectedFriend, setSelectedFriend] = useState<User | undefined>(undefined)
  const [openModal, setOpenModal] = useState(false)

  const deleteFriend = async () => {
    await axios.post(routes.api.deleteFriend, { id: selectedFriend?.id })
  }

  const onClose = () => {
    setSelectedFriend(undefined)
    setOpenModal(false)
    router.refresh()
  }

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
            <div className='flex flex-row gap-4'>
              <Link
                href={`${routes.pages.chat}/${chatIdConstructor(sessionId, friend.id)}`}
                aria-label='accept friend'
                title='Start chatting'
                className='group grid h-8 w-8 place-items-center rounded-lg border border-indigo-500 transition hover:shadow-md group-hover:bg-indigo-200'
              >
                <MessageSquare className='h-3/4 w-3/4 rounded-md  font-semibold text-indigo-500 group-hover:text-indigo-600' />
              </Link>
              <button
                onClick={() => {
                  setSelectedFriend(friend)
                  setOpenModal(true)
                }}
                className='group grid h-8 w-8 place-items-center rounded-lg border border-red-500 transition hover:shadow-md group-hover:bg-red-200'
                title='Delete friend'
                aria-label='delete friend'
              >
                <Trash className='h-3/4 w-3/4 font-semibold text-red-500 group-hover:text-red-600' />
              </button>
            </div>
          </div>
        ))
      )}
      <Modal
        action={deleteFriend}
        btnTitle='Delete'
        description={`Are you sure you want to delete ${selectedFriend?.name || ''} from your friend list?`}
        title='Delete friend'
        intent='danger'
        open={openModal}
        onClose={onClose}
      />
    </>
  )
}

export default FriendList
