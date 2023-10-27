import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import GoogleButton from './components/GoogleButton'

const SignInPage = async () => {
  const session = await getServerSession(nextAuthOptions)

  if (session) redirect(routes.pages.dashboard)

  return (
    <div className='flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='flex w-full max-w-md flex-col items-center space-y-8'>
        <div className='flex flex-col items-center gap-8'>logo</div>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Sign in to your account</h2>
        <GoogleButton />
      </div>
    </div>
  )
}

export default SignInPage
