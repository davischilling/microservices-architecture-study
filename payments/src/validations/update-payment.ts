import { body } from 'express-validator'

export const updatePaymentValidation = [
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
  .not()
  .isEmpty()
]