'use client'

import { useRef, useState, type FC } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from '@/components'
import axios from 'axios'
import { routes } from '@/lib/constants/routes.const'
import toast from 'react-hot-toast'

interface Props {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<Props> = (props) => {
  const { chatPartner, chatId } = props
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input) return
    setIsLoading(true)
    try {
      await axios.post(routes.api.sendMessage, { text: input, chatId })
      setInput('')
      textareaRef.current?.focus()
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mb-2 border-t border-gray-200 px-4 pt-4 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div className='py-2' aria-hidden='true' onClick={() => textareaRef.current?.focus()}>
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrink-0'>
            <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
              {isLoading ? 'Sending' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
