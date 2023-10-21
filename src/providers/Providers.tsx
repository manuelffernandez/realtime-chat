'use client'

import { type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthSessionProvider from './AuthSessionProvider'

interface Props {
  children: ReactNode
}

const Providers = (props: Props) => {
  const { children } = props
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </>
  )
}

export default Providers
