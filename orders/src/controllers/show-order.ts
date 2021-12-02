import { NotAuthorizedError, NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Order } from '../models/Order'

export const showOrder = async (req: Request, res: Response) => {

  const order = await Order.findById({
    _id: req.params.id,
    userId: req.currentUser!.id
  }).populate('ticket')

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  res.status(200).send(order)
}