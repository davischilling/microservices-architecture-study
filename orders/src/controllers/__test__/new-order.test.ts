import request from 'supertest'
import app from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/Order'
import { Ticket } from '../../models/Ticket'

it('Returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', globalThis.signUp())
    .send({ticketId})
    .expect(404)
})

it('Returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'valid_id',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save()
  
  await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', globalThis.signUp())
    .send({ticketId: ticket.id})
    .expect(400)
})

it('Reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const response = await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', globalThis.signUp())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(response.body).toBeTruthy()

})

it('Emits order created event', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', globalThis.signUp())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})