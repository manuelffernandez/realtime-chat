'use client'

import { Button } from '@/components'
import { addFriendDataValidator } from '@/lib/validations/add-friend'
import { sendFriendRequestAPI } from '@/services/api/send-friend-request-api'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type FormData = z.infer<typeof addFriendDataValidator>

const AddFriendButton = () => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(addFriendDataValidator) })

  const addFriend = async (email: string) => {
    setShowSuccessState(false)
    try {
      await sendFriendRequestAPI(email)

      setShowSuccessState(true)
    } catch (error) {
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }

      console.log(error)
      setError('email', { message: 'Something went wrong' })
    }
  }

  const onSubmit = async (data: FormData) => {
    await addFriend(data.email)
  }

  return (
    <form className='max-w-lg' onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
        Add friend by E-Mail
      </label>
      <div className='mt-2 flex gap-4'>
        <input
          {...register('email')}
          type='text'
          className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='you@example.com'
        />
        <Button size='lg' isLoading={isSubmitting}>
          {isSubmitting ? 'Adding' : 'Add'}
        </Button>
      </div>
      <p className='mt1- test-sm text-red-600'>{errors.email?.message}</p>
      {showSuccessState ? <p className='mt1- test-sm text-green-600'>Friend request sent!</p> : null}
    </form>
  )
}

export default AddFriendButton
