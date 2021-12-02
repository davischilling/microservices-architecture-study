import { NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Ticket } from '../models/Ticket'

export const allTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined
  })

  if (!tickets) {
    throw new NotFoundError()
  }

  res.status(200).send(tickets)
}