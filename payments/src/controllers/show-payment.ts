import { NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Payment } from '../models/Payment'

export const showPayment = async (req: Request, res: Response) => {

  const payment = await Payment.findById(req.params.id)

  if (!payment) {
    throw new NotFoundError()
  }

  res.status(200).send(payment)
}