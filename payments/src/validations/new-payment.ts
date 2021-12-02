import { body } from 'express-validator'

export const newPaymentValidation = [
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
  .not()
  .isEmpty()
]