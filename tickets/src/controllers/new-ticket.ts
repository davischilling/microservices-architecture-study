import { Request, Response } from 'express'
import { Ticket } from '../models/Ticket'
import { TicketCreatedPublisher } from './../events/publishers/ticket-created'
import { natsWrapper } from './../nats-wrapper'


export const newTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  })

  await ticket.save()

  new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  })

  res.status(201).send(ticket)
}