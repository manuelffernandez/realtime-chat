import { chatIdConstructor } from '@/helpers/chat-id-constructor'
import { routes } from '@/lib/constants/routes.const'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'
import toast, { type Toast } from 'react-hot-toast'

interface Props {
  t: Toast
  sessionId: string
  senderId: string
  senderImg: string
  senderName: string
  senderMessage: string
}

const UnseenChatToast: FC<Props> = (props) => {
  const { t, sessionId, senderId, senderImg, senderName, senderMessage } = props

  return (
    <div
      className={clsx(
        'pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
        {
          'animate-enter': t.visible,
          'animate-leave': !t.visible
        }
      )}
    >
      <Link
        onClick={() => toast.dismiss(t.id)}
        href={`${routes.pages.chat}/${chatIdConstructor(sessionId, senderId)}`}
        className='w-0 flex-1 p-4'
      >
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5 '>
            <div className='relative h-10 w-10'>
              <Image
                fill
                referrerPolicy='no-referrer'
                className='rounded-full'
                src={senderImg}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>{senderName}</p>
            <p className='mt-1 text-sm text-gray-500'>{senderMessage}</p>
          </div>
        </div>
      </Link>

      <div className='flex border-l  border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default UnseenChatToast
