interface User {
  name: string
  email: string
  image: string
  id: string
}

// Chat interface is not used anywhere
interface Chat {
  id: string
  messages: Message[]
}

// Message interface is not used anywhere. instead it is used the Message interface inferred from zod validator at ./src/lib/validations/message.ts
interface Message {
  id: string
  senderId: string
  // receiverId: string
  text: string
  timestamp: number
}

interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
}

interface CustomChat {
  chatId: string
  partnerId: string
}
