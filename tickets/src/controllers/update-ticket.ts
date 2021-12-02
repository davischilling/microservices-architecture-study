import { natsWrapper } from './../nats-wrapper'
import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated'
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Ticket } from '../models/Ticket'

export const updateTicket = async (req: Request, res: Response) => {

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  if (ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserved ticket')
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  const { title, price } = req.body

  ticket.set({
    title, price
  })
  await ticket.save()

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  })

  res.status(200).send(ticket)
}