import { Message } from 'node-nats-streaming'
import { OrderCreatedEvent, OrderStatus } from '@wymaze/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/Ticket'
import { natsWrapper } from './../../../nats-wrapper'
import { OrderCreatedListener } from './../order-created'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'valid_title',
    price: 99,
    userId: 'valid_id'
  })
  await ticket.save()
  // Crete the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'valid_id',
    expiresAt: 'valid_date',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('Sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket.orderId).toEqual(data.id)
})

it('Acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('Publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(data.id).toEqual(ticketUpdatedData.orderId)
})