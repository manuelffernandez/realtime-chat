import { FriendRequestsContext } from '@/providers/FriendRequestsContext'
import { useContext } from 'react'

export const useFriendRequests = () => {
  const context = useContext(FriendRequestsContext)
  if (!context) {
    throw new Error('useFriendRequests must be used within a FriendRequestsProvider')
  }
  return context
}
