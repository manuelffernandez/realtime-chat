export const redisKeys = {
  userById: (userId: string) => `user:${userId}`,
  idByEmail: (email: string) => `user:email:${email}`,
  friendRequestsById: (UserId: string) => `user:${UserId}:friend_requests:incoming`,
  friendsById: (userId: string) => `user:${userId}:friends`,
  chatById: (chatId: string) => `chat:${chatId}:messages`,
  chatsByUserId: (userId: string) => `user:${userId}:chats`
}
