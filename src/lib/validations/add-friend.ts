import { z } from 'zod'

export const addFriendDataValidator = z.object({
  email: z.string().email()
})
