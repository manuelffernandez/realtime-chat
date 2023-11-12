import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'

export const getFriendRequestsAPI = async () => {
  const res = await axios.get<IncomingFriendRequest[]>(routes.api.friendRequests)
  return res
}
