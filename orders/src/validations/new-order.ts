import { body } from 'express-validator'
import mongoose from 'mongoose'

export const newOrderValidation = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('ticketId is required'),
]