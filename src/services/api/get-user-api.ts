import { routes } from '@/lib/constants/routes.const'
import axios from 'axios'

export const getUserAPI = async (userId: string) => {
  const res = await axios.get<User>(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/${routes.api.getUser}/${userId}`)
  return res
}
