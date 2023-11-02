export const redisKeys = {
  userById: (id: string) => `user:${id}`,
  idByEmail: (email: string) => `user:email:${email}`,
  friendRequestsById: (id: string) => `user:${id}:friend_requests:incoming`,
  friendsById: (id: string) => `user:${id}:friends`,
  chatById: (chatId: string) => `chat:${chatId}:messages`
}
