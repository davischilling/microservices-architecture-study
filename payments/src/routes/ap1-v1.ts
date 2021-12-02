import { newPaymentValidation } from './../validations'
import { requireAuth, validateRequest } from '@wymaze/common'
import express from 'express'
import { newPayment, showPayment, allPayments } from '../controllers'

const router = express.Router()

router.post('/new-payment',
  requireAuth,
  newPaymentValidation,
  validateRequest,
  newPayment)

router.get('/:id',
  showPayment)

router.get('/',
  allPayments)

export { router as apiV1Router }