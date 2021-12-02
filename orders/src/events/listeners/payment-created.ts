import { Order } from '../../models/Order'
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus, NotFoundError } from '@wymaze/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new NotFoundError()
    }

    order.set({ status: OrderStatus.Complete })
    await order.save()
    msg.ack()
  }
}