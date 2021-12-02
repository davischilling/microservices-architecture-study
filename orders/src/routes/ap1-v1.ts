import { newOrderValidation } from './../validations'
import { requireAuth, validateRequest } from '@wymaze/common'
import express from 'express'
import { newOrder, showOrder, allOrders, cancelOrder } from '../controllers'

const router = express.Router()

router.post('/new-order',
  requireAuth,
  newOrderValidation,
  validateRequest,
  newOrder
)

router.get('/:id',
  requireAuth,
  showOrder
)

router.get('/',
  requireAuth,
  allOrders
)

router.patch('/cancel-order/:id',
  requireAuth,
  cancelOrder
)


export { router as apiV1Router }