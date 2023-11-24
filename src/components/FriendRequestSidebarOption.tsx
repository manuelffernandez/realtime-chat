'use client'

import { useFriendRequests } from '@/hooks/useFriendRequests'
import { routes } from '@/lib/constants/routes.const'
import { UserCheck } from 'lucide-react'
import Link from 'next/link'

const FriendRequestSidebarOption = () => {
  const { state } = useFriendRequests()
  const { friendRequests } = state

  return (
    <Link
      href={routes.pages.friendRequests}
      className='group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
    >
      <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
        <UserCheck className='h-4 w-4' />
      </div>
      <p className='truncate'> Friend requests</p>
      {friendRequests.length > 0 ? (
        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white'>
          {friendRequests.length}
        </div>
      ) : null}
    </Link>
  )
}

export default FriendRequestSidebarOption
