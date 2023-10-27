'use client'

import { Button } from '@/components'
import { routes } from '@/lib/constants/routes.const'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, useState } from 'react'
import toast from 'react-hot-toast'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton = (props: Props) => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <Button
      size='sm'
      intent='ghost'
      {...props}
      isLoading={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true)
        try {
          await signOut({ callbackUrl: routes.pages.home })
        } catch (error) {
          toast.error('There was a problem signing out')
        } finally {
          setIsSigningOut(false)
        }
      }}
    >
      {isSigningOut ? null : <LogOut className='h-4 w-4' />}
    </Button>
  )
}

export default SignOutButton
