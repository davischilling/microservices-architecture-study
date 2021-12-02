import { NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Ticket } from '../models/Ticket'

export const showTicket = async (req: Request, res: Response) => {

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  res.status(200).send(ticket)
}