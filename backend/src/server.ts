import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { config } from './config/config'
import Logging from './Logging'
import gymRoutes from './routes/gymRoutes'
import userRoutes from './routes/userAccountRoutes'
import gymAccountRoutes from './routes/gymAccountRoutes'
import authRoutes from './routes/authRoutes'
import auth from './middleware/auth'
import subscriptionRoutes from './routes/subscriptionRoutes'

const router = express()

/** Connect to Mongo */
mongoose
  .connect(config.mongo.uri, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Mongo connected successfully.')
    StartServer()
  })
  .catch((error) => Logging.error(error))

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
  /** Log the request */
  router.use((req, res, next) => {
    /** Log the req */
    Logging.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
    )

    res.on('finish', () => {
      /** Log the res */
      Logging.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
      )
    })

    next()
  })

  router.use(express.urlencoded({ extended: true }))
  router.use(express.json())

  /** Serve static files from the "public" directory (for the favicon icon) */
  router.use(express.static('public'))

  /** Rules of our API */
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    )

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET',
      )
      return res.status(200).json({})
    }

    next()
  })

  router.use(auth.createUserContext)

  /** Routes */
  router.use('/gyms', gymRoutes)
  router.use('/users', userRoutes)
  router.use('/gymAccounts', gymAccountRoutes)
  router.use('/login', authRoutes)
  router.use('/subscriptions', auth.isAuthorizedUser, subscriptionRoutes)

  /** Healthcheck */
  router.get('/ping', (req, res, next) =>
    res.status(200).json({ message: 'pong' }),
  )

  /** Error handling */
  router.use((req, res, next) => {
    const error = new Error('Not found')

    Logging.error(error)

    res.status(404).json({
      message: error.message,
    })
  })

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`),
    )
}
