'use client'

import { pusher } from '@/lib/constants/pusher.const'
import { pusherClient } from '@/lib/pusher'
import { type Message } from '@/lib/validations/message'
import clsx from 'clsx'
import { format } from 'date-fns'
import Image from 'next/image'
import { useEffect, useRef, useState, type FC } from 'react'

interface Props {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string
  chatPartner: User
}

const Messages: FC<Props> = (props) => {
  const { initialMessages, sessionId, chatId, sessionImg, chatPartner } = props
  const {
    channels: { chatById },
    events: { incomingMessage }
  } = pusher

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }
    pusherClient.subscribe(chatById(chatId))
    pusherClient.bind(incomingMessage, messageHandler)

    return () => {
      pusherClient.unsubscribe(chatById(chatId))
      pusherClient.unbind(incomingMessage, messageHandler)
    }
  }, [chatId, incomingMessage, chatById])

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

              <div
                className={clsx('relative h-6 w-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMsgFromSameUser
                })}
              >
                <Image
                  fill
                  src={isCurrentUser ? sessionImg : chatPartner.image}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
