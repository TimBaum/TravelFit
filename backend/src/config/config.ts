import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ''

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 5000

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) throw new Error('JWT_KEY is not set')

export const config = {
  mongo: {
    uri: MONGODB_URI,
  },
  server: {
    port: SERVER_PORT,
  },
  JWT_SECRET: JWT_SECRET,
}
