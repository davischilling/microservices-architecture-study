import request from 'supertest'
import app from '../../app'
import { Order } from '../../models/Order'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'
import { OrderStatus } from '@wymaze/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/Payment'

jest.mock('../../stripe.ts')

it('Returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments/new-payment')
    .set('Cookie', globalThis.signUp())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: 'valid_token'
    })

  expect(404)
})

it('Returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 99
  })
  await order.save()
  await request(app)
    .post('/api/payments/new-payment')
    .set('Cookie', globalThis.signUp())
    .send({
      orderId: order.id,
      token: 'valid_token'
    })

  expect(401)
})

it('Returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const cookie = globalThis.signUp(userId)
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    version: 0,
    price: 99
  })
  await order.save()
  await request(app)
    .post('/api/payments/new-payment')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'valid_token'
    })

  expect(400)
})

it('Returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const cookie = globalThis.signUp(userId)
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    version: 0,
    price: 99
  })
  await order.save()
  const response = await request(app)
    .post('/api/payments/new-payment')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(99 * 100)
  expect(chargeOptions.currency).toEqual('eur')
  
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: response.body.stripeId
  })

  expect(payment).not.toBeNull()

})