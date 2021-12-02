import { body } from 'express-validator'

export const updateTicketValidation = [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
  .not()
  .isEmpty()
  .withMessage('Price is required')
  .isFloat({ gt: 0 })
  .withMessage('Price must be greater than 0')
]