import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, NotFoundError, currentUser } from '@wymaze/common'

import { apiV1Router } from './routes/ap1-v1'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: false
}))
app.use(currentUser)

app.use('/api/tickets', apiV1Router)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app