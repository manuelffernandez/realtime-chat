import { routes } from '@/lib/constants/routes.const'
import Link from 'next/link'

const ChatIdNotFound = () => {
  return (
    <div>
      <h2>User not found</h2>
      <p>Could not find requested resource</p>
      <Link href={routes.pages.home} className='text-indigo-600 hover:underline'>
        Return Home
      </Link>
    </div>
  )
}

export default ChatIdNotFound
