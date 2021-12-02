import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { Payment } from '../../models/Payment'

jest.mock('../../stripe.ts')

const createPayment = async () => {
  const payment = Payment.build({
    orderId: mongoose.Types.ObjectId().toHexString(),
    stripeId: mongoose.Types.ObjectId().toHexString()
  })
  return payment.save()
}

it('Returns a 404 if the payment is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  
  await request(app)
    .post(`/api/payments/${id}`)
    .send()
    .expect(404)
})

it('Returns the payment if the payment is found', async () => {
  const payment = await createPayment()

  const paymentResponse = await request(app)
      .get(`/api/payments/${payment.id}`)
      .send({})
      .expect(200)

  expect(paymentResponse.body.stripeId).toEqual(payment.stripeId)
  expect(paymentResponse.body.orderId).toEqual(payment.orderId)

})
