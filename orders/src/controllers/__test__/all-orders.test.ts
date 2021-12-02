import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/Ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()
  return ticket
}

it('Returns an empty array if no order is found', async () => {
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', globalThis.signUp())
    .send({})
    .expect(200)
  
  expect(response.body.length).toEqual(0)
})

it('Returns a 401 unauthorized if the user is not signed in', async () => {
  await request(app)
    .get('/api/orders')
    .send({})
    .expect(401)
})

it('Can fetch a list of orders for a particular user', async () => {
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = globalThis.signUp()
  const userTwo = globalThis.signUp()

  await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const { body: orderOne } = await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders/new-order')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)

})