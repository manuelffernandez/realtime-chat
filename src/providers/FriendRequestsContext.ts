import { createContext } from 'react'
import { Value } from '@/providers/FriendRequestsProvider'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const FriendRequestsContext = createContext<Value>({} as Value)
