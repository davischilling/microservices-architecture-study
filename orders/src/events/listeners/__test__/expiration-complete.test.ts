import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/Order'
import { Ticket } from '../../../models/Ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from './../expiration-complete'
import mongoose from 'mongoose'
import { OrderStatus, ExpirationCompleteEvent } from '@wymaze/common'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'valid_title',
    price: 99
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'user_id',
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, order, data, msg }
}

it('Updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('Emit an OrderCancelled event', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eventData.id).toEqual(order.id)
})

it('Acks previously the message if order has a complete status', async () => {
  const { listener, data, msg, order } = await setup()
  const updatedOrder = await Order.findById(order.id)
  updatedOrder.set({
    status: OrderStatus.Complete
  })
  await updatedOrder.save()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).not.toHaveBeenCalled()
})

it('Acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})