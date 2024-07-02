import dotenv from 'dotenv'

// load environment variables from .env 
dotenv.config()

// variables from .env, with default values
const MONGODB_URI = process.env.MONGODB_URI || ''
const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 5000

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || ''

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) throw new Error('JWT_KEY is not set')

// variables as config objects to use in other classes
export const config = {
  mongo: {
    uri: MONGODB_URI,
  },
  server: {
    port: SERVER_PORT,
  },
  JWT_SECRET: JWT_SECRET,
  PAYPAL: {
    CLIENT_ID: PAYPAL_CLIENT_ID,
    CLIENT_SECRET: PAYPAL_CLIENT_SECRET,
  },
}
