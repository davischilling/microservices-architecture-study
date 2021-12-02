import { Ticket } from '../../models/Ticket'
import { Subjects, Listener, TicketCreatedEvent } from '@wymaze/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data
    const ticket = Ticket.build({
      id, title, price
    })
    await ticket.save()
    msg.ack()
  }
}