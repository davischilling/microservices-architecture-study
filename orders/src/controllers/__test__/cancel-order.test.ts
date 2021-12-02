import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/Ticket'
import { OrderStatus } from '@wymaze/common'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()
  return ticket
}

it('Returns a 404 if the order is not found', async () => {
  const orderId = mongoose.Types.ObjectId()
  await request(app)
    .patch(`/api/orders/cancel-order/${orderId}`)
    .set('Cookie', globalThis.signUp())
    .send({})
    .expect(404)
})

it('Returns a 401 unauthorized if the user is not signed in', async () => {
  const orderId = mongoose.Types.ObjectId()
  await request(app)
    .patch(`/api/orders/cancel-order/${orderId}`)
    .send({})
    .expect(401)
})

it('Returns a 401 unauthorized if an user try to cancel an other user order', async () => {
  const ticket = await buildTicket()
  const user = globalThis.signUp()

  const { body: order } = await request(app)
    .post(`/api/orders/new-order`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .patch(`/api/orders/cancel-order/${order.id}`)
    .set('Cookie', globalThis.signUp())
    .send({})
    .expect(401)
})

it('Cancel an order', async () => {
  const ticket = await buildTicket()
  const user = globalThis.signUp()

  const { body: order } = await request(app)
    .post(`/api/orders/new-order`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const response = await request(app)
    .patch(`/api/orders/cancel-order/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(200)
  
  expect(response.body.status).toEqual(OrderStatus.Cancelled)
})

it('Emits a order cancelled event', async () => {
  const ticket = await buildTicket()
  const user = globalThis.signUp()

  const { body: order } = await request(app)
    .post(`/api/orders/new-order`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .patch(`/api/orders/cancel-order/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})