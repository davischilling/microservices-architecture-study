import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { Payment } from '../../models/Payment'

jest.mock('../../stripe.ts')

const createPayments = async () => {

  const payment = Payment.build({
    orderId: mongoose.Types.ObjectId().toHexString(),
    stripeId: mongoose.Types.ObjectId().toHexString()
  })
  await payment.save()

  const paymentTwo = Payment.build({
    orderId: mongoose.Types.ObjectId().toHexString(),
    stripeId: mongoose.Types.ObjectId().toHexString()
  })
  await paymentTwo.save()
}

it('Returns an empty array if no payment is found', async () => {
  const response = await request(app)
    .get('/api/payments')
    .set('Cookie', globalThis.signUp())
    .send({})
    .expect(200)
  
  expect(response.body.length).toEqual(0)
})

it('Can fetch a list of payments', async () => {
  await createPayments()

  const response = await request(app)
    .get('/api/payments')
    .send()
    .expect(200)

  expect(response.body.length).toEqual(2)
})