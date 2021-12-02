import { NotFoundError, clientQueries, NotAuthorizedError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Order } from '../models/Order'

export const allOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket')

  if (!orders) {
    throw new NotFoundError()
  }

  res.status(200).send(orders)
}