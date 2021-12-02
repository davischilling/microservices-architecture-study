import request from 'supertest'
import app from '../../app'
import { Ticket } from '../../models/Ticket'
import { natsWrapper } from './../../nats-wrapper'

it('Has a route handler listtening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets/new-ticket')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('Can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets/new-ticket')
    .send({})
    .expect(401)
})

it('Returns other status than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('Returns an error if invalid_title is provided', async () => {
  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      price: 10
    })
    .expect(400)
})

it('Returns an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: 'valid_title',
      price: -10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: 'valid_title',
    })
    .expect(400)
})

it('Create a ticket with valid inputs', async () => {

  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'valid_title'
  const price = 20

  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: title,
      price: price
    })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].title).toEqual(title)
  expect(+tickets[0].price).toEqual(price)

})

it('Publishes an event', async () => {
  const title = 'valid_title'
  const price = 20

  await request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: title,
      price: price
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})