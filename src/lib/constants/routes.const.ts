export const routes = {
  api: {
    addFriend: '/api/friends/add',
    deleteFriend: '/api/friends/delete',
    acceptFriend: '/api/friends/accept',
    denyFriend: '/api/friends/deny',
    sendMessage: '/api/message/send',
    friendRequests: '/api/friends/requests',
    chat: 'api/message',
    getUser: 'api/user/get'
  },
  pages: {
    home: '/',
    signIn: '/signIn',
    dashboard: '/dashboard',
    friends: '/dashboard/friends',
    addFriend: '/dashboard/add-friend',
    friendRequests: '/dashboard/requests',
    chat: '/dashboard/chat'
  }
}
