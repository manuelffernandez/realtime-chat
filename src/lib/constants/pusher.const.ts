export const pusher = {
  channels: {
    friendRequestsById: (userId: string) => `user__${userId}__friend_requests__incoming`,
    chatById: (chatId: string) => `chat__${chatId}`,
    userChats: (userId: string) => `user__${userId}__chats`,
    userFriends: (userId: string) => `user__${userId}__friends`
  },
  events: {
    incomingFriendRequests: 'incoming_friend_requests',
    outgoingFriendRequests: 'outgoing_friend_requests',
    acceptedFriendRequest: 'accepted__friend__request',
    incomingMessage: 'incoming_message',
    newMessage: 'new_message',
    newFriend: 'new_friend',
    newActiveChat: 'new_active_chat'
  }
}
