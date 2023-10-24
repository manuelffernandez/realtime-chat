import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'

export const sendFriendRequest = async (email: string) => {
  const res = await axios.post(routes.api.addFriend, { email })
  return res
}
