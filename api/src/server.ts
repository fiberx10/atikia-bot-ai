import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import socket from './ws'
import RecommenderCore from './core/Recommender/Recommender.core'
import { Message } from './types/Message.type'
// load environment variables
dotenv.config()

const PORT = Number(process.env.API_PORT) || 3000

const app = express()
const recommender = new RecommenderCore()
const messages: Message[] = []
  ; (async () => {
    app.use(cors({ origin: '*' }))
    app.use(express.json())

    socket.on('connection', function connection(ws) {
      ws.on('message', async function message(data) {
        messages.push({
          role: 'user',
          content: data.toString(),
          date: new Date(),
          isError: false,
          properties: [],
        })
        const res = recommender.chat(messages) ?? {
          role: 'assistant',
          content: 'something went wrong',
          date: new Date(),
          properties: [],
          isError: true,
        }

        let message = ''

        while (res) {
          const { value } = await res.next()

          if (value?.isError || value?.properties?.length > 0 || value?.content === '<|endofmessage|>') {
            ws.send(JSON.stringify(value))
            ws.send(
              JSON.stringify({
                role: 'assistant',
                content: '<|endofmessage|>',
                date: new Date(),
                properties: [],
                isError: true,
              }),
            )
            break
          }

          ws.send(JSON.stringify(value))
          message = message + value?.content ?? ''
        }
        messages.push({
          role: 'user',
          content: message,
          date: new Date(),
          isError: false,
          properties: [],
        })
      })

      ws.send(
        JSON.stringify({
          role: 'assistant',
          content:
            "hello dude, i' AtikiaBot and i'm here to help you find your dream home. How can i help you my friend?",
          date: new Date(),
          properties: [],
          isError: true,
        }),
      )

      ws.send(
        JSON.stringify({
          role: 'assistant',
          content: '<|endofmessage|>',
          date: new Date(),
          properties: [],
          isError: true,
        }),
      )
      messages.push({
        role: 'user',
        content:
          "hello dude, i' AtikiaBot and i'm here to help you find your dream home. How can i help you my friend?",
        date: new Date(),
        isError: false,
        properties: [],
      })
    })

    // listen on port
    app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`)
    })
  })()
