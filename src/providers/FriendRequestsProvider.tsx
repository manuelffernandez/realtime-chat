'use client'

import { pusher } from '@/lib/constants/pusher.const'
import { pusherClient } from '@/lib/pusher'
import { getFriendRequestsAPI } from '@/services/api/get-friend-requests-api'
import { useSession } from 'next-auth/react'
import { Dispatch, useEffect, useReducer, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { FriendRequestsContext } from './FriendRequestsContext'

export interface State {
  friendRequests: IncomingFriendRequest[]
}

export type Action =
  | { payload: IncomingFriendRequest; type: 'ADD_FRIEND_REQUEST' | 'REMOVE_FRIEND_REQUEST' }
  | { payload: IncomingFriendRequest[]; type: 'SET_FRIEND_REQUESTS' }

export type Value = { state: State; dispatch: Dispatch<Action> } | { state: State }

const initialState: State = {
  friendRequests: []
}

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  switch (type) {
    case 'ADD_FRIEND_REQUEST':
      return {
        friendRequests: [...state.friendRequests, { ...payload }]
      }

    case 'REMOVE_FRIEND_REQUEST':
      return {
        friendRequests: state.friendRequests.filter((req) => req.senderId !== payload.senderId)
      }

    case 'SET_FRIEND_REQUESTS':
      return { friendRequests: action.payload }

    default:
      return state
  }
}

const FriendRequestsProvider = ({ children }: { children: ReactNode }) => {
  const {
    channels: { friendRequestsById },
    events: { incomingFriendRequests, deniedFriendRequests }
  } = pusher

  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: session, status } = useSession()

  const handleAdd = (data: IncomingFriendRequest) => {
    dispatch({ type: 'ADD_FRIEND_REQUEST', payload: { ...data } })
  }
  const handleRemove = (data: IncomingFriendRequest) => {
    dispatch({ type: 'REMOVE_FRIEND_REQUEST', payload: { ...data } })
  }

  useEffect(() => {
    if (status === 'authenticated') {
      pusherClient.subscribe(friendRequestsById(session.user.id))
      pusherClient.bind(incomingFriendRequests, handleAdd)
      pusherClient.bind(deniedFriendRequests, handleRemove)

      return () => {
        pusherClient.unsubscribe(friendRequestsById(session.user.id))
        pusherClient.unbind(incomingFriendRequests, handleAdd)
        pusherClient.unbind(deniedFriendRequests, handleRemove)
      }
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchInitFR = async () => {
        try {
          const res = await getFriendRequestsAPI()
          dispatch({ type: 'SET_FRIEND_REQUESTS', payload: res.data })
        } catch (error) {
          toast.error('Error fetching friend requests')
          console.log('Friend requests provider error: ', error)
        }
      }
      void fetchInitFR()
    }
  }, [status])

  return <FriendRequestsContext.Provider value={{ state, dispatch }}>{children}</FriendRequestsContext.Provider>
}

export default FriendRequestsProvider
