import { OrderCancelledListener } from './../order-cancelled'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent, OrderStatus } from '@wymaze/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/Ticket'
import { natsWrapper } from './../../../nats-wrapper'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)
  // Create an orderId
  const orderId = mongoose.Types.ObjectId().toHexString()
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'valid_title',
    price: 99,
    userId: 'valid_id'
  })
  ticket.set({ orderId })
  await ticket.save()
  // Crete the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id,
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg, orderId }
}

it('Sets the undefined of the tickets orderId', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket.orderId).not.toBeDefined()
})

it('Publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('Acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})