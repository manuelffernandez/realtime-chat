import { SignOutButton } from '@/components'
import { nextAuthOptions } from '@/lib/constants/auth.const'
import { getServerSession } from 'next-auth'

const DashboardPage = async () => {
  const session = await getServerSession(nextAuthOptions)

  return (
    <>
      {session !== null ? (
        <>
          <p>Hello {session.user.name}</p>
          <SignOutButton />
        </>
      ) : (
        <p>You are not logged in</p>
      )}
    </>
  )
}

export default DashboardPage
