import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'

export const sendFriendRequestAPI = async (email: string) => {
  const res = await axios.post(routes.api.addFriend, { email })
  return res
}
