'use client'

import { pusher } from '@/lib/constants/pusher.const'
import { pusherClient } from '@/lib/pusher'
import { getFriendRequestsAPI } from '@/services/api/get-friend-requests-api'
import { useSession } from 'next-auth/react'
import { Dispatch, useEffect, useReducer, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { FriendRequestsContext } from './FriendRequestsContext'

export interface FriendRequestsState {
  friendRequests: IncomingFriendRequest[]
}

export type FriendRequestsAction =
  | { payload: IncomingFriendRequest; type: 'ADD_FRIEND_REQUEST' | 'REMOVE_FRIEND_REQUEST' }
  | { payload: IncomingFriendRequest[]; type: 'SET_FRIEND_REQUESTS' }

export type Value =
  | { state: FriendRequestsState; dispatch: Dispatch<FriendRequestsAction> }
  | { state: FriendRequestsState }

const initialState: FriendRequestsState = {
  friendRequests: []
}

const reducer = (state: FriendRequestsState, action: FriendRequestsAction): FriendRequestsState => {
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
    events: { incomingFriendRequests, outgoingFriendRequests, acceptedFriendRequest }
  } = pusher

  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: session, status } = useSession()

  const handleIncomingFriendRequest = (data: IncomingFriendRequest) => {
    dispatch({ type: 'ADD_FRIEND_REQUEST', payload: { ...data } })
  }
  const handleOutgoingFriendRequest = (data: IncomingFriendRequest) => {
    dispatch({ type: 'REMOVE_FRIEND_REQUEST', payload: { ...data } })
  }

  const handleAcceptedFriendRequest = (data: User) => {
    toast.success(`${data.name} has accepted your friend request`)
  }

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('channel: ', friendRequestsById(session.user.id))
      console.log('event: ', acceptedFriendRequest)
      pusherClient.subscribe(friendRequestsById(session.user.id))
      pusherClient.bind(incomingFriendRequests, handleIncomingFriendRequest)
      pusherClient.bind(outgoingFriendRequests, handleOutgoingFriendRequest)
      pusherClient.bind(acceptedFriendRequest, handleAcceptedFriendRequest)

      return () => {
        pusherClient.unsubscribe(friendRequestsById(session.user.id))
        pusherClient.unbind(incomingFriendRequests, handleIncomingFriendRequest)
        pusherClient.unbind(outgoingFriendRequests, handleOutgoingFriendRequest)
        pusherClient.unbind(acceptedFriendRequest, handleAcceptedFriendRequest)
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
