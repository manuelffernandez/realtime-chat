'use client'

import { SessionProvider } from 'next-auth/react'

interface Props {
  children: React.ReactNode
}

const AuthSessionProvider = (props: Props) => {
  const { children } = props
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthSessionProvider
