interface IncomingFriendRequest {
  senderId: string
  senderEmail: string | null | undefined
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}
