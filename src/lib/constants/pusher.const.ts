export const pusher = {
  channels: {
    friendRequestsById: (userId: string) => `user__${userId}__friend_requests__incoming`,
    chatById: (chatId: string) => `chat__${chatId}`
  },
  events: {
    incomingFriendRequests: 'incoming_friend_requests',
    outgoingFriendRequests: 'outgoing_friend_requests',
    incomingMessage: 'incoming-message'
  }
}
