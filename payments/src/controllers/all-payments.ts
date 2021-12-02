import { NotFoundError } from '@wymaze/common'
import { Request, Response } from 'express'
import { Payment } from '../models/Payment'

export const allPayments = async (req: Request, res: Response) => {
  const payments = await Payment.find({})

  if (!payments) {
    throw new NotFoundError()
  }

  res.status(200).send(payments)
}