import { Order } from '../../models/Order'
import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus } from '@wymaze/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { OrderCancelledPublisher } from '../publishers/order-cancelled'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    order.set({
      status: OrderStatus.Cancelled
    })
    await order.save()
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })
    msg.ack()
  }
}