'use client'

import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Fragment, useRef, useState, type FC } from 'react'
import toast from 'react-hot-toast'

interface Props {
  title: string
  btnTitle: string
  description: string
  intent: 'danger' | 'default'
  open: boolean
  onClose: () => void
  action: () => Promise<void>
}

const Modal: FC<Props> = (props) => {
  const { description, title, btnTitle, action, intent, onClose, open } = props

  const [isLoading, setIsLoading] = useState(false)
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                      {intent === 'danger' ? (
                        <AlertTriangle className='h-6 w-6 text-red-600' aria-hidden='true' />
                      ) : (
                        <AlertTriangle className='h-6 w-6 text-indigo-600' aria-hidden='true' />
                      )}
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <Dialog.Title as='h3' className='text-base font-semibold leading-6 text-gray-900'>
                        {title}
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>{description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    disabled={isLoading}
                    className={clsx(
                      'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto',
                      {
                        'bg-red-600 hover:bg-red-500': intent === 'danger',
                        'bg-indigo-600 hover:bg-indigo-500': intent === 'default'
                      }
                    )}
                    onClick={async () => {
                      setIsLoading(true)
                      try {
                        await action()
                        toast.success('friend deleted successfully')
                        onClose()
                      } catch (error) {
                        console.log('modal action error', error)
                        toast.error('Something went wrong')
                      }
                      setIsLoading(false)
                    }}
                  >
                    {isLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : btnTitle}
                  </button>
                  <button
                    disabled={isLoading}
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
