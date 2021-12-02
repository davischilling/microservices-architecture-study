import { TicketUpdatedPublisher } from './../publishers/ticket-updated'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Listener, NotFoundError, OrderCancelledEvent, Subjects } from "@wymaze/common"
import { Ticket } from '../../models/Ticket'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    ticket.set({ orderId: undefined })
    await ticket.save()

    const {
      id,
      title,
      price,
      userId,
      orderId,
      version
    } = ticket

    new TicketUpdatedPublisher(this.client).publish({
      id,
      title,
      price,
      userId,
      orderId,
      version
    })

    msg.ack()
  }
}