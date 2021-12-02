import { TicketUpdatedListener } from './../ticket-updated'
import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@wymaze/common'
import mongoose from 'mongoose'
import { natsWrapper } from './../../../nats-wrapper'
import { Ticket } from '../../../models/Ticket'

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })
  await ticket.save()


  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 99,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('Finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket.title).toEqual(updatedTicket.title)
  expect(updatedTicket.price).toEqual(updatedTicket.price)
  expect(updatedTicket.version).toEqual(updatedTicket.version)
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('Does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup()
  data.version = 10
  try {
    await listener.onMessage(data, msg)
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled()
})