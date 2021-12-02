import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from './../../nats-wrapper'
import { Ticket } from '../../models/Ticket'

const createTicket = () => {
  return request(app)
    .post('/api/tickets/new-ticket')
    .set('Cookie', globalThis.signUp())
    .send({
      title: 'valid_title',
      price: 20
    })
}

const createId = () => {
  return new mongoose.Types.ObjectId().toHexString()
}

it('Returns a 401 if the user is not authenticated', async () => {
  const id = createId()
  await request(app)
    .put(`/api/tickets/update-ticket/${id}`)
    .send({
      title: 'valid_title',
      price: 20
    })
    .expect(401)
})

it('Returns a 404 if the provided id does not exist', async () => {
  const id = createId()
  await request(app)
    .put(`/api/tickets/update-ticket/${id}`)
    .set('Cookie', globalThis.signUp())
    .send({
      title: 'valid_title',
      price: 20
    })
    .expect(404)
})

it('Returns a 401 if the user does not own the ticket', async () => {
  const newTicket = await createTicket()

  await request(app)
    .put(`/api/tickets/update-ticket/${newTicket.body.id}`)
    .set('Cookie', globalThis.signUp())
    .send({
      title: 'updated_title',
      price: 1000
    })
    .expect(401)
})

it('Returns a 400 if the user provides an invalid title and price', async () => {
  const cookie = globalThis.signUp()

  const response = await request(app)
    .post(`/api/tickets/new-ticket`)
    .set('Cookie', cookie)
    .send({
      title: 'valid_title',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/update-ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/update-ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid-title',
      price: -20
    })
    .expect(400)

})

it('Update the ticket provided valid inputs', async () => {
  const cookie = globalThis.signUp()

  const response = await request(app)
    .post(`/api/tickets/new-ticket`)
    .set('Cookie', cookie)
    .send({
      title: 'valid_title',
      price: 20
    })

  const title = 'update_title'
  const price = 10

  await request(app)
    .put(`/api/tickets/update-ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      price: price
    })
    .expect(200)

  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  
  expect(ticketResponse.body.title).toEqual(title)
  expect(+ticketResponse.body.price).toEqual(price)
})

it('Publishes an event', async () => {
  const cookie = globalThis.signUp()

  const response = await request(app)
    .post(`/api/tickets/new-ticket`)
    .set('Cookie', cookie)
    .send({
      title: 'valid_title',
      price: 20
    })

  const title = 'update_title'
  const price = 10

  await request(app)
    .put(`/api/tickets/update-ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      price: price
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('Rejects updates if the ticket is reserved', async () => {
  const cookie = globalThis.signUp()

  const response = await request(app)
    .post(`/api/tickets/new-ticket`)
    .set('Cookie', cookie)
    .send({
      title: 'valid_title',
      price: 20
    })

  const ticket = await Ticket.findById(response.body.id)
  ticket.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await ticket.save()

  const title = 'update_title'
  const price = 10

  await request(app)
    .put(`/api/tickets/update-ticket/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: title,
      price: price
    })
    .expect(400)
})