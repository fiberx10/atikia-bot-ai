interface Message {
  content: string
  role: 'user' | 'assistant'
  date: Date
  properties: string[] // property ids
  isError: boolean
}

export { Message }
