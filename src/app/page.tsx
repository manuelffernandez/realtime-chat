import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(nextAuthOptions)

  return (
    <main className='min-h-screen p-24'>
      <h1>Hello world</h1>
      {session !== null ? (
        `Hola ${session.user.name}`
      ) : (
        <Link href={routes.signIn} className='text-slate-800 hover:underline'>
          Sign In
        </Link>
      )}
    </main>
  )
}
