import { WebSocketServer } from 'ws'
const port = Number(process.env.WS_PORT) || 8080
const path = process.env.WS_PATH || '/ws'
const socket = new WebSocketServer({ port, path })
export default socket
