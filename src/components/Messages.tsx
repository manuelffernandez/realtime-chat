'use client'

import { type FC, useRef, useState } from 'react'
import { type Message } from '@/lib/validations/message'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props {
  initialMessages: Message[]
  sessionId: string
}

const Messages: FC<Props> = (props) => {
  const { initialMessages, sessionId } = props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const formatTimestamp = (ts: number) => {
    return format(ts, 'HH:mm')
  }

  return (
    <div
      id='messages'
      className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3'
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId
        const hasNextMsgFromSameUser = messages[index - 1]?.senderId === messages[index].senderId

        return (
          <div key={`${message.id}-${message.timestamp}`} className='chat-message'>
            <div className={clsx('flex items-end', { 'justify-end': isCurrentUser })}>
              <div
                className={clsx('mx-2 flex max-w-xs flex-col space-y-2 text-base', {
                  'order-1 items-end': isCurrentUser,
                  'order-2 items-start': !isCurrentUser
                })}
              >
                <span
                  className={clsx('inline-block rounded-lg px-4 py-2', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none': !hasNextMsgFromSameUser && isCurrentUser,
                    'rounded-bl-none': !hasNextMsgFromSameUser && !isCurrentUser
                  })}
                >
                  {message.text}{' '}
                  <span className='ml-2 text-xs text-gray-400'>{formatTimestamp(message.timestamp)}</span>
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
