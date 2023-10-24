'use client'

import { Button } from '@/components'
import { routes } from '@/lib/constants/routes.const'
import { signOut } from 'next-auth/react'

const SignOutButton = () => {
  return (
    <Button
      intent='danger'
      onClick={() => {
        void signOut({ callbackUrl: routes.pages.home })
      }}
    >
      SignOut
    </Button>
  )
}

export default SignOutButton
