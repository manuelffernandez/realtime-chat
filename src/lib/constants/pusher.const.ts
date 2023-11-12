export const pusher = {
  channels: {
    friendRequestsById: (userId: string) => `user__${userId}__friend_requests__incoming`
  },
  events: {
    incomingFriendRequests: 'incoming_friend_requests',
    deniedFriendRequests: 'denied_friend_requests'
  }
}
