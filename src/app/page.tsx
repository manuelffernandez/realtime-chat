import { nextAuthOptions } from '@/lib/constants/auth.const'
import { routes } from '@/lib/constants/routes.const'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getServerSession(nextAuthOptions)
  if (session) redirect(routes.pages.dashboard)

  return (
    <main className='min-h-screen p-24'>
      <h1>Realtime chat application by Manuel Ferandez</h1>
      <Link href={routes.pages.signIn} className='text-slate-800 hover:underline'>
        Sign In
      </Link>
    </main>
  )
}
