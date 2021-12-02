import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      signUp(id?: string): string[]
    }
    interface globalThis {
      signUp(id?: string): string[]
    }
  }
}

jest.mock('../nats-wrapper.ts')
let mongo: any

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
// jest.setTimeout(60000)

beforeAll(async () => {
  process.env.JWT_KEY = 'super_secret_key_for_test'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})

global.signUp = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'valid@mail.com'
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = { jwt: token }

  const sessionJSON = JSON.stringify(session)

  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`]
}