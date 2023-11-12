'use client'

import { type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthSessionProvider from './AuthSessionProvider'
import FriendRequestsProvider from './FriendRequestsProvider'

interface Props {
  children: ReactNode
}

const Providers = (props: Props) => {
  const { children } = props
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <AuthSessionProvider>
        <FriendRequestsProvider>{children}</FriendRequestsProvider>
      </AuthSessionProvider>
    </>
  )
}

export default Providers
