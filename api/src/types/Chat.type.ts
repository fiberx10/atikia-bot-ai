import { Message } from './Message.type'
import { User } from './User.type'

interface Chat {
  id: string
  messages: Message[]
  users: User[]
}

export { Chat }