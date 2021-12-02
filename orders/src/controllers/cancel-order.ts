import { natsWrapper } from '../nats-wrapper'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled'
import { NotAuthorizedError, NotFoundError, OrderStatus } from '@wymaze/common'
import { Request, Response } from 'express'
import { Order } from '../models/Order'

export const cancelOrder = async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.id).populate('ticket')

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  })

  res.status(200).send(order)
}